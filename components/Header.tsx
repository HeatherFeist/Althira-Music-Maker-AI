import React from 'react';
import { MusicNoteIcon } from './icons/MusicNoteIcon';

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between pb-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fuchsia-500 rounded-lg flex items-center justify-center">
                    <MusicNoteIcon className="w-6 h-6 text-white"/>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    AI Song Generator
                </h1>
            </div>
            <p className="hidden md:block text-slate-400">Powered by Gemini</p>
        </header>
    );
}

export default Header;