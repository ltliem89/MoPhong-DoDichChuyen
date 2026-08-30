import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  RotateCcw,
  PlusCircle,
  Trash2,
  Download,
  CheckCircle2,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import { MeasurementTrial } from '../../types/physics';
import { formatPhysics } from '../../physics/mathUtils';

export const SpeedMeasurementLab: React.FC = () => {
  // Photogate Positions in meters on 20m track
  const [gateEPos, setGateEPos] = useState<number>(2.0); // Gate E (start) at 2m
  const [gateFPos, setGateFPos] = useState<number>(12.0); // Gate F (stop) at 12m
  const [cartSpeed, setCartSpeed] = useState<number>(4.0); // Cart speed m/s
  const [inclineAngle, setInclineAngle] = useState<number>(0); // Incline 0..15 deg

  // Simulation State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cartPosition, setCartPosition] = useState<number>(0); // in meters
  const [elapsedTimer, setElapsedTimer] = useState<number>(0); // Timer between gates
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [timerStopped, setTimerStopped] = useState<boolean>(false);
  const [lastMeasuredTime, setLastMeasuredTime] = useState<number | null>(null);

  // Measurement Trial Records
  const [trials, setTrials] = useState<MeasurementTrial[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const measuredDistance = Math.max(0.1, gateFPos - gateEPos);

  // Run Cart Simulation
  useEffect(() => {
    if (!isRunning) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setCartPosition((prev) => {
        const nextPos = prev + cartSpeed * dt;

        // Gate E Trigger (Start Timing)
        if (prev < gateEPos && nextPos >= gateEPos) {
          setTimerStarted(true);
          setTimerStopped(false);
          setElapsedTimer(0);
        }

        // Timer ticking
        if (nextPos >= gateEPos && nextPos < gateFPos) {
          setElapsedTimer((t) => t + dt);
        }

        // Gate F Trigger (Stop Timing)
        if (prev < gateFPos && nextPos >= gateFPos) {
          setTimerStopped(true);
          setTimerStarted(false);
          const finalTime = measuredDistance / cartSpeed;
          // Add small realistic sensor noise (±0.005s)
          const sensorJitter = (Math.random() - 0.5) * 0.008;
          const recordedTime = Math.max(0.01, finalTime + sensorJitter);
          setElapsedTimer(recordedTime);
          setLastMeasuredTime(recordedTime);
        }

        // End of track at 20m
        if (nextPos >= 20) {
          setIsRunning(false);
          return 20;
        }

        return nextPos;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, cartSpeed, gateEPos, gateFPos, measuredDistance]);

  const handleStartCart = () => {
    setCartPosition(0);
    setElapsedTimer(0);
    setTimerStarted(false);
    setTimerStopped(false);
    setLastMeasuredTime(null);
    setIsRunning(true);
  };

  const handleResetCart = () => {
    setIsRunning(false);
    setCartPosition(0);
    setElapsedTimer(0);
    setTimerStarted(false);
    setTimerStopped(false);
  };

  const handleRecordTrial = () => {
    if (lastMeasuredTime === null) return;
    const speed = measuredDistance / lastMeasuredTime;
    const newTrial: MeasurementTrial = {
      id: trials.length + 1,
      distance: measuredDistance,
      time: lastMeasuredTime,
      speed: speed,
      sensorEPos: gateEPos,
      sensorFPos: gateFPos,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTrials([...trials, newTrial]);
  };

  const handleClearTrials = () => {
    setTrials([]);
  };

  // Compute average speed and absolute uncertainty
  const avgSpeed =
    trials.length > 0
      ? trials.reduce((acc, t) => acc + t.speed, 0) / trials.length
      : 0;

  const avgUncertainty =
    trials.length > 1
      ? trials.reduce((acc, t) => acc + Math.abs(t.speed - avgSpeed), 0) / trials.length
      : 0;

  // Export CSV
  const handleExportCSV = () => {
    if (trials.length === 0) return;
    const header = 'Lần đo,Quãng đường s (m),Thời gian t (s),Tốc độ v (m/s),Cổng E (m),Cổng F (m)\n';
    const rows = trials
      .map(
        (t) =>
          `${t.id},${t.distance.toFixed(2)},${t.time.toFixed(3)},${t.speed.toFixed(3)},${t.sensorEPos},${t.sensorFPos}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ket-qua-do-toc-do-bai-6.csv';
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Title & Guidelines Banner */}
      <div className="bg-[#090d16]/95 border border-cyan-500/25 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Bài 6: Thực hành đo tốc độ của vật chuyển động
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Sử dụng Cổng quang điện E, F và Đồng hồ đo hiện số để đo thời gian t, quãng đường s và tính v = s / t
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#030712] text-xs text-amber-300 border border-amber-500/30">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Đo lặp lại 3-5 lần để tính sai số</span>
          </div>
        </div>
      </div>

      {/* Experimental Apparatus Visual Stage */}
      <div className="bg-[#030712] border border-cyan-500/25 p-5 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Digital Photogate Timer Box */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#090d16]/90 p-4 rounded-2xl border border-cyan-500/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-black border border-cyan-500/40 font-mono text-center shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">ĐỒNG HỒ HIỆN SỐ (SI)</div>
              <div className="text-2xl font-extrabold text-red-500 tracking-wider font-mono drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]">
                {elapsedTimer.toFixed(3)}{' '}
                <span className="text-xs text-red-400 font-normal">s</span>
              </div>
            </div>

            <div className="flex flex-col text-xs text-slate-300 gap-1.5 font-medium">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    timerStarted ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-slate-700'
                  }`}
                />
                <span>Cổng E (Bắt đầu): <strong className="text-emerald-300">{gateEPos.toFixed(1)}m</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    timerStopped ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-slate-700'
                  }`}
                />
                <span>Cổng F (Kết thúc): <strong className="text-red-300">{gateFPos.toFixed(1)}m</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartCart}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Thả xe chạy</span>
            </button>
            <button
              onClick={handleResetCart}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Đặt lại vị trí xe"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRecordTrial}
              disabled={lastMeasuredTime === null}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition disabled:opacity-40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ghi vào bảng</span>
            </button>
          </div>
        </div>

        {/* The Physical Track (0m to 20m) */}
        <div className="relative w-full h-36 bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800 p-2 select-none">
          {/* Track Metal Rails */}
          <div className="absolute top-16 left-6 right-6 h-4 bg-slate-700 rounded-sm shadow-md border-t border-slate-500" />
          <div className="absolute top-22 left-6 right-6 h-2 bg-slate-800 rounded-sm" />

          {/* Ruler Graduations (0m, 5m, 10m, 15m, 20m) */}
          <div className="absolute top-24 left-6 right-6 flex justify-between text-[11px] font-mono font-bold text-slate-400">
            {[0, 5, 10, 15, 20].map((mark) => (
              <div key={mark} className="flex flex-col items-center">
                <div className="w-0.5 h-3 bg-slate-500 mb-1" />
                <span>{mark} m</span>
              </div>
            ))}
          </div>

          {/* Gate E Visual Position Marker */}
          <div
            className="absolute top-6 -translate-x-1/2 flex flex-col items-center z-10 transition-all duration-75"
            style={{ left: `calc(1.5rem + ${(gateEPos / 20) * 100}% * 0.94)` }}
          >
            <div className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold shadow-md mb-1">
              CỔNG E
            </div>
            <div className="w-1.5 h-16 bg-emerald-500/80 rounded-full ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/30" />
          </div>

          {/* Gate F Visual Position Marker */}
          <div
            className="absolute top-6 -translate-x-1/2 flex flex-col items-center z-10 transition-all duration-75"
            style={{ left: `calc(1.5rem + ${(gateFPos / 20) * 100}% * 0.94)` }}
          >
            <div className="px-2 py-0.5 rounded bg-cyan-600 text-white text-[10px] font-extrabold shadow-md mb-1">
              CỔNG F
            </div>
            <div className="w-1.5 h-16 bg-cyan-500/80 rounded-full ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/30" />
          </div>

          {/* Moving Cart */}
          <div
            className="absolute top-11 -translate-x-1/2 z-20 transition-all duration-75"
            style={{ left: `calc(1.5rem + ${(cartPosition / 20) * 100}% * 0.94)` }}
          >
            <div className="relative w-12 h-8 bg-gradient-to-r from-red-600 to-rose-500 rounded-lg shadow-xl border border-white/40 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">XE THÍ NGHIỆM</span>
              {/* Wheels */}
              <div className="absolute -bottom-2 left-1.5 w-3 h-3 rounded-full bg-slate-900 border border-slate-300" />
              <div className="absolute -bottom-2 right-1.5 w-3 h-3 rounded-full bg-slate-900 border border-slate-300" />
              {/* Light interrupter fin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-black rounded-t" />
            </div>
          </div>
        </div>

        {/* Position Sliders for Gates & Speed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs">
          <div>
            <label className="text-slate-400 flex items-center justify-between mb-1">
              <span>Vị trí Cổng quang E:</span>
              <strong className="text-emerald-400 font-mono">{gateEPos.toFixed(1)} m</strong>
            </label>
            <input
              type="range"
              min="0"
              max={gateFPos - 1}
              step="0.5"
              value={gateEPos}
              onChange={(e) => setGateEPos(parseFloat(e.target.value))}
              disabled={isRunning}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-400 flex items-center justify-between mb-1">
              <span>Vị trí Cổng quang F:</span>
              <strong className="text-cyan-400 font-mono">{gateFPos.toFixed(1)} m</strong>
            </label>
            <input
              type="range"
              min={gateEPos + 1}
              max="20"
              step="0.5"
              value={gateFPos}
              onChange={(e) => setGateFPos(parseFloat(e.target.value))}
              disabled={isRunning}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 flex items-center justify-between mb-1">
              <span>Tốc độ đẩy xe (v):</span>
              <strong className="text-amber-400 font-mono">{cartSpeed.toFixed(1)} m/s</strong>
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={cartSpeed}
              onChange={(e) => setCartSpeed(parseFloat(e.target.value))}
              disabled={isRunning}
              className="w-full accent-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Experimental Measurement Data Table (Bảng số liệu thực nghiệm) */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Bảng Số Liệu Thực Nghiệm (Lần đo, s, t, v = s/t)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={trials.length === 0}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV</span>
            </button>
            <button
              onClick={handleClearTrials}
              disabled={trials.length === 0}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950 text-red-400 text-xs font-semibold border border-slate-700 transition disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa bảng</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <th className="py-2 px-3">Lần đo</th>
                <th className="py-2 px-3">Quãng đường s (m)</th>
                <th className="py-2 px-3">Thời gian t (s)</th>
                <th className="py-2 px-3">Tốc độ v = s/t (m/s)</th>
                <th className="py-2 px-3">Vị trí Cổng (E ➔ F)</th>
                <th className="py-2 px-3">Thời điểm</th>
              </tr>
            </thead>
            <tbody>
              {trials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 italic">
                    Chưa có lần đo nào. Hãy nhấn "Thả xe chạy" và bấm "Ghi vào bảng" sau khi xe qua cổng F!
                  </td>
                </tr>
              ) : (
                trials.map((trial) => (
                  <tr
                    key={trial.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/40 transition font-mono"
                  >
                    <td className="py-2.5 px-3 font-bold text-indigo-400">#{trial.id}</td>
                    <td className="py-2.5 px-3 text-slate-200">{trial.distance.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-amber-300 font-bold">{trial.time.toFixed(3)}</td>
                    <td className="py-2.5 px-3 text-emerald-300 font-bold">{trial.speed.toFixed(3)}</td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {trial.sensorEPos}m ➔ {trial.sensorFPos}m
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{trial.timestamp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Statistical Summary Box */}
        {trials.length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Số lần đo:</span>
              <strong className="text-white">{trials.length}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Tốc độ trung bình (v̄):</span>
              <strong className="text-emerald-400 text-sm">{avgSpeed.toFixed(3)} m/s</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Kết quả đo:</span>
              <strong className="text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
                v = {avgSpeed.toFixed(2)} ± {avgUncertainty.toFixed(2)} m/s
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
