// Fix: Import Instrument and InstrumentCategory types
import type { StylePreset, Instrument, InstrumentCategory } from './types';

export const STYLE_PRESETS: StylePreset[] = [
    {
        name: 'Pop Anthem',
        prompt: 'An upbeat, catchy pop anthem with a powerful chorus and uplifting lyrics.',
    },
    {
        name: 'Hip-Hop',
        prompt: 'A modern hip-hop track with a strong beat, confident lyrical flow, and a memorable hook.',
    },
    {
        name: 'Indie Folk',
        prompt: 'An acoustic indie folk song with heartfelt lyrics, gentle melodies, and a warm, intimate feel.',
    },
    {
        name: 'Synthwave',
        prompt: 'A retro-futuristic synthwave track with driving synth bass, shimmering pads, and a nostalgic 80s vibe.',
    },
    {
        name: 'Rock Ballad',
        prompt: 'An emotional rock power ballad with soaring guitar solos, dramatic dynamics, and passionate vocals.',
    },
    {
        name: 'Country',
        prompt: 'A classic country song about storytelling, with acoustic guitar, a steady rhythm, and sincere lyrics.',
    },
];

// Fix: Add missing INSTRUMENT_LIBRARY constant.
export const INSTRUMENT_LIBRARY: Record<InstrumentCategory, Instrument[]> = {
    Drums: [
        { name: 'Acoustic Kit', category: 'Drums' },
        { name: '808 Kit', category: 'Drums' },
        { name: 'Techno Kit', category: 'Drums' },
    ],
    Bass: [
        { name: 'Electric Bass', category: 'Bass' },
        { name: 'Synth Bass', category: 'Bass' },
        { name: 'Sub Bass', category: 'Bass' },
    ],
    Chords: [
        { name: 'Grand Piano', category: 'Chords' },
        { name: 'Electric Piano', category: 'Chords' },
        { name: 'Synth Pad', category: 'Chords' },
    ],
    Lead: [
        { name: 'Synth Lead', category: 'Lead' },
        { name: 'Distorted Guitar', category: 'Lead' },
        { name: 'Saxophone', category: 'Lead' },
    ],
    Pads: [
        { name: 'String Section', category: 'Pads' },
        { name: 'Warm Pad', category: 'Pads' },
        { name: 'Choir Aahs', category: 'Pads' },
    ],
    Arp: [
        { name: 'Synth Arp', category: 'Arp' },
        { name: 'Pizzicato Strings', category: 'Arp' },
        { name: 'Plucked Synth', category: 'Arp' },
    ],
};
