import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Direction } from '../types/game';
import { sound } from '../utils/sound';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, onStartGame }) => {
  const [practiceStep, setPracticeStep] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  if (!isOpen) return null;

  const practiceItems = [
    {
      title: 'Rule 1: Direct Arrows',
      desc: 'When an arrow is Cyan, swipe or press the key in the SAME direction it points.',
      arrowDir: 'RIGHT' as Direction,
      isInverted: false,
      correctDir: 'RIGHT' as Direction,
      label: 'Points RIGHT → Swipe RIGHT',
    },
    {
      title: 'Rule 2: Flanker Distractors',
      desc: 'When you see multiple arrows, IGNORE the outer arrows and focus strictly on the CENTER arrow!',
      arrowDir: 'UP' as Direction,
      isFlanker: true,
      flankers: ['DOWN', 'DOWN', 'UP', 'DOWN', 'DOWN'] as Direction[],
      correctDir: 'UP' as Direction,
      label: 'Center points UP → Swipe UP',
    },
    {
      title: 'Rule 3: Inverted Colors',
      desc: 'When an arrow is Coral / Red, swipe or press in the OPPOSITE direction!',
      arrowDir: 'DOWN' as Direction,
      isInverted: true,
      correctDir: 'UP' as Direction,
      label: 'Points DOWN → Swipe UP (Opposite)',
    },
  ];

  const currentPractice = practiceItems[practiceStep];

  const handleTestAnswer = (dir: Direction) => {
    sound.playTap();
    if (dir === currentPractice.correctDir) {
      sound.playCorrect(2);
      setFeedback({ message: 'Correct! Great job!', isCorrect: true });
      setTimeout(() => {
        setFeedback(null);
        if (practiceStep < practiceItems.length - 1) {
          setPracticeStep((s) => s + 1);
        }
      }, 1000);
    } else {
      sound.playWrong();
      setFeedback({
        message: `Oops! For this one, swipe ${currentPractice.correctDir}.`,
        isCorrect: false,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#21184d] border border-indigo-400/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
              How To Play
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Arrows Direction
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1">
          {/* Practice Tutorial Box */}
          <div className="rounded-2xl bg-[#2a1e5c] border border-indigo-400/25 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Step {practiceStep + 1} of {practiceItems.length}
              </span>
              <div className="flex gap-1.5">
                {practiceItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPracticeStep(i);
                      setFeedback(null);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      i === practiceStep ? 'bg-cyan-400 w-5' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {currentPractice.title}
            </h3>
            <p className="text-sm text-indigo-200/80 mb-4 leading-relaxed">
              {currentPractice.desc}
            </p>

            {/* Visual demo */}
            <div className="w-full py-6 rounded-xl bg-[#1a123d] border border-white/10 flex flex-col items-center justify-center mb-4">
              <div className="text-xs font-semibold text-indigo-300 mb-2">
                {currentPractice.label}
              </div>

              {currentPractice.isFlanker ? (
                <div className="flex items-center gap-2">
                  {currentPractice.flankers?.map((dir, i) => (
                    <div
                      key={i}
                      className={`text-2xl font-black ${
                        i === 2
                          ? 'text-cyan-400 scale-125 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50'
                          : 'text-indigo-400/50'
                      }`}
                    >
                      {dir === 'UP' ? '↑' : '↓'}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`text-4xl font-black transition-transform ${
                    currentPractice.isInverted ? 'text-rose-400' : 'text-cyan-400'
                  }`}
                >
                  {currentPractice.arrowDir === 'RIGHT' ? '→' : '↓'}
                </div>
              )}
            </div>

            {/* Interactive practice buttons */}
            <div className="text-center mb-2">
              <p className="text-xs text-indigo-200/70 mb-2 font-medium">
                Try it below: which way should you swipe?
              </p>
              <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
                {(['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => handleTestAnswer(d)}
                    className="py-2.5 px-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm border border-white/15 transition cursor-pointer"
                  >
                    {d === 'UP' && '↑ Up'}
                    {d === 'DOWN' && '↓ Down'}
                    {d === 'LEFT' && '← Left'}
                    {d === 'RIGHT' && '→ Right'}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback message */}
            {feedback && (
              <div
                className={`mt-3 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  feedback.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {feedback.message}
              </div>
            )}
          </div>

          {/* Quick controls info & Urgency Gauge Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-indigo-200/80">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="font-bold text-white mb-1">📱 Touch / Mouse</div>
              <p>Swipe directly on the screen or tap the directional pad.</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="font-bold text-white mb-1">⌨️ Keyboard</div>
              <p>Arrow Keys (↑, ↓, ←, →) or W, A, S, D for instant response.</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
              <div className="font-bold text-cyan-300 mb-1">⚡ Urgency Gauge</div>
              <p>Each arrow has a shrinking timer! Answer before it runs out for +35 speed bonuses.</p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-5 py-2.5 rounded-full text-indigo-200 hover:text-white text-sm font-semibold transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
              onStartGame();
            }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 active:scale-95 text-[#160e33] font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition cursor-pointer"
          >
            <span>Play Game</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
