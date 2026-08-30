import React, { useState } from 'react';
import { LineChart as ChartIcon, Sparkles, TrendingUp, Sliders } from 'lucide-react';
import { GraphDataPoint, MotionState } from '../../types/physics';
import { formatPhysics } from '../../physics/mathUtils';

interface KinematicsGraphViewProps {
  graphData: GraphDataPoint[];
  motionState: MotionState;
  currentTime: number;
  totalDuration: number;
  onSeekTime: (t: number) => void;
}

export const KinematicsGraphView: React.FC<KinematicsGraphViewProps> = ({
  graphData,
  motionState,
  currentTime,
  totalDuration,
  onSeekTime,
}) => {
  const [activeGraphType, setActiveGraphType] = useState<'d_t' | 'v_t' | 's_t'>('d_t');

  // Interactive Slope Explorer Markers
  const [t1, setT1] = useState<number>(1.0);
  const [t2, setT2] = useState<number>(4.0);

  // Speed compare preset for uniform motion
  const [compareSpeed, setCompareSpeed] = useState<number>(4);

  // Graph dimensions
  const width = 640;
  const height = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };

  // Calculate max bounds
  const maxTime = Math.max(1, totalDuration);
  const maxDistance = Math.max(
    10,
    ...graphData.map((p) => Math.max(p.s, p.d))
  );
  const maxSpeed = Math.max(
    5,
    ...graphData.map((p) => Math.max(p.v_inst, p.v_avg))
  );

  const currentMaxY =
    activeGraphType === 'v_t' ? maxSpeed * 1.2 : maxDistance * 1.1;

  // Coordinate transforms
  const getX = (t: number) =>
    padding.left + (t / maxTime) * (width - padding.left - padding.right);
  const getY = (val: number) =>
    height - padding.bottom - (val / currentMaxY) * (height - padding.top - padding.bottom);

  // Sample values at t1 and t2 for slope calculation
  const getInterpolatedValue = (t: number, key: 'd' | 's' | 'v_inst') => {
    if (graphData.length === 0) return 0;
    const clampedT = Math.max(0, Math.min(t, maxTime));
    const idx = (clampedT / maxTime) * (graphData.length - 1);
    const low = Math.floor(idx);
    const high = Math.min(graphData.length - 1, Math.ceil(idx));
    const frac = idx - low;
    const v0 = graphData[low]?.[key] || 0;
    const v1 = graphData[high]?.[key] || 0;
    return v0 + frac * (v1 - v0);
  };

  const d1 = getInterpolatedValue(t1, 'd');
  const d2 = getInterpolatedValue(t2, 'd');
  const deltaT = Math.max(0.01, t2 - t1);
  const deltaD = d2 - d1;
  const slopeV = deltaD / deltaT;

  // SVG Paths
  const displacementPath = graphData.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(p.t).toFixed(1)} ${getY(p.d).toFixed(1)}`;
  }, '');

  const distancePath = graphData.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(p.t).toFixed(1)} ${getY(p.s).toFixed(1)}`;
  }, '');

  const speedPath = graphData.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(p.t).toFixed(1)} ${getY(p.v_inst).toFixed(1)}`;
  }, '');

  return (
    <div className="bg-[#090d16]/95 border border-cyan-500/25 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-4">
      {/* Header & Graph Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-200">
            Đồ Thị Động Học Đồng Bộ Thời Gian Thực
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#030712] p-1 rounded-xl border border-cyan-500/30 text-xs">
          <button
            onClick={() => setActiveGraphType('d_t')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              activeGraphType === 'd_t'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đồ thị d – t (Độ dịch chuyển)
          </button>
          <button
            onClick={() => setActiveGraphType('s_t')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              activeGraphType === 's_t'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đồ thị s – t (Quãng đường)
          </button>
          <button
            onClick={() => setActiveGraphType('v_t')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              activeGraphType === 'v_t'
                ? 'bg-fuchsia-500 text-slate-950 shadow-[0_0_10px_rgba(232,121,249,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đồ thị v – t (Vận tốc)
          </button>
        </div>
      </div>

      {/* Main SVG Graph Plot */}
      <div className="relative bg-[#030712] border border-cyan-500/20 rounded-xl p-2 overflow-hidden select-none shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const frac = (clickX - (padding.left / width) * rect.width) /
              (((width - padding.left - padding.right) / width) * rect.width);
            const targetT = Math.max(0, Math.min(maxTime, frac * maxTime));
            onSeekTime(targetT);
          }}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1.0].map((frac) => (
            <g key={frac}>
              {/* Horizontal grid */}
              <line
                x1={padding.left}
                y1={getY(frac * currentMaxY)}
                x2={width - padding.right}
                y2={getY(frac * currentMaxY)}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="0.75"
              />
              <text
                x={padding.left - 8}
                y={getY(frac * currentMaxY) + 4}
                textAnchor="end"
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                {(frac * currentMaxY).toFixed(1)}
              </text>

              {/* Vertical time grid */}
              <line
                x1={getX(frac * maxTime)}
                y1={padding.top}
                x2={getX(frac * maxTime)}
                y2={height - padding.bottom}
                stroke="#334155"
                strokeDasharray="3 3"
                strokeWidth="0.75"
              />
              <text
                x={getX(frac * maxTime)}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                {(frac * maxTime).toFixed(1)}s
              </text>
            </g>
          ))}

          {/* Coordinate Axes */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right + 15}
            y2={height - padding.bottom}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={padding.left}
            y2={padding.top - 10}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Axis Labels */}
          <text
            x={width - padding.right + 10}
            y={height - padding.bottom + 16}
            fill="#e2e8f0"
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
          >
            t (s)
          </text>
          <text
            x={padding.left - 10}
            y={padding.top - 8}
            fill="#e2e8f0"
            fontSize="11"
            fontWeight="bold"
            textAnchor="end"
          >
            {activeGraphType === 'd_t'
              ? 'd (m)'
              : activeGraphType === 's_t'
              ? 's (m)'
              : 'v (m/s)'}
          </text>

          {/* Plotted Curves */}
          {activeGraphType === 'd_t' && (
            <path
              d={displacementPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {activeGraphType === 's_t' && (
            <path
              d={distancePath}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {activeGraphType === 'v_t' && (
            <path
              d={speedPath}
              fill="none"
              stroke="#e879f9"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Slope Explorer Tangent / Secant Line on d-t graph */}
          {activeGraphType === 'd_t' && t2 > t1 && (
            <g>
              {/* Secant line through (t1, d1) and (t2, d2) */}
              <line
                x1={getX(t1)}
                y1={getY(d1)}
                x2={getX(t2)}
                y2={getY(d2)}
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              {/* Slope Triangle */}
              <line
                x1={getX(t1)}
                y1={getY(d1)}
                x2={getX(t2)}
                y2={getY(d1)}
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.6"
              />
              <line
                x1={getX(t2)}
                y1={getY(d1)}
                x2={getX(t2)}
                y2={getY(d2)}
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Delta t & Delta d annotations */}
              <text
                x={(getX(t1) + getX(t2)) / 2}
                y={getY(d1) + 12}
                fill="#34d399"
                fontSize="10"
                textAnchor="middle"
                fontWeight="bold"
              >
                Δt = {deltaT.toFixed(1)}s
              </text>
              <text
                x={getX(t2) + 6}
                y={(getY(d1) + getY(d2)) / 2}
                fill="#34d399"
                fontSize="10"
                fontWeight="bold"
              >
                Δd = {deltaD.toFixed(1)}m
              </text>
              {/* Nodes at t1 and t2 */}
              <circle cx={getX(t1)} cy={getY(d1)} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
              <circle cx={getX(t2)} cy={getY(d2)} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
            </g>
          )}

          {/* Current Animated Time Tracker (Vertical Cursor Line) */}
          <line
            x1={getX(currentTime)}
            y1={padding.top}
            x2={getX(currentTime)}
            y2={height - padding.bottom}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="2 2"
          />

          {/* Current animated dot on curve */}
          <circle
            cx={getX(currentTime)}
            cy={getY(
              activeGraphType === 'd_t'
                ? motionState.displacementMagnitude
                : activeGraphType === 's_t'
                ? motionState.distanceTraveled
                : motionState.instantaneousSpeed
            )}
            r="6"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="2"
            className="animate-pulse"
          />
        </svg>

        {/* Live sync tooltip */}
        <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
          t = <strong className="text-white">{formatPhysics(currentTime, 1)}s</strong> •{' '}
          {activeGraphType === 'd_t' ? 'd' : activeGraphType === 's_t' ? 's' : 'v'} ={' '}
          <strong className="text-cyan-400">
            {formatPhysics(
              activeGraphType === 'd_t'
                ? motionState.displacementMagnitude
                : activeGraphType === 's_t'
                ? motionState.distanceTraveled
                : motionState.instantaneousSpeed,
              2
            )}
          </strong>
        </div>
      </div>

      {/* Interactive Slope Explorer & Discovery Tool (Bài 7 SGK) */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">
              Khám phá Độ Dốc (Hệ số góc k = Δd / Δt = Vận tốc)
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            Bài 7 SGK KNTT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-slate-400 flex items-center justify-between mb-1">
              <span>Thời điểm t1:</span>
              <strong className="text-emerald-400 font-mono">{t1.toFixed(1)}s</strong>
            </label>
            <input
              type="range"
              min="0"
              max={t2 - 0.5}
              step="0.1"
              value={t1}
              onChange={(e) => setT1(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-400 flex items-center justify-between mb-1">
              <span>Thời điểm t2:</span>
              <strong className="text-emerald-400 font-mono">{t2.toFixed(1)}s</strong>
            </label>
            <input
              type="range"
              min={t1 + 0.5}
              max={maxTime}
              step="0.1"
              value={t2}
              onChange={(e) => setT2(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Calculated Slope Result Callout */}
        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2 font-mono">
          <div className="text-slate-300">
            Δd = {deltaD.toFixed(2)}m, Δt = {deltaT.toFixed(2)}s
          </div>
          <div className="text-emerald-300 font-bold text-sm">
            Độ dốc k = Δd / Δt = <span className="text-white text-base">{slopeV.toFixed(2)} m/s</span> (Vận tốc v)
          </div>
        </div>
      </div>
    </div>
  );
};
