import React, { useState, useEffect, useCallback } from 'react';
import type { Song, StylePreset, UserPreset, Instrument } from './types';
import { generateSong } from './services/geminiService';
import useAudioEngine from './hooks/useAudioEngine';
import Header from './components/Header';
import PromptControls from './components/PromptControls';
import SongPlayer from './components/SongPlayer';
import LyricsInput from './components/LyricsInput';
import PresetManager from './components/PresetManager';
import Controls from './components/Controls';
import TrackView from './components/TrackView';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [lyrics, setLyrics] = useState<string>('');
    const [vocalStyle, setVocalStyle] = useState<'Female' | 'Male'>('Female');
    
    const [history, setHistory] = useState<(Song | null)[]>([null]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const song = history[historyIndex];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userPresets, setUserPresets] = useState<UserPreset[]>([]);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useAudioEngine({ song, isPlaying });

    useEffect(() => {
        try {
            const storedPresets = localStorage.getItem('ai-song-generator-presets');
            if (storedPresets) {
                setUserPresets(JSON.parse(storedPresets));
            }
        } catch (e) {
            console.error("Failed to load presets from localStorage", e);
        }
    }, []);
    
    const updateSong = (newSong: Song | null) => {
        const newHistory = [...history.slice(0, historyIndex + 1), newSong];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleGenerate = useCallback(async (currentPrompt: string) => {
        setIsLoading(true);
        setError(null);
        setHistory([null]);
        setHistoryIndex(0);
        setIsPlaying(false);
        try {
            const generatedSong = await generateSong(currentPrompt, vocalStyle, lyrics);
            setHistory([generatedSong]);
            setHistoryIndex(0);
            if (!lyrics && generatedSong.lyrics) {
                setLyrics(generatedSong.lyrics);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [lyrics, vocalStyle]);
    
    const handleSurpriseMe = useCallback(async () => {
        const surprisePrompt = "A completely random, unique, and interesting song. Surprise me with the genre, mood, and subject matter.";
        setPrompt(surprisePrompt);
        setLyrics('');
        await handleGenerate(surprisePrompt);
    }, [handleGenerate]);

    const handleSelectPreset = (preset: StylePreset) => {
        setPrompt(preset.prompt);
    };

    const handleSavePreset = (name: string) => {
        if (!song) {
            alert("No song to save!");
            return;
        }
        const newPreset: UserPreset = {
            id: Date.now().toString(),
            name,
            song,
            prompt,
            vocalStyle,
            lyrics,
        };
        const updatedPresets = [...userPresets, newPreset];
        setUserPresets(updatedPresets);
        try {
            localStorage.setItem('ai-song-generator-presets', JSON.stringify(updatedPresets));
        } catch(e) {
            console.error("Failed to save presets to localStorage", e);
            setError("Could not save preset. Storage might be full.");
        }
    };
    
    const handleLoadPreset = (preset: UserPreset) => {
        setPrompt(preset.prompt);
        setLyrics(preset.lyrics);
        setVocalStyle(preset.vocalStyle);
        setHistory([preset.song]);
        setHistoryIndex(0);
        setIsPlaying(false);
    };

    const handleDeletePreset = (id: string) => {
        const updatedPresets = userPresets.filter(p => p.id !== id);
        setUserPresets(updatedPresets);
        try {
            localStorage.setItem('ai-song-generator-presets', JSON.stringify(updatedPresets));
        } catch(e) {
            console.error("Failed to delete preset from localStorage", e);
            setError("Could not delete preset.");
        }
    };

    const handleInstrumentChange = (trackIndex: number, newInstrument: Instrument) => {
        if (!song) return;
        
        const newTracks = [...song.tracks];
        const trackToUpdate = newTracks[trackIndex];
        
        if (trackToUpdate) {
            newTracks[trackIndex] = { ...trackToUpdate, instrument: newInstrument };
            const newSong = { ...song, tracks: newTracks };
            updateSong(newSong);
        }
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setIsPlaying(false);
            setHistoryIndex(historyIndex - 1);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setIsPlaying(false);
            setHistoryIndex(historyIndex + 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <PromptControls
                            prompt={prompt}
                            setPrompt={setPrompt}
                            vocalStyle={vocalStyle}
                            setVocalStyle={setVocalStyle}
                            onGenerate={() => handleGenerate(prompt)}
                            onSurpriseMe={handleSurpriseMe}
                            onSelectPreset={handleSelectPreset}
                            isLoading={isLoading}
                        />
                         {isLoading && (
                            <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-lg h-64">
                                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-fuchsia-500"></div>
                                <p className="mt-4 text-slate-300 tracking-wider">AI is composing your song...</p>
                                <p className="mt-2 text-xs text-slate-400">This may take a moment.</p>
                            </div>
                        )}
                        {error && (
                            <div className="p-4 bg-red-500/20 text-red-300 border border-red-500 rounded-lg">
                                <strong>Error:</strong> {error}
                            </div>
                        )}
                        {song && !isLoading && (
                            <div className="space-y-8">
                                <SongPlayer 
                                    song={song}
                                    isPlaying={isPlaying}
                                    setIsPlaying={setIsPlaying}
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-slate-200 tracking-wide mb-4">Beat Making</h2>
                                    <div className="space-y-4">
                                        <Controls
                                            tempo={song.tempo}
                                            isPlaying={isPlaying}
                                            setIsPlaying={setIsPlaying}
                                            onUndo={handleUndo}
                                            onRedo={handleRedo}
                                            canUndo={historyIndex > 0}
                                            canRedo={historyIndex < history.length - 1}
                                        />
                                        <TrackView
                                            tracks={song.tracks}
                                            onInstrumentChange={handleInstrumentChange}
                                            isPlaying={isPlaying}
                                            tempo={song.tempo}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1 space-y-8">
                       <PresetManager
                            presets={userPresets}
                            onSave={handleSavePreset}
                            onLoad={handleLoadPreset}
                            onDelete={handleDeletePreset}
                            isDisabled={!song || isLoading}
                        />
                        <LyricsInput
                          lyrics={lyrics}
                          setLyrics={setLyrics}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;