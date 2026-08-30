import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  LayerVisibility,
  MotionState,
  Point2D,
  SampledPathPoint,
  ScenePreset,
  Waypoint,
} from '../../types/physics';
import { vec, formatPhysics } from '../../physics/mathUtils';
import { Plus, Trash2, Crosshair, Navigation } from 'lucide-react';

interface InteractiveCanvasProps {
  preset: ScenePreset;
  waypoints: Waypoint[];
  onWaypointsChange: (newWaypoints: Waypoint[]) => void;
  motionState: MotionState;
  sampledPath: SampledPathPoint[];
  layerVisibility: LayerVisibility;
  highlightedElement: 'distance' | 'displacement' | 'speed' | 'velocity' | 'acceleration' | null;
  onSelectWaypoint?: (wp: Waypoint | null) => void;
  isEditable?: boolean;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  preset,
  waypoints,
  onWaypointsChange,
  motionState,
  sampledPath,
  layerVisibility,
  highlightedElement,
  isEditable = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 800,
    height: 480,
  });

  // Track container size dynamically
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        const targetWidth = Math.max(600, clientWidth);
        const targetHeight = Math.max(400, Math.min(520, targetWidth * 0.58));
        setCanvasSize({ width: targetWidth, height: targetHeight });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle Dragging Waypoints
  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    if (!isEditable) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setDraggedIndex(index);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggedIndex === null || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      // Bound within canvas
      const clampedX = Math.max(20, Math.min(rawX, canvasSize.width - 20));
      const clampedY = Math.max(20, Math.min(rawY, canvasSize.height - 20));

      const updated = [...waypoints];
      updated[draggedIndex] = {
        ...updated[draggedIndex],
        x: Math.round(clampedX),
        y: Math.round(clampedY),
      };
      onWaypointsChange(updated);
    },
    [draggedIndex, waypoints, onWaypointsChange, canvasSize]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedIndex !== null) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
      setDraggedIndex(null);
    }
  };

  // Add waypoint near middle
  const addWaypoint = () => {
    if (waypoints.length >= 8) return;
    const lastIdx = waypoints.length - 1;
    const midX = (waypoints[lastIdx - 1]?.x + waypoints[lastIdx]?.x) / 2 || 400;
    const midY = (waypoints[lastIdx - 1]?.y + waypoints[lastIdx]?.y) / 2 + 50 || 250;
    const newWp: Waypoint = {
      x: midX,
      y: midY,
      id: `P${waypoints.length}`,
      label: `Điểm ${String.fromCharCode(65 + waypoints.length - 1)}`,
    };
    const updated = [...waypoints.slice(0, lastIdx), newWp, waypoints[lastIdx]];
    onWaypointsChange(updated);
  };

  // Delete hovered waypoint (cannot delete Start A or End B)
  const removeWaypoint = (idx: number) => {
    if (waypoints.length <= 2) return;
    if (idx === 0 || idx === waypoints.length - 1) return;
    const updated = waypoints.filter((_, i) => i !== idx);
    onWaypointsChange(updated);
  };

  // Construct SVG path string from sampled points
  const pathD = sampledPath.reduce((acc, sp, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${sp.point.x.toFixed(1)} ${sp.point.y.toFixed(1)}`;
  }, '');

  // Calculate coordinates for Start A and Current position P(t)
  const startCanvas = sampledPath[0]?.point || { x: 50, y: 350 };
  const currentCanvas = motionState.canvasPos || startCanvas;
  const endCanvas = sampledPath[sampledPath.length - 1]?.point || { x: 750, y: 150 };

  // Calculate velocity vector arrow length (scaled for clear visual comprehension)
  const velocityScale = 12; // 1 m/s = 12 pixels length
  const vInst = motionState.instantaneousSpeed;
  const vTangentCanvas = {
    x: motionState.instantaneousVelocity.x,
    y: -motionState.instantaneousVelocity.y, // Canvas y is downwards
  };
  const vNorm = vec.normalize(vTangentCanvas);
  const vArrowEnd = {
    x: currentCanvas.x + vNorm.x * Math.min(90, Math.max(25, vInst * velocityScale)),
    y: currentCanvas.y + vNorm.y * Math.min(90, Math.max(25, vInst * velocityScale)),
  };

  // Heading angle of vehicle in degrees
  const headingAngle = Math.atan2(vNorm.y, vNorm.x) * (180 / Math.PI);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full rounded-2xl bg-[#030712]/95 border border-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.12)] overflow-hidden select-none"
      style={{ minHeight: `${canvasSize.height}px` }}
    >
      {/* Top Overlay Badge / Current Map Mode */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-[#090d16]/90 border border-cyan-500/30 backdrop-blur-xl flex items-center gap-2 shadow-lg">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span className="text-xs font-bold text-cyan-200">{preset.name}</span>
          <span className="text-[10px] text-slate-400 font-mono">
            (Tỉ lệ: 1m ≈ {(1 / preset.scaleMeterPerPixel).toFixed(0)}px)
          </span>
        </div>
      </div>

      {/* Editing Toolbar */}
      {isEditable && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-[#090d16]/90 p-1 rounded-xl border border-cyan-500/30 backdrop-blur-xl shadow-lg">
          <button
            onClick={addWaypoint}
            disabled={waypoints.length >= 8}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-cyan-600/25 text-cyan-300 hover:bg-cyan-600 hover:text-white border border-cyan-500/40 transition disabled:opacity-40"
            title="Thêm một điểm trung gian (Waypoint) để bẻ cong quỹ đạo"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm điểm</span>
          </button>
        </div>
      )}

      {/* Main SVG Graphics Layer */}
      <svg
        width="100%"
        height={canvasSize.height}
        viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
        className="w-full h-full"
      >
        <defs>
          {/* Grid Pattern */}
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#334155"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
            <circle cx="0" cy="0" r="1" fill="#475569" fillOpacity="0.6" />
          </pattern>

          {/* Displacement Vector Arrow Head (Cyan) */}
          <marker
            id="arrowDisplacement"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#06b6d4" />
          </marker>

          {/* Instantaneous Velocity Arrow Head (Magenta) */}
          <marker
            id="arrowVelocity"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#e879f9" />
          </marker>

          {/* Average Velocity Arrow Head (Indigo) */}
          <marker
            id="arrowAvgVelocity"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#818cf8" />
          </marker>

          {/* Glow Filters */}
          <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Background Grid & Coordinates */}
        {layerVisibility.showGrid && (
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        )}

        {/* 2. Theme Specific Environment Decorators */}
        {preset.theme === 'city' && (
          <g opacity="0.15">
            <rect x="120" y="50" width="120" height="100" fill="#64748b" rx="4" />
            <rect x="320" y="60" width="160" height="90" fill="#64748b" rx="4" />
            <rect x="320" y="240" width="140" height="110" fill="#64748b" rx="4" />
            <circle cx="580" cy="300" r="45" fill="#3b82f6" />
          </g>
        )}

        {preset.theme === 'lake' && (
          <g>
            <ellipse
              cx="390"
              cy="260"
              rx="150"
              ry="100"
              fill="#0284c7"
              fillOpacity="0.15"
              stroke="#0369a1"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <text x="390" y="265" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold" opacity="0.6">
              HỒ NƯỚC CÔNG VIÊN
            </text>
          </g>
        )}

        {preset.theme === 'track' && (
          <g opacity="0.25">
            <path
              d="M 260 140 L 540 140 A 110 110 0 0 1 540 360 L 260 360 A 110 110 0 0 1 260 140 Z"
              fill="none"
              stroke="#ef4444"
              strokeWidth="32"
            />
            <rect x="250" y="170" width="300" height="160" fill="#22c55e" rx="30" />
            <text x="400" y="255" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" opacity="0.8">
              SÂN BÓNG / ĐIỀN KINH 400M
            </text>
          </g>
        )}

        {/* 3. LAYER 1: ACTUAL TRAJECTORY (QUỸ ĐẠO THỰC TẾ) */}
        {layerVisibility.showTrajectory && (
          <g>
            {/* Base Path Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={highlightedElement === 'distance' ? 5 : 3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={highlightedElement === 'distance' ? 'url(#glowAmber)' : undefined}
              className="transition-all duration-300"
            />

            {/* Traveled portion highlight */}
            <path
              d={sampledPath
                .filter((sp) => sp.cumulativeDistance <= motionState.distanceTraveled)
                .reduce((acc, sp, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${sp.point.x} ${sp.point.y}`, '')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 4. LAYER 2: DISPLACEMENT VECTOR d⃗ (VECTƠ ĐỘ DỊCH CHUYỂN) */}
        {/* Nối thẳng từ Start A đến vị trí hiện tại P(t) hoặc điểm cuối B */}
        {layerVisibility.showDisplacementVector && vec.dist(startCanvas, currentCanvas) > 3 && (
          <g>
            {/* Connecting direct vector arrow */}
            <line
              x1={startCanvas.x}
              y1={startCanvas.y}
              x2={currentCanvas.x}
              y2={currentCanvas.y}
              stroke="#06b6d4"
              strokeWidth={highlightedElement === 'displacement' ? 5 : 3.5}
              markerEnd="url(#arrowDisplacement)"
              filter={highlightedElement === 'displacement' ? 'url(#glowCyan)' : undefined}
              className="transition-all duration-150"
            />

            {/* Label for Displacement Vector */}
            <g
              transform={`translate(${(startCanvas.x + currentCanvas.x) / 2}, ${
                (startCanvas.y + currentCanvas.y) / 2 - 12
              })`}
            >
              <rect
                x="-36"
                y="-11"
                width="72"
                height="20"
                rx="5"
                fill="#0f172a"
                fillOpacity="0.9"
                stroke="#06b6d4"
                strokeWidth="1"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                fill="#22d3ee"
                fontSize="11"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                d⃗ = {formatPhysics(motionState.displacementMagnitude, 1)}m
              </text>
            </g>
          </g>
        )}

        {/* 5. LAYER 3: INSTANTANEOUS VELOCITY VECTOR v⃗ (VECTƠ VẬN TỐC TỨC THỜI) */}
        {/* Tiếp tuyến tại vị trí hiện tại của vật */}
        {layerVisibility.showInstantaneousVelocity && vInst > 0.05 && (
          <g>
            <line
              x1={currentCanvas.x}
              y1={currentCanvas.y}
              x2={vArrowEnd.x}
              y2={vArrowEnd.y}
              stroke="#e879f9"
              strokeWidth={highlightedElement === 'velocity' ? 5 : 3.5}
              markerEnd="url(#arrowVelocity)"
              className="transition-all duration-100"
            />
            {/* Tangent guide line extension */}
            {layerVisibility.showTangentLine && (
              <line
                x1={currentCanvas.x - vNorm.x * 60}
                y1={currentCanvas.y - vNorm.y * 60}
                x2={currentCanvas.x + vNorm.x * 120}
                y2={currentCanvas.y + vNorm.y * 120}
                stroke="#d946ef"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.5"
              />
            )}
            <text
              x={vArrowEnd.x + 8}
              y={vArrowEnd.y + 4}
              fill="#f0abfc"
              fontSize="12"
              fontWeight="bold"
            >
              v⃗ ({formatPhysics(vInst, 1)} m/s)
            </text>
          </g>
        )}

        {/* 6. WAYPOINTS & CONTROL NODES */}
        {layerVisibility.showWaypoints &&
          waypoints.map((wp, idx) => {
            const isStart = idx === 0;
            const isEnd = idx === waypoints.length - 1;
            const isHovered = hoveredIndex === idx;

            let bgColor = '#6366f1';
            let label = wp.label || `P${idx}`;
            if (isStart) {
              bgColor = '#22c55e'; // Green for Start
              label = 'A (Điểm đầu)';
            } else if (isEnd) {
              bgColor = '#ef4444'; // Red for End
              label = 'B (Điểm cuối)';
            }

            return (
              <g
                key={wp.id || idx}
                transform={`translate(${wp.x}, ${wp.y})`}
                onPointerDown={(e) => handlePointerDown(idx, e)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={isEditable ? 'cursor-grab active:cursor-grabbing' : ''}
              >
                {/* Node Target Ring */}
                <circle
                  r={isHovered ? 14 : 10}
                  fill={bgColor}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-150 shadow-md"
                />

                {/* Inner dot */}
                <circle r="3" fill="#ffffff" />

                {/* Node Label Badge */}
                <g transform="translate(0, -18)">
                  <rect
                    x="-40"
                    y="-10"
                    width="80"
                    height="18"
                    rx="4"
                    fill="#020617"
                    fillOpacity="0.85"
                    stroke={bgColor}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {label}
                  </text>
                </g>

                {/* Delete button on hover for intermediate waypoints */}
                {isHovered && !isStart && !isEnd && waypoints.length > 2 && isEditable && (
                  <g
                    transform="translate(14, -14)"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeWaypoint(idx);
                    }}
                    className="cursor-pointer"
                  >
                    <circle r="8" fill="#ef4444" stroke="#fff" strokeWidth="1" />
                    <Trash2 className="w-2.5 h-2.5 text-white" />
                  </g>
                )}
              </g>
            );
          })}

        {/* 7. MOVING OBJECT / VEHICLE */}
        <g
          transform={`translate(${currentCanvas.x}, ${currentCanvas.y}) rotate(${headingAngle})`}
          className="transition-transform duration-75"
        >
          {/* Object Aura / Pulse */}
          <circle r="18" fill="#6366f1" fillOpacity="0.25" className="animate-ping" />

          {/* Vehicle Body Representation */}
          {preset.vehicleType === 'car' && (
            <g transform="translate(-16, -10)">
              <rect x="0" y="2" width="32" height="16" rx="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
              <rect x="6" y="5" width="12" height="10" rx="2" fill="#93c5fd" />
              <circle cx="7" cy="18" r="3" fill="#0f172a" />
              <circle cx="25" cy="18" r="3" fill="#0f172a" />
              <circle cx="30" cy="6" r="2" fill="#fef08a" />
              <circle cx="30" cy="14" r="2" fill="#fef08a" />
            </g>
          )}

          {preset.vehicleType === 'runner' && (
            <g transform="translate(-10, -10)">
              <circle cx="10" cy="10" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M 6 10 L 14 10 M 10 4 L 14 10 L 10 16" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}

          {preset.vehicleType === 'cyclist' && (
            <g transform="translate(-14, -8)">
              <circle cx="6" cy="12" r="5" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
              <circle cx="22" cy="12" r="5" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
              <path d="M 6 12 L 14 12 L 18 6 L 10 6 Z M 14 12 L 13 4" stroke="#e2e8f0" strokeWidth="1.5" />
              <circle cx="13" cy="2" r="3" fill="#38bdf8" />
            </g>
          )}

          {(preset.vehicleType === 'cart' || preset.vehicleType === 'particle') && (
            <g transform="translate(-12, -8)">
              <rect x="0" y="0" width="24" height="16" rx="3" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="6" cy="16" r="3" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
              <circle cx="18" cy="16" r="3" fill="#0f172a" stroke="#ffffff" strokeWidth="1" />
            </g>
          )}
        </g>
      </svg>

      {/* Floating Canvas Realtime Stats */}
      {layerVisibility.showMetricsOverlay && (
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2.5 bg-[#090d16]/95 px-3.5 py-2 rounded-xl border border-cyan-500/30 backdrop-blur-xl text-xs shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-400">t =</span>
            <span className="text-white font-bold">{formatPhysics(motionState.time, 1)}s</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-amber-400 font-bold">s =</span>
            <span className="text-amber-300 font-bold">{formatPhysics(motionState.distanceTraveled, 1)}m</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-cyan-400 font-bold">|d⃗| =</span>
            <span className="text-cyan-300 font-bold">{formatPhysics(motionState.displacementMagnitude, 1)}m</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-fuchsia-400 font-bold">v =</span>
            <span className="text-fuchsia-300 font-bold">{formatPhysics(motionState.instantaneousSpeed, 1)}m/s</span>
          </div>
        </div>
      )}

      {/* Interactive Helper Hint */}
      <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 text-[11px] text-cyan-300/80 bg-[#090d16]/90 px-3 py-1.5 rounded-xl border border-cyan-500/20 backdrop-blur-md">
        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
        <span>Kéo các điểm A, B, C... để đổi hình dạng quỹ đạo</span>
      </div>
    </div>
  );
};
