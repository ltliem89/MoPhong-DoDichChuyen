import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat,
} from 'lucide-react';
import { formatPhysics } from '../../physics/mathUtils';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onStep: (delta: number) => void;
  currentTime: number;
  totalDuration: number;
  onSeek: (time: number) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
  onStep,
  currentTime,
  totalDuration,
  onSeek,
  playbackSpeed,
  onSpeedChange,
  isLooping,
  onToggleLoop,
}) => {
  const speeds = [0.25, 0.5, 1, 2, 5];
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="bg-[#090d16]/95 border border-cyan-500/25 p-3 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-2.5">
      {/* Interactive Timeline Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-cyan-300 w-12 text-right">
          {formatPhysics(currentTime, 1)}s
        </span>

        <div className="relative flex-1 flex items-center group">
          <input
            type="range"
            min="0"
            max={totalDuration}
            step="0.05"
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 z-10"
          />
          {/* Custom Filled Track */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-400 rounded-lg pointer-events-none shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="text-xs font-mono font-medium text-slate-400 w-12">
          {formatPhysics(totalDuration, 1)}s
        </span>
      </div>

      {/* Control Buttons & Playback Speed */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1.5 border-t border-slate-800/80">
        {/* Playback Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Rewind */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            title="Quay về mốc 0 giây"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back 0.1s */}
          <button
            onClick={() => onStep(-0.1)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            title="Lùi 0.1 giây"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition shadow-lg ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 ring-1 ring-amber-400/40'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30 ring-1 ring-cyan-400/40'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt đầu chạy</span>
              </>
            )}
          </button>

          {/* Step Forward 0.1s */}
          <button
            onClick={() => onStep(0.1)}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            title="Tiến 0.1 giây"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Loop toggle */}
          <button
            onClick={onToggleLoop}
            className={`p-2 rounded-xl transition ${
              isLooping
                ? 'bg-cyan-600/25 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
            title="Lặp lại chuyển động"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-[#030712] p-1 rounded-xl border border-slate-800">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                playbackSpeed === s
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
