import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Maximize2,
  Presentation,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  mode: 'student' | 'teacher';
  setMode: (mode: 'student' | 'teacher') => void;
  onOpenKnowledge: () => void;
  onOpenTeacherTools: () => void;
  onResetAll: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  onOpenKnowledge,
  onOpenTeacherTools,
  onResetAll,
  onOpenHelp,
}) => {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="bg-[#030712]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              PHÒNG THÍ NGHIỆM ĐỘNG HỌC
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
              Vật lí 10 (KNTT)
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Độ dịch chuyển • Quãng đường • Tốc độ • Vận tốc • Đồ thị • Gia tốc
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-[#090d16] rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMode('student')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
              mode === 'student'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chế độ học sinh: Tự do khám phá, dự đoán và làm thí nghiệm"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Học Sinh</span>
          </button>
          <button
            onClick={() => {
              setMode('teacher');
              onOpenTeacherTools();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold ${
              mode === 'teacher'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-1 ring-amber-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chế độ giáo viên: Trình chiếu bài giảng, ẩn/hiện lớp đại lượng, khóa tham số"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Giáo Viên</span>
          </button>
        </div>

        {/* Knowledge Base Modal Button */}
        <button
          onClick={onOpenKnowledge}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-cyan-500/30 hover:border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.1)] transition"
          title="Mở Sổ tay Kiến thức SGK KNTT"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline">Sổ tay KNTT</span>
        </button>

        {/* Teacher Presentation Settings */}
        <button
          onClick={onOpenTeacherTools}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-amber-500/30 hover:border-amber-400/50 transition"
          title="Tùy chỉnh lớp hiển thị & Trình chiếu"
        >
          <Layers className="w-4 h-4 text-amber-400" />
        </button>

        {/* Help & Guide */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-emerald-500/30 hover:border-emerald-400/50 transition"
          title="Hướng dẫn sử dụng & Quy ước vật lí"
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Reset */}
        <button
          onClick={onResetAll}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition"
          title="Đặt lại toàn bộ vị trí & mô phỏng"
        >
          <RotateCcw className="w-4 h-4 text-slate-400 hover:text-white" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullScreen}
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition hidden sm:flex"
          title="Toàn màn hình"
        >
          <Maximize2 className="w-4 h-4 text-slate-400 hover:text-white" />
        </button>
      </div>
    </header>
  );
};
