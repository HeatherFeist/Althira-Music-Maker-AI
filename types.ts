export interface Song {
    title: string;
    genre: string;
    mood: string;
    lyrics: string;
    tempo: number;
    tracks: TrackData[];
}

export interface StylePreset {
    name: string;
    prompt: string;
}

export interface UserPreset {
    id: string;
    name: string;
    song: Song;
    prompt: string;
    lyrics: string;
    vocalStyle: 'Female' | 'Male';
}

export interface Note {
    time: number;
    duration: number;
    pitch: number;
    velocity: number;
}

export type InstrumentCategory = 'Drums' | 'Bass' | 'Chords' | 'Lead' | 'Pads' | 'Arp';

export interface Instrument {
    name: string;
    category: InstrumentCategory;
}

export interface TrackData {
    id: string | number;
    role: InstrumentCategory;
    instrument: Instrument;
    pattern: Note[];
}