import React from 'react';
import { ArrowDown, ArrowRight, GitFork, Sparkles } from 'lucide-react';

interface ConceptFlowDiagramProps {
  onHighlight: (element: 'distance' | 'displacement' | 'speed' | 'velocity') => void;
  activeHighlight: string | null;
}

export const ConceptFlowDiagram: React.FC<ConceptFlowDiagramProps> = ({
  onHighlight,
  activeHighlight,
}) => {
  return (
    <div className="bg-[#090d16]/95 border border-cyan-500/25 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-200">
            Sơ Đồ Mối Quan Hệ Giữa 4 Đại Lượng
          </h3>
        </div>
        <span className="text-[10px] text-cyan-400/80 font-mono">Chuỗi dẫn xuất</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Nhánh 1: Quỹ đạo -> Quãng đường -> Tốc độ (Scalar Branch) */}
        <div className="p-3 rounded-xl bg-[#030712] border border-amber-500/30 flex flex-col items-center gap-2 text-center shadow-inner">
          <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            Nhánh Vô Hướng (Không xét hướng)
          </span>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            QUỸ ĐẠO THỰC TẾ (Đường đi)
          </div>

          <ArrowDown className="w-4 h-4 text-amber-400" />

          <button
            onClick={() => onHighlight('distance')}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeHighlight === 'distance'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
                : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-500/40'
            }`}
          >
            QUÃNG ĐƯỜNG (s = độ dài quỹ đạo)
          </button>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>chia cho thời gian (Δt)</span>
            <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <button
            onClick={() => onHighlight('speed')}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeHighlight === 'speed'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300'
                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-500/40'
            }`}
          >
            TỐC ĐỘ (v = s / Δt)
          </button>
        </div>

        {/* Nhánh 2: Điểm đầu + Điểm cuối -> Độ dịch chuyển -> Vận tốc (Vector Branch) */}
        <div className="p-3 rounded-xl bg-[#030712] border border-cyan-500/30 flex flex-col items-center gap-2 text-center shadow-inner">
          <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            Nhánh Vectơ (Có phương và chiều)
          </span>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            ĐIỂM ĐẦU A + ĐIỂM CUỐI B
          </div>

          <ArrowDown className="w-4 h-4 text-cyan-400" />

          <button
            onClick={() => onHighlight('displacement')}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeHighlight === 'displacement'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300'
                : 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-500/40'
            }`}
          >
            ĐỘ DỊCH CHUYỂN (d⃗ = r⃗_B - r⃗_A)
          </button>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>chia cho thời gian (Δt)</span>
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <button
            onClick={() => onHighlight('velocity')}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeHighlight === 'velocity'
                ? 'bg-fuchsia-500 text-slate-950 shadow-lg shadow-fuchsia-500/30 ring-2 ring-fuchsia-300'
                : 'bg-fuchsia-950/40 hover:bg-fuchsia-900/60 text-fuchsia-200 border border-fuchsia-500/40'
            }`}
          >
            VẬN TỐC (v⃗_tb = d⃗ / Δt)
          </button>
        </div>
      </div>
    </div>
  );
};
