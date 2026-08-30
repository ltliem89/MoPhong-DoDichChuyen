import React from 'react';
import { ArrowRightLeft, Gauge, Check, Sparkles } from 'lucide-react';

interface ComparisonMatrixProps {
  onHighlight: (element: 'distance' | 'displacement' | 'speed' | 'velocity') => void;
  activeHighlight: string | null;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  onHighlight,
  activeHighlight,
}) => {
  return (
    <div className="bg-[#090d16]/95 border border-cyan-500/25 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-200">
            Bảng So Sánh Cốt Lõi (SGK KNTT)
          </h3>
        </div>
        <span className="text-[10px] text-cyan-400/80 font-mono">Tương tác trực quan</span>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Card 1: Độ dịch chuyển */}
        <div
          onClick={() => onHighlight('displacement')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            activeHighlight === 'displacement'
              ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
              : 'bg-[#030712] border-slate-800 hover:border-cyan-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
              ĐỘ DỊCH CHUYỂN (d⃗)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              VECTƠ
            </span>
          </div>
          <ul className="text-slate-300 text-[11px] space-y-1.5 font-medium">
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Nối từ <strong>vị trí đầu A ➔ vị trí cuối B</strong>.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Không phụ thuộc</strong> vào hình dạng con đường đi.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Về lại điểm xuất phát ➔ <strong>d = 0</strong>.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 2: Quãng đường */}
        <div
          onClick={() => onHighlight('distance')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            activeHighlight === 'distance'
              ? 'bg-amber-950/40 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-1 ring-amber-400/50'
              : 'bg-[#030712] border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"></span>
              QUÃNG ĐƯỜNG (s)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              VÔ HƯỚNG
            </span>
          </div>
          <ul className="text-slate-300 text-[11px] space-y-1.5 font-medium">
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Là <strong>độ dài toàn bộ quỹ đạo</strong> đã đi qua.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Phụ thuộc</strong> trực tiếp vào đường đi.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Luôn không âm: <strong>s ≥ 0</strong> (và s ≥ |d|).
              </span>
            </li>
          </ul>
        </div>

        {/* Card 3: Vận tốc */}
        <div
          onClick={() => onHighlight('velocity')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            activeHighlight === 'velocity'
              ? 'bg-fuchsia-950/40 border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] ring-1 ring-fuchsia-400/50'
              : 'bg-[#030712] border-slate-800 hover:border-fuchsia-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-fuchsia-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-fuchsia-400" />
              VẬN TỐC (v⃗)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
              VECTƠ
            </span>
          </div>
          <ul className="text-slate-300 text-[11px] space-y-1.5 font-medium">
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-fuchsia-400 shrink-0 mt-0.5" />
              <span>
                Vận tốc TB: <strong>v⃗_tb = d⃗ / Δt</strong> (cùng hướng d⃗).
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-fuchsia-400 shrink-0 mt-0.5" />
              <span>
                Vận tốc tức thời: <strong>Phương tiếp tuyến</strong> quỹ đạo.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-fuchsia-400 shrink-0 mt-0.5" />
              <span>
                Gốc tại vật, chiều theo chiều chuyển động.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 4: Tốc độ */}
        <div
          onClick={() => onHighlight('speed')}
          className={`p-3 rounded-xl border transition-all cursor-pointer ${
            activeHighlight === 'speed'
              ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50'
              : 'bg-[#030712] border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              TỐC ĐỘ (v)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              VÔ HƯỚNG
            </span>
          </div>
          <ul className="text-slate-300 text-[11px] space-y-1.5 font-medium">
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Tốc độ TB: <strong>v_tb = s / Δt</strong> (quãng đường/thời gian).
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Đặc trưng cho mức độ <strong>nhanh hay chậm</strong>.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Không có hướng</strong>, chỉ có độ lớn đại số.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
