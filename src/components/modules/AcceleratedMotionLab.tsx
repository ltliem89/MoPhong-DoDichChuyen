import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatPhysics } from '../../physics/mathUtils';

export const AcceleratedMotionLab: React.FC = () => {
  const [v0, setV0] = useState<number>(2.0); // m/s
  const [a, setA] = useState<number>(1.5); // m/s^2
  const [duration, setDuration] = useState<number>(8.0); // seconds

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [t, setT] = useState<number>(0);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setT((prev) => {
        const next = prev + dt;
        if (next >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, duration]);

  // Current Kinematic Equations (SGK Bài 8-9)
  const currentV = v0 + a * t;
  const currentD = v0 * t + 0.5 * a * t * t;
  const currentS = Math.abs(currentD); // For 1D without reversal or integrated

  // Physics state
  const isAccelerating = a * currentV > 0.01;
  const isDecelerating = a * currentV < -0.01;
  const isUniform = Math.abs(a) < 0.01;

  // Visual layout for 1D track
  const trackLength = 120; // 120m virtual width
  const cartPx = Math.max(0, Math.min(740, 50 + (currentD / trackLength) * 680));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Bài 8-9: Chuyển động biến đổi • Gia tốc
            </h2>
            <p className="text-xs text-slate-400">
              Công thức SGK: v = v₀ + a.t • d = v₀.t + ½.a.t² • v² - v₀² = 2ad
            </p>
          </div>
        </div>

        {/* Playback */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Tạm dừng' : 'Chạy thử nghiệm'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setT(0);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1D Visual Acceleration Track Stage */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Dynamic Vector Indicators above vehicle */}
        <div className="relative w-full h-44 bg-slate-900/60 rounded-xl border border-slate-800/80 p-3 select-none">
          {/* Track Rails & Distance Markers */}
          <div className="absolute top-24 left-8 right-8 h-3 bg-slate-700 rounded border-t border-slate-500" />
          <div className="absolute top-28 left-8 right-8 flex justify-between text-[10px] font-mono text-slate-400">
            {[0, 20, 40, 60, 80, 100, 120].map((m) => (
              <span key={m}>{m}m</span>
            ))}
          </div>

          {/* Moving Vehicle & Vectors */}
          <div
            className="absolute top-8 -translate-x-1/2 transition-all duration-75"
            style={{ left: `${cartPx}px` }}
          >
            {/* Velocity Vector (Magenta Arrow) */}
            {Math.abs(currentV) > 0.1 && (
              <div
                className="absolute -top-7 left-1/2 flex items-center gap-1 font-mono text-[10px] font-bold text-fuchsia-400 transition-all"
                style={{
                  transform: `translateX(${currentV < 0 ? '-100%' : '0'})`,
                }}
              >
                <span>v⃗ ({currentV.toFixed(1)}m/s)</span>
                <div
                  className="h-1 bg-fuchsia-400 rounded relative"
                  style={{
                    width: `${Math.min(80, Math.max(15, Math.abs(currentV) * 6))}px`,
                    transform: currentV < 0 ? 'scaleX(-1)' : 'none',
                  }}
                >
                  <span className="absolute -right-1 -top-1 border-t-2 border-r-2 border-fuchsia-400 w-2 h-2 rotate-45" />
                </div>
              </div>
            )}

            {/* Acceleration Vector (Emerald Arrow) */}
            {Math.abs(a) > 0.05 && (
              <div
                className="absolute -top-2 left-1/2 flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-400 transition-all"
                style={{
                  transform: `translateX(${a < 0 ? '-100%' : '0'})`,
                }}
              >
                <span>a⃗ ({a.toFixed(1)}m/s²)</span>
                <div
                  className="h-1 bg-emerald-400 rounded relative"
                  style={{
                    width: `${Math.min(60, Math.max(15, Math.abs(a) * 12))}px`,
                    transform: a < 0 ? 'scaleX(-1)' : 'none',
                  }}
                >
                  <span className="absolute -right-1 -top-1 border-t-2 border-r-2 border-emerald-400 w-2 h-2 rotate-45" />
                </div>
              </div>
            )}

            {/* Car Box */}
            <div className="w-14 h-9 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-lg shadow-xl border border-white/30 flex items-center justify-center text-[10px] font-bold text-white">
              XE (v, a)
            </div>
          </div>
        </div>

        {/* Real-time State & Status Banner */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">Trạng thái:</span>
            <span
              className={`px-2.5 py-1 rounded-lg font-bold ${
                isAccelerating
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : isDecelerating
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}
            >
              {isAccelerating
                ? 'Nhanh dần đều (a · v > 0, cùng chiều)'
                : isDecelerating
                ? 'Chậm dần đều (a · v < 0, ngược chiều)'
                : 'Chuyển động thẳng đều (a = 0)'}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <div>
              <span className="text-slate-400">t = </span>
              <strong className="text-white">{t.toFixed(2)}s</strong>
            </div>
            <div>
              <span className="text-fuchsia-400">v(t) = </span>
              <strong className="text-fuchsia-300">{currentV.toFixed(2)} m/s</strong>
            </div>
            <div>
              <span className="text-cyan-400">d(t) = </span>
              <strong className="text-cyan-300">{currentD.toFixed(2)} m</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
          Điều Chỉnh Thông Số Vật Lí
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* V0 */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-slate-400 flex items-center justify-between mb-1.5">
              <span>Vận tốc ban đầu (v₀):</span>
              <strong className="text-fuchsia-400 font-mono text-sm">{v0.toFixed(1)} m/s</strong>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={v0}
              onChange={(e) => setV0(parseFloat(e.target.value))}
              disabled={isPlaying}
              className="w-full accent-fuchsia-500"
            />
          </div>

          {/* Acceleration a */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-slate-400 flex items-center justify-between mb-1.5">
              <span>Gia tốc (a):</span>
              <strong className="text-emerald-400 font-mono text-sm">{a.toFixed(1)} m/s²</strong>
            </label>
            <input
              type="range"
              min="-3"
              max="4"
              step="0.5"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              disabled={isPlaying}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Total Duration */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-slate-400 flex items-center justify-between mb-1.5">
              <span>Thời gian xét (T):</span>
              <strong className="text-indigo-400 font-mono text-sm">{duration.toFixed(0)} s</strong>
            </label>
            <input
              type="range"
              min="4"
              max="15"
              step="1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              disabled={isPlaying}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
