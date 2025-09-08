import React, { useState, useEffect } from 'react';
import type { Song } from '../types';
import { MusicNoteIcon } from './icons/MusicNoteIcon';
import { PlayIcon } from './icons/PlayIcon';
import { StopIcon } from './icons/StopIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface SongPlayerProps {
    song: Song;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
}

const SIMULATED_DURATION_SECONDS = 30;

const SongPlayer: React.FC<SongPlayerProps> = ({ song, isPlaying, setIsPlaying }) => {
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        let intervalId: number;
        if (isPlaying) {
            // If song ended, restart it when play is pressed again.
            if (currentTime >= SIMULATED_DURATION_SECONDS) {
                setCurrentTime(0);
            }
            
            intervalId = window.setInterval(() => {
                setCurrentTime(prev => {
                    const newTime = prev + 0.1;
                    if (newTime >= SIMULATED_DURATION_SECONDS) {
                        clearInterval(intervalId);
                        setIsPlaying(false);
                        return SIMULATED_DURATION_SECONDS;
                    }
                    return newTime;
                });
            }, 100);
        } else {
            // Reset time when stopped externally or by finishing
            setCurrentTime(0);
        }
        return () => clearInterval(intervalId);
    }, [isPlaying, setIsPlaying]);

    const progress = (currentTime / SIMULATED_DURATION_SECONDS) * 100;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-200 tracking-wide">Generated Song</h2>
            <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0 w-full sm:w-40 h-40 bg-gradient-to-br from-fuchsia-600 to-cyan-500 rounded-lg flex items-center justify-center">
                        <MusicNoteIcon className="w-20 h-20 text-white/50" />
                    </div>
                    <div className="flex flex-col justify-center flex-grow">
                        <h3 className="text-3xl font-bold text-white">{song.title}</h3>
                        <p className="text-slate-300 mt-1 capitalize">{song.genre} &bull; {song.mood}</p>
                        <div className="mt-4 space-y-2">
                             <div className="w-full bg-slate-700 rounded-full h-1.5">
                                <div className="bg-fuchsia-500 h-1.5 rounded-full transition-width duration-100" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(SIMULATED_DURATION_SECONDS)}</span>
                            </div>
                        </div>
                         <div className="mt-2 flex items-center gap-4">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                    isPlaying 
                                    ? 'bg-amber-500 hover:bg-amber-600' 
                                    : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                {isPlaying ? <StopIcon className="w-8 h-8 text-white"/> : <PlayIcon className="w-8 h-8 text-white pl-1"/>}
                            </button>
                            <button disabled className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-400 bg-slate-700 cursor-not-allowed">
                                <DownloadIcon className="w-4 h-4 mr-2"/>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
                 <div className="bg-slate-900/50 p-6">
                    <h4 className="text-lg font-semibold text-slate-200 mb-2">Lyrics</h4>
                    <pre className="text-slate-300 whitespace-pre-wrap font-sans text-sm max-h-60 overflow-y-auto">
                        {song.lyrics}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default SongPlayer;