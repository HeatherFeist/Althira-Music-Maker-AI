import React from 'react';

interface LyricsInputProps {
    lyrics: string;
    setLyrics: (lyrics: string) => void;
}

const LyricsInput: React.FC<LyricsInputProps> = ({ lyrics, setLyrics }) => {
    return (
        <div className="p-6 bg-slate-800 rounded-xl shadow-lg space-y-4 h-full flex flex-col">
            <label htmlFor="lyrics-input" className="block text-sm font-medium text-slate-300">
                2. Add Lyrics (Optional)
            </label>
            <p className="text-xs text-slate-400 -mt-2">If provided, the AI will generate a song based on your lyrics. If left blank, it will write original lyrics.</p>
            <textarea
                id="lyrics-input"
                rows={10}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors flex-grow"
                placeholder="Enter lyrics here..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
            />
        </div>
    );
};

export default LyricsInput;