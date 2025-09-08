import { useEffect, useRef } from 'react';
import type { Song, TrackData } from '../types';
import { SYNTH_PRESETS, playSynthNote, playPitchedDrum, playDrumNote } from '../audio/synths';

interface AudioEngineProps {
    song: Song | null;
    isPlaying: boolean;
}

const useAudioEngine = ({ song, isPlaying }: AudioEngineProps) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const nextNoteTimeRef = useRef<number>(0);
    const scheduleIntervalRef = useRef<number | null>(null);
    
    const lookaheadMs = 25.0; 
    const scheduleAheadTimeSec = 0.1; 

    const scheduleNotes = () => {
        if (!audioContextRef.current || !song) return;
        
        const audioCtx = audioContextRef.current;
        const barDuration = (60 / song.tempo) * 4;

        while (nextNoteTimeRef.current < audioCtx.currentTime + scheduleAheadTimeSec) {
            song.tracks.forEach(track => {
                track.pattern.forEach(note => {
                    const noteStartTime = nextNoteTimeRef.current + note.time * barDuration;
                    playNote(audioCtx, track, note, noteStartTime);
                });
            });
            nextNoteTimeRef.current += barDuration;
        }
    };

    const playNote = (audioContext: AudioContext, track: TrackData, note: any, noteStartTime: number) => {
        if (!song) return;
        const barDuration = (60 / song.tempo) * 4;
        const noteDuration = note.duration * barDuration;

        if (track.role === 'Drums') {
            let drumSoundKey: string | null = null;
            switch(note.pitch) {
                case 36: drumSoundKey = `${track.instrument.name}_Kick`; break;
                case 38: drumSoundKey = `${track.instrument.name}_Snare`; break;
                case 42: drumSoundKey = `${track.instrument.name}_Hi-hat`; break;
                default: return;
            }
            const preset = SYNTH_PRESETS[drumSoundKey];
            if (!preset) return;

            // Fix: Use type guards to correctly identify the preset type and call the appropriate player function.
            // The `in` operator checks for property existence and narrows the type.
            if ('player' in preset) {
                // This is a NoiseDrumPreset
                if (preset.player === playDrumNote) {
                    playDrumNote(audioContext, preset, noteStartTime, noteDuration, note.velocity);
                }
            } else if ('pitchEnv' in preset) {
                // This is a PitchedDrumPreset
                playPitchedDrum(audioContext, preset, noteStartTime, noteDuration, note.velocity);
            }

        } else {
            const preset = SYNTH_PRESETS[track.instrument.name];
            if (!preset) return;
            
            // Fix: Use a type guard to ensure the preset is a synth-based instrument.
            // NoiseDrumPreset does not have a 'waveform' property, so this check ensures
            // `preset` is a `SynthPreset` or `PitchedDrumPreset`, both valid for `playSynthNote`.
            if ('waveform' in preset) {
                playSynthNote(audioContext, preset, noteStartTime, noteDuration, note.velocity, note.pitch);
            }
        }
    }


    useEffect(() => {
        if (isPlaying && song) {
            if (!audioContextRef.current) {
                try {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                } catch (e) {
                    console.error("Web Audio API is not supported in this browser");
                    return;
                }
            }
            audioContextRef.current.resume();
            
            nextNoteTimeRef.current = audioContextRef.current.currentTime;
            scheduleIntervalRef.current = window.setInterval(scheduleNotes, lookaheadMs);

        } else {
            if (scheduleIntervalRef.current) {
                clearInterval(scheduleIntervalRef.current);
                scheduleIntervalRef.current = null;
            }
            if (audioContextRef.current && audioContextRef.current.state === 'running') {
                audioContextRef.current.suspend();
            }
        }
        
        return () => {
            if (scheduleIntervalRef.current) {
                clearInterval(scheduleIntervalRef.current);
            }
        };
    }, [isPlaying, song]);
};

export default useAudioEngine;
