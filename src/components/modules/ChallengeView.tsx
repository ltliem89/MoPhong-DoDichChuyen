import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { LAB_CHALLENGES } from '../../data/challenges';
import { MotionState } from '../../types/physics';
import confetti from 'canvas-confetti';

interface ChallengeViewProps {
  motionState: MotionState;
  onApplyChallengePreset?: (challengeId: string) => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({ motionState }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, boolean>>({});

  const challenge = LAB_CHALLENGES[currentIdx];

  // Evaluate current challenge criteria against motion state
  const isSatisfied = (): boolean => {
    if (!challenge) return false;
    const { targetCriteria } = challenge;
    const { distanceTraveled, displacementMagnitude, averageSpeed, averageVelocityMagnitude } =
      motionState;

    if (targetCriteria.minDistance && distanceTraveled < targetCriteria.minDistance) {
      return false;
    }

    if (targetCriteria.requireZeroDisplacement && displacementMagnitude > 2.0) {
      return false;
    }

    if (
      targetCriteria.targetAverageSpeed &&
      Math.abs(averageSpeed - targetCriteria.targetAverageSpeed) > 3.0
    ) {
      return false;
    }

    if (
      targetCriteria.targetAverageVelocityMag &&
      averageVelocityMagnitude >= targetCriteria.targetAverageVelocityMag
    ) {
      return false;
    }

    return true;
  };

  const satisfied = isSatisfied();

  useEffect(() => {
    if (satisfied && !completedChallenges[challenge.id]) {
      setCompletedChallenges((prev) => ({ ...prev, [challenge.id]: true }));
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe ignore
      }
    }
  }, [satisfied, challenge.id, completedChallenges]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-4">
      {/* Header & Level Browser */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Phòng Thử Thách Động Học (Gamification)
            </h2>
            <p className="text-xs text-slate-400">
              Vận dụng trực tiếp kiến thức Vật lí để vượt qua 5 cấp độ thử thách
            </p>
          </div>
        </div>

        {/* Progress Badges */}
        <div className="flex items-center gap-1.5">
          {LAB_CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                currentIdx === idx
                  ? 'bg-yellow-500 text-slate-950 ring-2 ring-yellow-300'
                  : completedChallenges[ch.id]
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-yellow-400">{challenge.title}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
            Độ khó: {challenge.difficulty}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-medium">
          <strong className="text-white block mb-1">Mục tiêu:</strong>
          {challenge.goal}
        </div>

        {/* Live Criteria Monitor */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="text-slate-300">
            Quãng đường hiện tại s = <strong className="text-amber-400">{motionState.distanceTraveled.toFixed(1)}m</strong> • Độ dịch chuyển |d| = <strong className="text-cyan-400">{motionState.displacementMagnitude.toFixed(1)}m</strong>
          </div>
          <span
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
              satisfied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {satisfied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ĐÃ HOÀN THÀNH</span>
              </>
            ) : (
              <span>Đang thực hiện...</span>
            )}
          </span>
        </div>

        {/* Hint */}
        <div className="flex items-start gap-2 text-xs text-slate-400 p-2.5 rounded-lg bg-slate-900/40">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Gợi ý:</strong> {challenge.hint}
          </span>
        </div>

        {/* Pedagogical Explanation when completed */}
        {satisfied && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs leading-relaxed animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-300">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>GIẢI THÍCH VẬT LÍ (SGK KNTT):</span>
            </div>
            {challenge.pedagogicalExplanation}
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition disabled:opacity-40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Thử thách trước</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          {currentIdx + 1} / {LAB_CHALLENGES.length}
        </span>

        <button
          onClick={() => setCurrentIdx((i) => Math.min(LAB_CHALLENGES.length - 1, i + 1))}
          disabled={currentIdx === LAB_CHALLENGES.length - 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition disabled:opacity-40"
        >
          <span>Thử thách tiếp theo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
