import React from 'react';
import {
  Activity,
  ArrowRightLeft,
  Compass,
  Gauge,
  LineChart,
  MoveRight,
  Sparkles,
  Timer,
  Trophy,
  Users,
  HelpCircle,
} from 'lucide-react';
import { LabTab } from '../types/physics';

interface SidebarProps {
  activeTab: LabTab;
  setActiveTab: (tab: LabTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface TabItem {
  id: LabTab;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  color: string;
}

const TAB_ITEMS: TabItem[] = [
  {
    id: 'DISPLACEMENT_DISTANCE',
    label: '1. Độ dịch chuyển & Quãng đường',
    subLabel: 'Bài 4: Phân biệt d và s',
    icon: ArrowRightLeft,
    badge: 'Trọng tâm',
    color: 'text-cyan-400',
  },
  {
    id: 'SPEED_VELOCITY',
    label: '2. Tốc độ & Vận tốc',
    subLabel: 'Bài 5: Vô hướng vs Vectơ',
    icon: Gauge,
    color: 'text-emerald-400',
  },
  {
    id: 'INSTANTANEOUS_VECTOR',
    label: '3. Vectơ Vận tốc tức thời',
    subLabel: 'Tiếp tuyến trên đường cong',
    icon: MoveRight,
    color: 'text-fuchsia-400',
  },
  {
    id: 'SPEED_MEASUREMENT',
    label: '4. Thực hành Đo tốc độ',
    subLabel: 'Bài 6: Cổng quang & Đồng hồ',
    icon: Timer,
    badge: 'Thực hành',
    color: 'text-amber-400',
  },
  {
    id: 'DT_GRAPH',
    label: '5. Đồ thị d–t & Độ dốc',
    subLabel: 'Bài 7: Độ dốc k = Δd/Δt',
    icon: LineChart,
    color: 'text-blue-400',
  },
  {
    id: 'UNIFORM_MOTION',
    label: '6. Chuyển động thẳng đều',
    subLabel: 'v = const, d = v.t',
    icon: Activity,
    color: 'text-sky-400',
  },
  {
    id: 'ACCELERATED_MOTION',
    label: '7. Chuyển động biến đổi & Gia tốc',
    subLabel: 'Bài 8-9: a = Δv/Δt, v(t), d(t)',
    icon: Compass,
    badge: 'Mở rộng',
    color: 'text-violet-400',
  },
  {
    id: 'MULTI_OBJECT',
    label: '8. So sánh 3 vật',
    subLabel: 'Cùng A-B, khác quỹ đạo',
    icon: Users,
    color: 'text-rose-400',
  },
  {
    id: 'CHALLENGES',
    label: '9. Phòng Thử thách',
    subLabel: '5 cấp độ giải đố vật lí',
    icon: Trophy,
    badge: 'Gamification',
    color: 'text-yellow-400',
  },
  {
    id: 'EXPLORATION_QUIZ',
    label: '10. Khám phá & Trắc nghiệm',
    subLabel: 'Hỏi đáp Sư phạm SGK KNTT',
    icon: Sparkles,
    color: 'text-indigo-400',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-full lg:w-72 bg-[#030712]/95 backdrop-blur-xl border-r border-cyan-500/20 flex flex-col shrink-0 overflow-y-auto max-h-screen">
      <div className="p-3.5 border-b border-slate-800/80 bg-[#090d16]/70 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          Chủ đề Thí nghiệm & Khám phá
        </span>
      </div>

      <nav className="p-2.5 space-y-1.5">
        {TAB_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/60 to-indigo-950/50 text-white border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div
                className={`p-2 rounded-lg mt-0.5 transition-colors ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40 ring-1 ring-cyan-300'
                    : `bg-slate-900/90 border border-slate-800 ${item.color}`
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold truncate ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">{item.subLabel}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Physics Legend at bottom of sidebar */}
      <div className="mt-auto p-3 m-2.5 rounded-2xl bg-[#090d16]/90 border border-cyan-500/20 text-xs space-y-2.5 shadow-inner">
        <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px] uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quy ước trực quan SGK</span>
        </div>
        <div className="space-y-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-amber-400 rounded-full shadow-[0_0_6px_rgba(251,191,36,0.6)]"></span>
            <span className="text-slate-300 font-medium">Quỹ đạo thực tế (s)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-cyan-400 rounded-full relative flex items-center justify-end shadow-[0_0_6px_rgba(6,182,212,0.6)]">
              <span className="w-1.5 h-1.5 border-t-2 border-r-2 border-cyan-300 transform rotate-45"></span>
            </span>
            <span className="text-slate-300 font-medium">Vectơ độ dịch chuyển (d⃗)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-fuchsia-400 rounded-full relative flex items-center justify-end shadow-[0_0_6px_rgba(232,121,249,0.6)]">
              <span className="w-1.5 h-1.5 border-t-2 border-r-2 border-fuchsia-300 transform rotate-45"></span>
            </span>
            <span className="text-slate-300 font-medium">Vectơ vận tốc tức thời (v⃗)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1 bg-emerald-400 rounded-full relative flex items-center justify-end shadow-[0_0_6px_rgba(52,211,153,0.6)]">
              <span className="w-1.5 h-1.5 border-t-2 border-r-2 border-emerald-300 transform rotate-45"></span>
            </span>
            <span className="text-slate-300 font-medium">Vectơ gia tốc (a⃗)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
