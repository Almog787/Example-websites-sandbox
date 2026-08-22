import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Scissors, 
  Crown, 
  Flame, 
  Layers, 
  Calendar, 
  MessageSquare, 
  MousePointerClick, 
  Zap, 
  Clock, 
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { QuizStep, QuizResult, EmotionalState } from './types';
import { ASSISTANT_CONFIG } from './assistantConfig';

interface QuizMatcherProps {
  onNavigate: (page: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'capabilities' | 'admin') => void;
  setEmotionalState: (state: EmotionalState) => void;
  onCloseWidget: () => void;
}

export const QuizMatcher: React.FC<QuizMatcherProps> = ({
  onNavigate,
  setEmotionalState,
  onCloseWidget
}) => {
  const [currentStepId, setCurrentStepId] = useState<string>(ASSISTANT_CONFIG.initialQuizStepId);
  const [history, setHistory] = useState<string[]>([]);
  const [activeResult, setActiveResult] = useState<QuizResult | null>(null);

  const currentStep: QuizStep | undefined = ASSISTANT_CONFIG.quizTree[currentStepId];

  const handleSelectOption = (option: any) => {
    setEmotionalState('happy');
    setTimeout(() => setEmotionalState('idle'), 1600);

    if (option.result) {
      setActiveResult(option.result);
      setEmotionalState('success');
    } else if (option.nextStepId && ASSISTANT_CONFIG.quizTree[option.nextStepId]) {
      setHistory(prev => [...prev, currentStepId]);
      setCurrentStepId(option.nextStepId);
    }
  };

  const handleBack = () => {
    if (activeResult) {
      setActiveResult(null);
      setEmotionalState('idle');
      return;
    }

    if (history.length > 0) {
      const prevStepId = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentStepId(prevStepId);
      setEmotionalState('idle');
    }
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentStepId(ASSISTANT_CONFIG.initialQuizStepId);
    setActiveResult(null);
    setEmotionalState('idle');
  };

  const renderIcon = (name?: string) => {
    const iconProps = { className: "w-5 h-5 text-cyan-400 flex-shrink-0" };
    switch (name) {
      case 'Scissors': return <Scissors {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      case 'Crown': return <Crown {...iconProps} />;
      case 'Flame': return <Flame {...iconProps} />;
      case 'Layers': return <Layers {...iconProps} />;
      case 'Calendar': return <Calendar {...iconProps} />;
      case 'MessageSquare': return <MessageSquare {...iconProps} />;
      case 'MousePointerClick': return <MousePointerClick {...iconProps} />;
      default: return <Zap {...iconProps} />;
    }
  };

  return (
    <div className="flex flex-col h-full text-slate-100">
      {/* Top Breadcrumb & Reset Controls */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1 text-slate-300 font-medium">
          {(history.length > 0 || activeResult) ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-cyan-300 hover:text-white font-black transition-colors py-1 px-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-400"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              חזור שלב
            </button>
          ) : (
            <span className="text-cyan-300/90 font-bold">שלב 1 מתוך 2</span>
          )}
        </div>

        <button
          onClick={handleReset}
          title="התחל שאלון מחדש"
          className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 font-bold transition-colors py-1 px-2 rounded-lg hover:bg-slate-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          התחל מחדש
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeResult ? (
          /* Result Card Mode */
          <motion.div
            key="quiz-result"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3 py-1"
          >
            <div className="bg-slate-900/95 border-2 border-cyan-400 rounded-2xl p-4 shadow-[0_10px_30px_rgba(6,182,212,0.25)] relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400" />

              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black border border-cyan-400/50">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  {activeResult.badge || 'המלצת העוזר'}
                </span>

                {activeResult.estimatedPrice && (
                  <span className="text-sm font-black text-amber-300 font-mono bg-slate-950 px-2.5 py-0.5 rounded-md border border-amber-400/40">
                    {activeResult.estimatedPrice}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-black text-white mb-1.5">
                {activeResult.title}
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed mb-3 font-medium">
                {activeResult.summary}
              </p>

              {(activeResult.estimatedDuration || activeResult.recommendedService) && (
                <div className="flex flex-wrap gap-2 text-[11px] mb-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {activeResult.estimatedDuration && (
                    <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      משך זמן משוער: {activeResult.estimatedDuration}
                    </span>
                  )}
                </div>
              )}

              {activeResult.proTip && (
                <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-3 text-[11px] text-amber-200 font-bold leading-normal mb-3 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{activeResult.proTip}</span>
                </div>
              )}

              <button
                onClick={() => {
                  onNavigate(activeResult.targetPage);
                  onCloseWidget();
                }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs sm:text-sm py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>{activeResult.actionLabel}</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-xs text-cyan-300/80 hover:text-cyan-300 transition-colors font-bold underline underline-offset-4"
              >
                לנסות שאלה או מסלול אחר?
              </button>
            </div>
          </motion.div>
        ) : currentStep ? (
          /* Step Question & Options Mode */
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-2.5"
          >
            <div className="mb-1">
              <h3 className="text-sm font-black text-white leading-snug">
                {currentStep.question}
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {currentStep.options.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  whileHover={{ scale: 1.01, x: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-right p-3 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 hover:border-cyan-400 transition-all flex items-center gap-3 shadow-md group"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                    {renderIcon(option.iconName)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{option.title}</span>
                      <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-transform group-hover:-translate-x-1" />
                    </div>
                    <p className="text-[11px] text-slate-300 truncate mt-0.5 font-medium">
                      {option.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
