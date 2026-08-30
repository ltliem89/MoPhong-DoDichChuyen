import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { KNTT_PHYSICS_10_DATABASE, searchKnowledgeBase } from '../../data/knowledgeBase';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('bai-4');

  if (!isOpen) return null;

  const filteredLessons = query ? searchKnowledgeBase(query) : KNTT_PHYSICS_10_DATABASE;
  const currentLesson =
    filteredLessons.find((l) => l.id === selectedLessonId) || filteredLessons[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Sổ Tay Kiến Thức SGK Vật Lí 10 (Kết Nối Tri Thức)
              </h2>
              <p className="text-xs text-slate-400">
                Tra cứu chuẩn định nghĩa, công thức, vectơ và giải mã các ngộ nhận vật lí
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/50">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="Tìm kiếm khái niệm, công thức, độ dịch chuyển, tiếp tuyến, gia tốc..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Body Layout (Lesson Tabs + Lesson Content) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Lesson Navigation */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 p-2 space-y-1 overflow-y-auto bg-slate-950/40">
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition ${
                  currentLesson?.id === lesson.id
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-cyan-400">
                  Bài {lesson.lessonNumber}
                </div>
                <div className="truncate mt-0.5">{lesson.title}</div>
              </button>
            ))}
          </div>

          {/* Right Detail Content */}
          {currentLesson && (
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              {/* Lesson Title & Citation */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                    Bài {currentLesson.lessonNumber}
                  </span>
                  <h3 className="text-base font-extrabold text-white">{currentLesson.title}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1 italic">{currentLesson.bookSource}</p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {currentLesson.summary}
                </p>
              </div>

              {/* Key Concepts & Formulas */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Khái niệm & Công thức chuẩn SGK</span>
                </h4>
                <div className="space-y-2.5">
                  {currentLesson.keyConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          {concept.name}
                          {concept.symbol && (
                            <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30">
                              {concept.symbol}
                            </span>
                          )}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                            concept.type === 'vector'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : concept.type === 'scalar'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {concept.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{concept.definition}</p>
                      {concept.formula && (
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-xs text-emerald-300 font-bold">
                          Công thức: {concept.formula}
                        </div>
                      )}
                      <p className="text-[11px] text-slate-400 italic">💡 {concept.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Misconceptions & Scientific Corrections */}
              {currentLesson.misconceptions.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Giải mã các ngộ nhận thường gặp của học sinh</span>
                  </h4>
                  <div className="space-y-2.5">
                    {currentLesson.misconceptions.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                      >
                        <div className="text-rose-400 flex items-start gap-2">
                          <span className="font-bold shrink-0">❌ Ngộ nhận:</span>
                          <span>{m.wrong}</span>
                        </div>
                        <div className="text-emerald-400 flex items-start gap-2">
                          <span className="font-bold shrink-0">✅ Đính chính:</span>
                          <span>{m.correct}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] pl-6 border-l-2 border-slate-700 italic">
                          Lí do khoa học: {m.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
