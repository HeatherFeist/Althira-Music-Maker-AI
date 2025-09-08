import React from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { StopIcon } from './icons/StopIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';

interface ControlsProps {
    tempo: number;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const Controls: React.FC<ControlsProps> = ({ tempo, isPlaying, setIsPlaying, onUndo, onRedo, canUndo, canRedo }) => {
    
    const handleExport = (format: string) => {
        // TODO: Implement actual export logic
        alert(`Exporting as ${format} is not implemented in this demo.`);
    };

    return (
        <div className="p-4 bg-slate-800 rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <button onClick={onUndo} disabled={!canUndo} className="undo-redo-button">
                        <UndoIcon className="w-6 h-6"/>
                    </button>
                    <button onClick={onRedo} disabled={!canRedo} className="undo-redo-button">
                        <RedoIcon className="w-6 h-6"/>
                    </button>
                </div>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                        isPlaying 
                        ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400' 
                        : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'
                    }`}
                >
                    {isPlaying ? <StopIcon className="w-8 h-8 text-white"/> : <PlayIcon className="w-8 h-8 text-white pl-1"/>}
                </button>
                <div className="text-center">
                    <div className="text-xs text-slate-400">TEMPO</div>
                    <div className="text-3xl font-bold text-white">{Math.round(tempo)}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => handleExport('WAV')} className="control-button"><DownloadIcon className="w-4 h-4 mr-2"/>WAV</button>
                <button onClick={() => handleExport('MP3')} className="control-button"><DownloadIcon className="w-4 h-4 mr-2"/>MP3</button>
                <button onClick={() => handleExport('MIDI')} className="control-button"><DownloadIcon className="w-4 h-4 mr-2"/>MIDI</button>
            </div>
        </div>
    );
};

const style = document.createElement('style');
style.textContent = `
    .control-button {
        display: inline-flex;
        align-items: center;
        padding: 8px 16px;
        background-color: #334155; /* slate-700 */
        color: #cbd5e1; /* slate-300 */
        border: 1px solid #475569; /* slate-600 */
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s;
    }
    .control-button:hover {
        background-color: #475569; /* slate-600 */
    }
    .undo-redo-button {
        padding: 8px;
        background-color: transparent;
        color: #94a3b8; /* slate-400 */
        border-radius: 50%;
        transition: all 0.2s;
    }
    .undo-redo-button:hover:not(:disabled) {
        background-color: #475569; /* slate-600 */
        color: #e2e8f0; /* slate-200 */
    }
    .undo-redo-button:disabled {
        color: #475569; /* slate-600 */
        cursor: not-allowed;
    }
`;
document.head.append(style);

export default Controls;