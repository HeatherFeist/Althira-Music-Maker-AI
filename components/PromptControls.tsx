import React from 'react';
import type { StylePreset } from '../types';
import { STYLE_PRESETS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptControlsProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    vocalStyle: 'Female' | 'Male';
    setVocalStyle: (style: 'Female' | 'Male') => void;
    onGenerate: () => void;
    onSurpriseMe: () => void;
    onSelectPreset: (preset: StylePreset) => void;
    isLoading: boolean;
}

const PromptControls: React.FC<PromptControlsProps> = ({ prompt, setPrompt, vocalStyle, setVocalStyle, onGenerate, onSurpriseMe, onSelectPreset, isLoading }) => {
    return (
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg space-y-4">
            <div>
                <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-300 mb-2">
                    1. Describe Your Song
                </label>
                <textarea
                    id="prompt-input"
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors"
                    placeholder="e.g., A synthwave song about driving through a neon city at night"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </div>
            
            <div>
                 <h3 className="text-sm font-medium text-slate-300 mb-2">Or Start with a Style</h3>
                <div className="flex flex-wrap gap-2">
                    {STYLE_PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => onSelectPreset(preset)}
                            className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-400"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                 <h3 className="text-sm font-medium text-slate-300 mb-2">Vocal Style</h3>
                <div className="flex rounded-lg bg-slate-700 p-1">
                    <button 
                        onClick={() => setVocalStyle('Female')}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${vocalStyle === 'Female' ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
                    >
                        Female Voice
                    </button>
                    <button 
                        onClick={() => setVocalStyle('Male')}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${vocalStyle === 'Male' ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
                    >
                        Male Voice
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !prompt}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
                >
                    {isLoading ? 'Generating...' : 'Generate Song'}
                </button>
                <button
                    onClick={onSurpriseMe}
                    disabled={isLoading}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all gap-2"
                >
                    <SparklesIcon className="w-5 h-5" />
                    Surprise Me!
                </button>
            </div>
        </div>
    );
};

export default PromptControls;