interface SynthPreset {
    waveform: OscillatorType;
    envelope: {
        attack: number;
        decay: number;
        sustain: number;
        release: number;
    };
}

interface PitchedDrumPreset extends SynthPreset {
    pitchEnv: {
        attack: number;
        decay: number;
        start: number;
        end: number;
    };
}

interface NoiseDrumPreset {
    player: Function;
    filterType: BiquadFilterType;
    frequency: number;
    envelope: {
        attack: number;
        decay: number;
    };
}

const midiToFreq = (midi: number): number => {
    return Math.pow(2, (midi - 69) / 12) * 440;
};

export const playSynthNote = (
    audioContext: AudioContext,
    preset: SynthPreset,
    time: number,
    duration: number,
    velocity: number,
    midiNote: number
) => {
    const osc = audioContext.createOscillator();
    osc.type = preset.waveform;
    osc.frequency.setValueAtTime(midiToFreq(midiNote), time);

    const gainNode = audioContext.createGain();
    const peakGain = velocity * 0.3;
    const { attack, decay, sustain, release } = preset.envelope;
    const releaseTime = Math.min(duration, release);

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(peakGain, time + attack);
    gainNode.gain.linearRampToValueAtTime(peakGain * sustain, time + attack + decay);
    
    const releaseStartTime = time + duration - releaseTime;
    if (releaseStartTime > time + attack + decay) {
       gainNode.gain.setValueAtTime(peakGain * sustain, releaseStartTime);
    }
    gainNode.gain.linearRampToValueAtTime(0, time + duration);

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start(time);
    osc.stop(time + duration + 0.1);
};

export const playPitchedDrum = (
    audioContext: AudioContext,
    preset: PitchedDrumPreset,
    time: number,
    duration: number,
    velocity: number
) => {
    const osc = audioContext.createOscillator();
    osc.type = preset.waveform;

    const gainNode = audioContext.createGain();
    const peakGain = velocity * 0.9;
    const { attack, decay, sustain, release } = preset.envelope;

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(peakGain, time + attack);
    gainNode.gain.linearRampToValueAtTime(peakGain * sustain, time + attack + decay);
    const releaseStartTime = time + duration - release;
    if (releaseStartTime > time + attack + decay) {
        gainNode.gain.setValueAtTime(peakGain * sustain, releaseStartTime);
    }
    gainNode.gain.linearRampToValueAtTime(0, time + duration);
    
    const { attack: pAttack, decay: pDecay, start, end } = preset.pitchEnv;
    osc.frequency.setValueAtTime(start, time);
    osc.frequency.linearRampToValueAtTime(start, time + pAttack);
    osc.frequency.exponentialRampToValueAtTime(end, time + pAttack + pDecay);

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start(time);
    osc.stop(time + duration);
};

export const playDrumNote = (
    audioContext: AudioContext,
    preset: NoiseDrumPreset,
    time: number,
    duration: number,
    velocity: number,
) => {
    const bufferSize = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = preset.filterType;
    noiseFilter.frequency.setValueAtTime(preset.frequency, time);
    
    const noiseEnvelope = audioContext.createGain();
    const peakGain = velocity * 0.7;
    const { attack, decay } = preset.envelope;

    noiseEnvelope.gain.setValueAtTime(0, time);
    noiseEnvelope.gain.linearRampToValueAtTime(peakGain, time + attack);
    noiseEnvelope.gain.exponentialRampToValueAtTime(0.001, time + attack + decay);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseEnvelope);
    noiseEnvelope.connect(audioContext.destination);

    noise.start(time);
    noise.stop(time + duration);
};

export const SYNTH_PRESETS: { [key: string]: SynthPreset | PitchedDrumPreset | NoiseDrumPreset } = {
    'Electric Bass': { waveform: 'sine', envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.2 } },
    'Synth Bass': { waveform: 'sawtooth', envelope: { attack: 0.02, decay: 0.4, sustain: 0.3, release: 0.3 } },
    'Sub Bass': { waveform: 'sine', envelope: { attack: 0.01, decay: 0.5, sustain: 0.4, release: 0.4 } },
    'Grand Piano': { waveform: 'triangle', envelope: { attack: 0.01, decay: 1.0, sustain: 0.1, release: 0.5 } },
    'Electric Piano': { waveform: 'sine', envelope: { attack: 0.02, decay: 0.8, sustain: 0.3, release: 0.4 } },
    'Synth Pad': { waveform: 'triangle', envelope: { attack: 0.5, decay: 1.0, sustain: 0.8, release: 1.0 } },
    'Synth Lead': { waveform: 'square', envelope: { attack: 0.05, decay: 0.5, sustain: 0.6, release: 0.3 } },
    'Distorted Guitar': { waveform: 'sawtooth', envelope: { attack: 0.01, decay: 0.7, sustain: 0.2, release: 0.2 } },
    'Saxophone': { waveform: 'sawtooth', envelope: { attack: 0.1, decay: 0.4, sustain: 0.5, release: 0.3 } },
    'String Section': { waveform: 'sawtooth', envelope: { attack: 0.8, decay: 1.5, sustain: 0.9, release: 1.2 } },
    'Warm Pad': { waveform: 'triangle', envelope: { attack: 1.0, decay: 1.2, sustain: 0.8, release: 1.5 } },
    'Choir Aahs': { waveform: 'sine', envelope: { attack: 0.7, decay: 1.1, sustain: 0.7, release: 1.0 } },
    'Synth Arp': { waveform: 'square', envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.1 } },
    'Pizzicato Strings': { waveform: 'triangle', envelope: { attack: 0.01, decay: 0.15, sustain: 0.05, release: 0.1 } },
    'Plucked Synth': { waveform: 'sawtooth', envelope: { attack: 0.01, decay: 0.25, sustain: 0.1, release: 0.2 } },

    'Acoustic Kit_Kick': { player: playDrumNote, filterType: 'lowpass', frequency: 120, envelope: { attack: 0.01, decay: 0.2 } },
    'Acoustic Kit_Snare': { player: playDrumNote, filterType: 'bandpass', frequency: 1500, envelope: { attack: 0.01, decay: 0.2 } },
    'Acoustic Kit_Hi-hat': { player: playDrumNote, filterType: 'highpass', frequency: 7000, envelope: { attack: 0.01, decay: 0.1 } },
    
    '808 Kit_Kick': { waveform: 'sine', envelope: { attack: 0.01, decay: 0.4, sustain: 0.01, release: 0.1 }, pitchEnv: { attack: 0.01, decay: 0.1, start: 120, end: 40 } },
    '808 Kit_Snare': { player: playDrumNote, filterType: 'bandpass', frequency: 2000, envelope: { attack: 0.01, decay: 0.15 } },
    '808 Kit_Hi-hat': { player: playDrumNote, filterType: 'highpass', frequency: 8000, envelope: { attack: 0.01, decay: 0.05 } },
    
    'Techno Kit_Kick': { waveform: 'square', envelope: { attack: 0.01, decay: 0.2, sustain: 0.01, release: 0.1 }, pitchEnv: { attack: 0.01, decay: 0.05, start: 100, end: 50 } },
    'Techno Kit_Snare': { player: playDrumNote, filterType: 'bandpass', frequency: 1800, envelope: { attack: 0.01, decay: 0.1 } },
    'Techno Kit_Hi-hat': { player: playDrumNote, filterType: 'highpass', frequency: 9000, envelope: { attack: 0.01, decay: 0.15 } },
};