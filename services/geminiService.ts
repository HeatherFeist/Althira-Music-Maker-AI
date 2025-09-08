import { GoogleGenAI, Type } from "@google/genai";
import type { Song, Instrument, InstrumentCategory, TrackData } from '../types';
import { INSTRUMENT_LIBRARY } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const noteSchema = {
    type: Type.OBJECT,
    properties: {
        time: { type: Type.NUMBER, description: "Start time of the note, from 0 (start of the bar) to 1 (end of the bar)." },
        duration: { type: Type.NUMBER, description: "Duration of the note, from 0 to 1." },
        pitch: { type: Type.NUMBER, description: "MIDI note number (e.g., 60 for C4). For Drums, use specific numbers: 36 for Kick, 38 for Snare, 42 for Hi-hat." },
        velocity: { type: Type.NUMBER, description: "Velocity (loudness) of the note, from 0 to 1." },
    },
    required: ["time", "duration", "pitch", "velocity"]
};

const trackSchema = {
    type: Type.OBJECT,
    properties: {
        role: { type: Type.STRING, description: "The role of the track (e.g., 'Drums', 'Bass', 'Chords', 'Lead'). Must be one of the categories from the provided instrument library." },
        instrumentName: { type: Type.STRING, description: "The name of the instrument for this track (e.g., '808 Kit', 'Synth Bass', 'Grand Piano'). Must exist within the specified role's category in the library." },
        pattern: {
            type: Type.ARRAY,
            description: "The musical pattern as a sequence of notes for one bar (16 steps).",
            items: noteSchema
        }
    },
    required: ["role", "instrumentName", "pattern"]
};

const songSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The title of the song." },
        genre: { type: Type.STRING, description: "The primary genre of the song (e.g., 'Pop', 'Hip-Hop', 'Rock')." },
        mood: { type: Type.STRING, description: "The overall mood or feeling of the song (e.g., 'Uplifting', 'Melancholy', 'Energetic')." },
        lyrics: { type: Type.STRING, description: "The full lyrics of the song, including verses, chorus, and bridge. Format with line breaks." },
        tempo: { type: Type.NUMBER, description: "The tempo of the song in beats per minute (BPM), typically between 60 and 180." },
        tracks: {
            type: Type.ARRAY,
            description: "An array of 4-6 musical tracks that make up the song's instrumentation.",
            items: trackSchema
        }
    },
    required: ["title", "genre", "mood", "lyrics", "tempo", "tracks"]
};

export const generateSong = async (prompt: string, vocalStyle: 'Female' | 'Male', lyrics?: string): Promise<Song> => {
    
    let fullPrompt = `Generate a complete song based on the following description: "${prompt}".\n\n`;
    fullPrompt += `The desired vocal style is: ${vocalStyle} voice.\n\n`;
    fullPrompt += `The song should include: a title, genre, mood, tempo (in BPM), full lyrics, and a musical arrangement for one bar (16 steps).\n\n`;
    fullPrompt += `The arrangement should consist of several tracks (e.g., Drums, Bass, Chords, Lead).\n`;
    fullPrompt += `For each track, specify its role, a suitable instrument name, and a pattern of notes.\n`;
    fullPrompt += `A note is defined by its start time (from 0 to 1), duration (from 0 to 1), pitch (MIDI number), and velocity (from 0 to 1).\n\n`;
    fullPrompt += `For drum tracks, use MIDI numbers 36 for kick, 38 for snare, and 42 for hi-hat.\n\n`;
    fullPrompt += `Please choose appropriate instruments from the following library:\n${JSON.stringify(INSTRUMENT_LIBRARY, null, 2)}\n\n`;


    if (lyrics && lyrics.trim().length > 0) {
        fullPrompt += `Use the following lyrics for the song. Structure the song around them, creating a title, genre, mood, and musical arrangement that fit the lyrical content:\n\n---\n${lyrics}\n---\n\n`;
    } else {
        fullPrompt += `Write original lyrics for the song based on the prompt. The lyrics should be complete, with a clear structure (e.g., verses, chorus).\n\n`;
    }

    fullPrompt += "Return only the JSON object matching the defined schema.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: songSchema,
            },
        });
        
        const jsonText = response.text;
        const generatedData = JSON.parse(jsonText);

        const tracksWithInstruments = (generatedData.tracks || []).map((track: any, index: number) => {
            const category = track.role as InstrumentCategory;
            const validInstruments = INSTRUMENT_LIBRARY[category];
            
            if (!validInstruments) {
                console.warn(`AI returned invalid role: ${category}. Skipping track.`);
                return null;
            }
    
            let instrument = validInstruments.find(inst => inst.name === track.instrumentName);
            
            if (!instrument) {
                console.warn(`AI returned invalid instrument '${track.instrumentName}' for role '${category}'. Falling back to default.`);
                instrument = validInstruments[0];
            }
            
            return {
                id: `${track.role}-${index}`,
                role: category,
                instrument: instrument,
                pattern: track.pattern || [],
            };
        }).filter(Boolean) as TrackData[];

        const generatedSong: Song = {
            ...generatedData,
            tracks: tracksWithInstruments,
        };

        if (!generatedSong.title || !generatedSong.lyrics || !generatedSong.tracks || generatedSong.tracks.length === 0) {
            throw new Error("AI returned an invalid song structure. Please try a different prompt.");
        }
        
        return generatedSong;

    } catch (error) {
        console.error("Error generating song from Gemini API:", error);
        throw new Error("Failed to generate song. The AI model might be busy or the prompt could be too complex. Please try again.");
    }
};