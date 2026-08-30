import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { EXPLORATION_QUIZZES } from '../../data/quizzes';

export const QuizExplorationView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number>(0);

  const question = EXPLORATION_QUIZZES[currentIdx];
  const selectedOptId = selectedOptions[question.id];

  const handleSelectOption = (optId: string, isCorrect: boolean) => {
    if (selectedOptions[question.id]) return; // Already answered
    setSelectedOptions((prev) => ({ ...prev, [question.id]: optId }));
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleResetQuiz = () => {
    setSelectedOptions({});
    setScore(0);
    setCurrentIdx(0);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Khám Phá Sư Phạm & Trắc Nghiệm Khái Niệm
            </h2>
            <p className="text-xs text-slate-400">
              Hệ thống câu hỏi đào sâu bản chất vật lí bám sát SGK Kết nối tri thức
            </p>
          </div>
        </div>

        {/* Score & Progress */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Điểm số: <strong className="text-indigo-400">{score}</strong> / {EXPLORATION_QUIZZES.length}
          </span>
          <button
            onClick={handleResetQuiz}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Làm lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
        {/* Lesson Badge */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-indigo-400">{question.lesson}</span>
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-cyan-400" />
            {question.knttReference}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-sm font-bold text-slate-100 leading-relaxed">
          {currentIdx + 1}. {question.question}
        </h3>

        {/* Options List */}
        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            const hasAnswered = !!selectedOptId;

            let optStyle = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200';
            if (hasAnswered) {
              if (opt.isCorrect) {
                optStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500/30';
              } else if (isSelected && !opt.isCorrect) {
                optStyle = 'bg-rose-950/40 border-rose-500/80 text-rose-200 ring-1 ring-rose-500/30';
              } else {
                optStyle = 'bg-slate-950 opacity-50 border-slate-900 text-slate-500';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                disabled={hasAnswered}
                className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 text-xs leading-relaxed ${optStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 uppercase mt-0.5">
                  {opt.id}
                </span>
                <div className="flex-1">
                  <div>{opt.text}</div>
                  {/* Detailed Explanation on Answer */}
                  {hasAnswered && (isSelected || opt.isCorrect) && (
                    <div className="mt-2 text-[11px] pt-2 border-t border-white/10 opacity-90">
                      {opt.explanation}
                    </div>
                  )}
                </div>
                {hasAnswered && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                )}
                {hasAnswered && isSelected && !opt.isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Pedagogical Summary Box */}
        {selectedOptId && (
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-cyan-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>TỔNG KẾT KHÁI NIỆM TRỌNG TÂM:</span>
            </div>
            {question.explanationSummary}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition disabled:opacity-40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Câu trước</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          Câu {currentIdx + 1} / {EXPLORATION_QUIZZES.length}
        </span>

        <button
          onClick={() => setCurrentIdx((i) => Math.min(EXPLORATION_QUIZZES.length - 1, i + 1))}
          disabled={currentIdx === EXPLORATION_QUIZZES.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition disabled:opacity-40"
        >
          <span>Câu tiếp theo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
