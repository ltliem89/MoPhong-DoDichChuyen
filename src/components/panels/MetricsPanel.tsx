import React from 'react';
import {
  Clock,
  ArrowRightLeft,
  Gauge,
  Compass,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { MotionState } from '../../types/physics';
import { formatPhysics, msToKmh } from '../../physics/mathUtils';

interface MetricsPanelProps {
  motionState: MotionState;
  onHighlightElement: (
    elem: 'distance' | 'displacement' | 'speed' | 'velocity' | 'acceleration' | null
  ) => void;
  highlightedElement: string | null;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  motionState,
  onHighlightElement,
  highlightedElement,
}) => {
  const {
    time,
    distanceTraveled,
    totalDistance,
    displacementVector,
    displacementMagnitude,
    averageSpeed,
    averageVelocityMagnitude,
    instantaneousSpeed,
    instantaneousVelocity,
    accelerationMagnitude,
  } = motionState;

  // Comparison State
  const isLoopBack = displacementMagnitude < 0.2 && distanceTraveled > 2;
  const isStraightLine = Math.abs(distanceTraveled - displacementMagnitude) < 0.1 && distanceTraveled > 0.5;

  return (
    <div className="bg-[#090d16]/95 border border-cyan-500/25 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col gap-3.5">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-200">
            Bảng Thông Số Vật Lí Realtime
          </h3>
        </div>
        <span className="text-[10px] text-cyan-400/80 font-mono px-2 py-0.5 bg-cyan-950/40 rounded-md border border-cyan-500/30">
          SI: m, s, m/s
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* 1. Elapsed Time */}
        <div className="p-3 rounded-xl bg-[#030712] border border-slate-800 hover:border-cyan-500/30 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Thời gian (t)
            </span>
          </div>
          <div className="text-lg font-extrabold text-white font-mono">
            {formatPhysics(time, 2)}{' '}
            <span className="text-xs text-slate-400 font-normal">s</span>
          </div>
        </div>

        {/* 2. Instantaneous Speed */}
        <div
          onClick={() =>
            onHighlightElement(highlightedElement === 'speed' ? null : 'speed')
          }
          className={`p-3 rounded-xl bg-[#030712] border transition cursor-pointer ${
            highlightedElement === 'speed'
              ? 'border-emerald-400 bg-emerald-950/30 shadow-[0_0_12px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400'
              : 'border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold flex items-center gap-1 text-emerald-300">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              Tốc độ tức thời (v)
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Vô hướng
            </span>
          </div>
          <div className="text-lg font-extrabold text-emerald-300 font-mono">
            {formatPhysics(instantaneousSpeed, 2)}{' '}
            <span className="text-xs text-slate-400 font-normal">m/s</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            ≈ {formatPhysics(msToKmh(instantaneousSpeed), 1)} km/h
          </div>
        </div>

        {/* 3. Distance (s) - Quãng đường */}
        <div
          onClick={() =>
            onHighlightElement(highlightedElement === 'distance' ? null : 'distance')
          }
          className={`p-3 rounded-xl bg-[#030712] border transition cursor-pointer ${
            highlightedElement === 'distance'
              ? 'border-amber-400 bg-amber-950/30 shadow-[0_0_12px_rgba(251,191,36,0.3)] ring-1 ring-amber-400'
              : 'border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
              Quãng đường (s)
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Độ dài
            </span>
          </div>
          <div className="text-lg font-extrabold text-amber-300 font-mono">
            {formatPhysics(distanceTraveled, 2)}{' '}
            <span className="text-xs text-slate-400 font-normal">m</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Tổng: {formatPhysics(totalDistance, 1)}m
          </div>
        </div>

        {/* 4. Displacement Vector (d⃗) - Độ dịch chuyển */}
        <div
          onClick={() =>
            onHighlightElement(
              highlightedElement === 'displacement' ? null : 'displacement'
            )
          }
          className={`p-3 rounded-xl bg-[#030712] border transition cursor-pointer ${
            highlightedElement === 'displacement'
              ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
              : 'border-slate-800 hover:border-cyan-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
              Độ dịch chuyển (d⃗)
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Vectơ
            </span>
          </div>
          <div className="text-lg font-extrabold text-cyan-300 font-mono">
            {formatPhysics(displacementMagnitude, 2)}{' '}
            <span className="text-xs text-slate-400 font-normal">m</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            d⃗ = ({formatPhysics(displacementVector.x, 1)}, {formatPhysics(displacementVector.y, 1)})
          </div>
        </div>

        {/* 5. Average Speed (v_tb) */}
        <div className="p-3 rounded-xl bg-[#030712] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold text-slate-300">Tốc độ TB (v_tb)</span>
            <span className="text-[9px] font-mono text-cyan-400">s / t</span>
          </div>
          <div className="text-base font-bold text-slate-200 font-mono">
            {formatPhysics(averageSpeed, 2)}{' '}
            <span className="text-xs text-slate-400 font-normal">m/s</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            ≈ {formatPhysics(msToKmh(averageSpeed), 1)} km/h
          </div>
        </div>

        {/* 6. Average Velocity (v_tb_vec) */}
        <div className="p-3 rounded-xl bg-[#030712] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold text-cyan-300">Vận tốc TB (v⃗_tb)</span>
            <span className="text-[9px] font-mono text-cyan-400">d⃗ / t</span>
          </div>
          <div className="text-base font-bold text-cyan-300 font-mono">
            {formatPhysics(averageVelocityMagnitude, 2)}{' '}
            <span className="text-xs text-slate-400 font-normal">m/s</span>
          </div>
          <div className="text-[10px] text-cyan-400/80 font-mono">
            cùng hướng với d⃗
          </div>
        </div>
      </div>

      {/* Instantaneous Velocity Vector Detail */}
      <div
        onClick={() =>
          onHighlightElement(highlightedElement === 'velocity' ? null : 'velocity')
        }
        className={`p-3 rounded-xl bg-[#030712] border transition cursor-pointer ${
          highlightedElement === 'velocity'
            ? 'border-fuchsia-400 bg-fuchsia-950/30 shadow-[0_0_12px_rgba(232,121,249,0.3)] ring-1 ring-fuchsia-400'
            : 'border-slate-800 hover:border-fuchsia-500/40'
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-fuchsia-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(232,121,249,0.8)]"></span>
            Vectơ Vận tốc tức thời v⃗(t)
          </span>
          <span className="text-[10px] text-fuchsia-400 font-semibold px-2 py-0.5 bg-fuchsia-950/40 rounded border border-fuchsia-500/30">
            Tiếp tuyến
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">
            Độ lớn |v⃗|: <strong className="text-fuchsia-300">{formatPhysics(instantaneousSpeed, 2)} m/s</strong>
          </span>
          <span className="text-slate-400">
            (v_x={formatPhysics(instantaneousVelocity.x, 1)}, v_y={formatPhysics(instantaneousVelocity.y, 1)})
          </span>
        </div>
      </div>

      {/* Scientific Comparison Callout Box */}
      <div
        className={`p-3 rounded-xl border text-xs leading-relaxed transition ${
          isLoopBack
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            : isStraightLine
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200'
        }`}
      >
        <div className="flex items-start gap-2">
          {isLoopBack ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : isStraightLine ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          )}

          <div>
            <div className="font-bold text-[11px] uppercase tracking-wider mb-0.5">
              {isLoopBack
                ? 'Hiện tượng: Vòng khép kín về gốc A'
                : isStraightLine
                ? 'Hiện tượng: Chuyển động thẳng cùng chiều'
                : 'Hiện tượng: Chuyển động đường cong / vòng'}
            </div>
            <p className="text-[11px] opacity-90">
              {isLoopBack && (
                <>
                  Vật đã đi được quãng đường <strong>s = {formatPhysics(distanceTraveled, 1)}m</strong>. Nhưng vì điểm kết thúc trùng điểm ban đầu nên độ dịch chuyển <strong>d = 0m</strong> và vận tốc trung bình <strong>v⃗_tb = 0 m/s</strong>!
                </>
              )}
              {isStraightLine && (
                <>
                  Chuyển động thẳng một chiều duy nhất: Độ lớn độ dịch chuyển <strong>|d| = {formatPhysics(displacementMagnitude, 1)}m</strong> bằng chính xác quãng đường <strong>s = {formatPhysics(distanceTraveled, 1)}m</strong>.
                </>
              )}
              {!isLoopBack && !isStraightLine && (
                <>
                  Do vật đi theo đường vòng, quãng đường <strong>s = {formatPhysics(distanceTraveled, 1)}m</strong> luôn lớn hơn độ lớn độ dịch chuyển <strong>|d| = {formatPhysics(displacementMagnitude, 1)}m</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
