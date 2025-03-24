export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  collaborators: string[];
  bpm: number;
  tracks: Track[];
}

export interface Track {
  id: string;
  name: string;
  type: 'midi' | 'audio';
  muted: boolean;
  solo: boolean;
  volume: number;
  pan: number;
  content: MIDITrackContent | AudioTrackContent;
}

export interface MIDITrackContent {
  instrument: string;
  notes: MIDINote[];
}

export interface AudioTrackContent {
  audioUrl: string;
  waveform: number[];
}

export interface MIDINote {
  pitch: number;
  velocity: number;
  startTime: number;
  duration: number;
}