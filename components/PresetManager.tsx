import React, { useState } from 'react';
import type { UserPreset } from '../types';
import { SaveIcon } from './icons/SaveIcon';
import { TrashIcon } from './icons/TrashIcon';

interface PresetManagerProps {
    presets: UserPreset[];
    onSave: (name: string) => void;
    onLoad: (preset: UserPreset) => void;
    onDelete: (id: string) => void;
    isDisabled: boolean;
}

const PresetManager: React.FC<PresetManagerProps> = ({ presets, onSave, onLoad, onDelete, isDisabled }) => {
    const [presetName, setPresetName] = useState('');
    const [showInput, setShowInput] = useState(false);

    const handleSaveClick = () => {
        if (presetName.trim()) {
            onSave(presetName.trim());
            setPresetName('');
            setShowInput(false);
        }
    };

    return (
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-slate-200">My Songs</h2>
            
            {showInput ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        placeholder="Song Name"
                        className="flex-grow bg-slate-900 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500"
                    />
                    <button onClick={handleSaveClick} className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg text-white font-semibold">Save</button>
                    <button onClick={() => setShowInput(false)} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-white">Cancel</button>
                </div>
            ) : (
                <button
                    onClick={() => setShowInput(true)}
                    disabled={isDisabled}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-600 text-base font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SaveIcon className="w-5 h-5" /> Save Current Song
                </button>
            )}

            <div className="space-y-2 pt-2 max-h-48 overflow-y-auto">
                {presets.length > 0 ? (
                    presets.map(preset => (
                        <div key={preset.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-md">
                            <button onClick={() => onLoad(preset)} className="text-left text-cyan-400 hover:underline flex-grow">
                                {preset.name}
                            </button>
                            <button onClick={() => onDelete(preset.id)} className="p-1 text-slate-400 hover:text-rose-500">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No saved songs yet.</p>
                )}
            </div>
        </div>
    );
};

export default PresetManager;