import React, { useState, useEffect, useRef } from 'react';
import { Users, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import { PhysicsEngine } from '../../physics/physicsEngine';
import { formatPhysics } from '../../physics/mathUtils';
import { Waypoint } from '../../types/physics';

export const MultiObjectCompare: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const totalDuration = 10; // 10 seconds simulation

  // 3 Distinct Paths sharing identical Start A (80, 260) and End B (720, 260)
  const startA = { x: 80, y: 260, id: 'A', label: 'A (Xuất phát)' };
  const endB = { x: 720, y: 260, id: 'B', label: 'B (Đích đến)' };

  // Object 1: Straight Path
  const waypointsObj1: Waypoint[] = [
    startA,
    { x: 400, y: 260, id: 'M1', label: 'Đi thẳng' },
    endB,
  ];

  // Object 2: Detour Path (Curved Arc)
  const waypointsObj2: Waypoint[] = [
    startA,
    { x: 260, y: 100, id: 'M2_1', label: 'Vòng trên 1' },
    { x: 540, y: 100, id: 'M2_2', label: 'Vòng trên 2' },
    endB,
  ];

  // Object 3: Zigzag Path
  const waypointsObj3: Waypoint[] = [
    startA,
    { x: 240, y: 390, id: 'M3_1', label: 'Ziczac dưới 1' },
    { x: 400, y: 120, id: 'M3_2', label: 'Ziczac trên' },
    { x: 560, y: 390, id: 'M3_3', label: 'Ziczac dưới 2' },
    endB,
  ];

  const scale = 0.2; // 5px = 1m => 640px = 128m

  const engine1 = useRef(
    new PhysicsEngine({
      waypoints: waypointsObj1,
      scaleMeterPerPixel: scale,
      motionType: 'uniform',
      totalDuration: 8,
    })
  ).current;

  const engine2 = useRef(
    new PhysicsEngine({
      waypoints: waypointsObj2,
      scaleMeterPerPixel: scale,
      motionType: 'uniform',
      totalDuration: 10,
    })
  ).current;

  const engine3 = useRef(
    new PhysicsEngine({
      waypoints: waypointsObj3,
      scaleMeterPerPixel: scale,
      motionType: 'uniform',
      totalDuration: 12,
    })
  ).current;

  // Animation Loop
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

      setTime((prev) => {
        const nextTime = prev + dt;
        if (nextTime >= 12) {
          setIsPlaying(false);
          return 12;
        }
        return nextTime;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  const state1 = engine1.computeStateAtTime(time);
  const state2 = engine2.computeStateAtTime(time);
  const state3 = engine3.computeStateAtTime(time);

  const path1 = engine1.getSampledPath();
  const path2 = engine2.getSampledPath();
  const path3 = engine3.getSampledPath();

  const getSvgPath = (pts: typeof path1) =>
    pts.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.point.x} ${p.point.y}`, '');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Khám phá So Sánh 3 Vật Chuyển Động
            </h2>
            <p className="text-xs text-slate-400">
              Cùng điểm xuất phát A và cùng điểm kết thúc B, nhưng chuyển động theo 3 con đường hoàn toàn khác nhau
            </p>
          </div>
        </div>

        {/* Controls */}
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
            <span>{isPlaying ? 'Tạm dừng' : 'Chạy đồng thời'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setTime(0);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Object Canvas Stage */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-2 select-none">
        <svg viewBox="0 0 800 460" className="w-full h-auto">
          {/* Grid pattern */}
          <pattern id="gridCmp" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#gridCmp)" />

          {/* Path 1: Red Straight Line */}
          <path d={getSvgPath(path1)} fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 2" />

          {/* Path 2: Blue Detour Arc */}
          <path d={getSvgPath(path2)} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 2" />

          {/* Path 3: Emerald Zigzag */}
          <path d={getSvgPath(path3)} fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="4 2" />

          {/* Shared Displacement Vector d (Start A to End B) */}
          <line
            x1={startA.x}
            y1={startA.y}
            x2={endB.x}
            y2={endB.y}
            stroke="#06b6d4"
            strokeWidth="3.5"
            strokeDasharray="6 3"
            opacity="0.7"
          />

          {/* Waypoint A & B */}
          <circle cx={startA.x} cy={startA.y} r="10" fill="#22c55e" stroke="#fff" strokeWidth="2" />
          <text x={startA.x} y={startA.y - 15} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
            A (Xuất phát)
          </text>

          <circle cx={endB.x} cy={endB.y} r="10" fill="#f43f5e" stroke="#fff" strokeWidth="2" />
          <text x={endB.x} y={endB.y - 15} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
            B (Đích)
          </text>

          {/* Moving Vehicle 1 (Red Car) */}
          <g transform={`translate(${state1.canvasPos.x}, ${state1.canvasPos.y})`}>
            <circle r="12" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              1
            </text>
          </g>

          {/* Moving Vehicle 2 (Blue Cyclist) */}
          <g transform={`translate(${state2.canvasPos.x}, ${state2.canvasPos.y})`}>
            <circle r="12" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              2
            </text>
          </g>

          {/* Moving Vehicle 3 (Green Runner) */}
          <g transform={`translate(${state3.canvasPos.x}, ${state3.canvasPos.y})`}>
            <circle r="12" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              3
            </text>
          </g>
        </svg>

        {/* Live Timeline bar */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Thời gian mô phỏng:</span>
          <strong className="text-indigo-400 text-sm">{time.toFixed(1)} s / 12.0 s</strong>
        </div>
      </div>

      {/* Comparative Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
          Bảng So Sánh Số Liệu Của 3 Vật (Cùng điểm đầu A và điểm cuối B)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <th className="py-2.5 px-3">Đối tượng</th>
                <th className="py-2.5 px-3">Kiểu quỹ đạo</th>
                <th className="py-2.5 px-3">Quãng đường đã đi s (m)</th>
                <th className="py-2.5 px-3">Độ dịch chuyển |d⃗| (m)</th>
                <th className="py-2.5 px-3">Tốc độ TB v_tb (m/s)</th>
                <th className="py-2.5 px-3">Vận tốc TB |v⃗_tb| (m/s)</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b border-slate-800/60 hover:bg-slate-800/40 text-red-300">
                <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  Vật 1 (Đỏ)
                </td>
                <td className="py-2.5 px-3 text-slate-300">Đường thẳng trực tiếp</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">{state1.distanceTraveled.toFixed(1)}m</td>
                <td className="py-2.5 px-3 font-bold text-cyan-300">{state1.displacementMagnitude.toFixed(1)}m</td>
                <td className="py-2.5 px-3">{state1.averageSpeed.toFixed(2)}</td>
                <td className="py-2.5 px-3">{state1.averageVelocityMagnitude.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-slate-800/60 hover:bg-slate-800/40 text-blue-300">
                <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  Vật 2 (Xanh lam)
                </td>
                <td className="py-2.5 px-3 text-slate-300">Đường vòng cung (Vòng trên)</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">{state2.distanceTraveled.toFixed(1)}m</td>
                <td className="py-2.5 px-3 font-bold text-cyan-300">{state2.displacementMagnitude.toFixed(1)}m</td>
                <td className="py-2.5 px-3">{state2.averageSpeed.toFixed(2)}</td>
                <td className="py-2.5 px-3">{state2.averageVelocityMagnitude.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-slate-800/60 hover:bg-slate-800/40 text-emerald-300">
                <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  Vật 3 (Xanh lục)
                </td>
                <td className="py-2.5 px-3 text-slate-300">Đường Ziczac uốn khúc</td>
                <td className="py-2.5 px-3 font-bold text-amber-300">{state3.distanceTraveled.toFixed(1)}m</td>
                <td className="py-2.5 px-3 font-bold text-cyan-300">{state3.displacementMagnitude.toFixed(1)}m</td>
                <td className="py-2.5 px-3">{state3.averageSpeed.toFixed(2)}</td>
                <td className="py-2.5 px-3">{state3.averageVelocityMagnitude.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Core Takeaway Banner */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-indigo-200 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white block mb-0.5">KẾT LUẬN SƯ PHẠM QUAN TRỌNG:</strong>
            Khi 3 vật cùng xuất phát tại A và về đích tại B thì{' '}
            <strong className="text-cyan-300">vectơ độ dịch chuyển d⃗ của cả 3 vật là HOÀN TOÀN NHƯ NHAU</strong>{' '}
            (cùng gốc A, ngọn B và cùng độ dài). Ngược lại,{' '}
            <strong className="text-amber-300">quãng đường s của 3 vật khác nhau rõ rệt</strong> (s1 &lt; s2 &lt; s3) do phụ thuộc vào hình dạng từng con đường!
          </div>
        </div>
      </div>
    </div>
  );
};
