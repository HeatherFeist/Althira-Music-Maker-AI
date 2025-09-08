import React from 'react';
import type { TrackData, Instrument } from '../types';
import Track from './Track';

interface TrackViewProps {
    tracks: TrackData[];
    onInstrumentChange: (trackIndex: number, newInstrument: Instrument) => void;
    isPlaying: boolean;
    tempo: number;
}

const TrackView: React.FC<TrackViewProps> = ({ tracks, onInstrumentChange, isPlaying, tempo }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-200 tracking-wide">Beat Layers</h2>
            <div className="p-4 bg-slate-800 rounded-xl shadow-lg space-y-3">
                {tracks.map((track, index) => (
                    <Track
                        key={track.id || index}
                        trackData={track}
                        onInstrumentChange={(newInstrument) => onInstrumentChange(index, newInstrument)}
                        isPlaying={isPlaying}
                        tempo={tempo}
                    />
                ))}
            </div>
        </div>
    );
};

export default TrackView;