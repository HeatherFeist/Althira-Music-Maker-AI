import React, { useState, useEffect } from 'react';
import type { Note } from '../types';

interface TimelineProps {
    pattern: Note[];
    role: string;
    isPlaying: boolean;
    tempo: number;
}

const roleColors: { [key: string]: string } = {
    Drums: 'bg-rose-500/80 border-rose-400',
    Bass: 'bg-sky-500/80 border-sky-400',
    Chords: 'bg-amber-500/80 border-amber-400',
    Lead: 'bg-fuchsia-500/80 border-fuchsia-400',
    Pads: 'bg-indigo-500/80 border-indigo-400',
    Arp: 'bg-teal-500/80 border-teal-400',
};

const STEPS = 16;

const Timeline: React.FC<TimelineProps> = ({ pattern, role, isPlaying, tempo }) => {
    const [playhead, setPlayhead] = useState(-1);
    
    useEffect(() => {
        let intervalId: number;
        if (isPlaying) {
            // Duration of one 16th note step in milliseconds
            const stepDuration = (60 * 1000) / tempo / 4;
            setPlayhead(0);
            intervalId = window.setInterval(() => {
                setPlayhead(prev => (prev + 1) % STEPS);
            }, stepDuration); 
        } else {
            setPlayhead(-1);
        }
        return () => clearInterval(intervalId);
    }, [isPlaying, tempo]);

    return (
        <div className="w-full h-16 bg-slate-800 rounded-md p-1 grid grid-cols-16 gap-px relative overflow-hidden">
            {[...Array(STEPS)].map((_, i) => (
                <div key={i} className={`h-full rounded-sm ${i % 4 === 0 ? 'bg-slate-700/50' : 'bg-slate-700/20'}`}></div>
            ))}
            
            {pattern && pattern.map((note, index) => {
                const startStep = Math.round(note.time * STEPS);
                const durationSteps = Math.max(1, Math.round(note.duration * STEPS));
                return (
                    <div
                        key={index}
                        className={`absolute top-1 bottom-1 rounded-sm transition-all duration-100 ${roleColors[role] || 'bg-gray-500'}`}
                        style={{
                            left: `calc(${(startStep / STEPS) * 100}% + 1px)`,
                            width: `calc(${(durationSteps / STEPS) * 100}% - 2px)`,
                            opacity: note.velocity,
                        }}
                    ></div>
                );
            })}
             {playhead !== -1 && (
                <div
                    className="absolute top-0 bottom-0 w-1 bg-cyan-300/50 rounded-full transition-transform duration-100 ease-linear"
                    style={{ transform: `translateX(${playhead * 100}%)` }}
                 />
            )}
        </div>
    );
};

const style = document.createElement('style');
style.textContent = `
    .grid-cols-16 {
        grid-template-columns: repeat(16, minmax(0, 1fr));
    }
`;
document.head.appendChild(style);


export default Timeline;