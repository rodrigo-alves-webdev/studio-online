import React from 'react';
import { Volume2, Mic, Music } from 'lucide-react';
import type { Track as TrackType } from '../../types';

interface TrackProps {
  track: TrackType;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  onSoloToggle: () => void;
}

export function Track({ track, onVolumeChange, onMuteToggle, onSoloToggle }: TrackProps) {
  return (
    <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-2 w-48">
        {track.type === 'audio' ? <Mic className="w-5 h-5" /> : <Music className="w-5 h-5" />}
        <span className="text-white font-medium truncate">{track.name}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onMuteToggle}
          className={`px-3 py-1 rounded ${
            track.muted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          M
        </button>
        <button
          onClick={onSoloToggle}
          className={`px-3 py-1 rounded ${
            track.solo ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          S
        </button>
        
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={track.volume * 100}
            onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
}