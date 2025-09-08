import React from 'react';
import type { TrackData, Instrument } from '../types';
import { INSTRUMENT_LIBRARY } from '../constants';
import Timeline from './Timeline';

interface TrackProps {
    trackData: TrackData;
    onInstrumentChange: (instrument: Instrument) => void;
    isPlaying: boolean;
    tempo: number;
}

const roleColors: { [key: string]: string } = {
    Drums: 'bg-rose-500',
    Bass: 'bg-sky-500',
    Chords: 'bg-amber-500',
    Lead: 'bg-fuchsia-500',
    Pads: 'bg-indigo-500',
    Arp: 'bg-teal-500',
};

const Track: React.FC<TrackProps> = ({ trackData, onInstrumentChange, isPlaying, tempo }) => {
    const availableInstruments = INSTRUMENT_LIBRARY[trackData.instrument.category] || [];

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedInstrument = availableInstruments.find(inst => inst.name === e.target.value);
        if (selectedInstrument) {
            onInstrumentChange(selectedInstrument);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch gap-3 p-3 bg-slate-900/50 rounded-lg">
            <div className="flex-none w-full sm:w-48 flex flex-row sm:flex-col justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${roleColors[trackData.role] || 'bg-gray-500'}`}></span>
                    <span className="font-bold text-white">{trackData.role}</span>
                </div>
                <select
                    value={trackData.instrument.name}
                    onChange={handleSelectChange}
                    className="mt-0 sm:mt-1 text-sm bg-slate-700 border border-slate-600 rounded-md p-1.5 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                    {availableInstruments.map(inst => (
                        <option key={inst.name} value={inst.name}>{inst.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex-grow">
                <Timeline pattern={trackData.pattern} role={trackData.role} isPlaying={isPlaying} tempo={tempo} />
            </div>
        </div>
    );
};

export default Track;