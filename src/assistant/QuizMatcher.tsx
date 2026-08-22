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
    const iconProps = { className: "w-5 h-5 text-secondary-dark flex-shrink-0" };
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
    <div className="flex flex-col h-full">
      {/* Top Breadcrumb & Reset Controls */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/40 text-xs">
        <div className="flex items-center gap-1 text-on-surface-variant font-medium">
          {(history.length > 0 || activeResult) ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-secondary-dark hover:text-primary font-bold transition-colors py-1 px-2 rounded-lg hover:bg-secondary/10"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              חזור שלב
            </button>
          ) : (
            <span className="text-on-surface-variant/80">שלב 1 מתוך 2</span>
          )}
        </div>

        <button
          onClick={handleReset}
          title="התחל שאלון מחדש"
          className="flex items-center gap-1 text-on-surface-variant hover:text-secondary-dark font-medium transition-colors py-1 px-2 rounded-lg hover:bg-surface-variant/40"
        >
          <RotateCcw className="w-3 h-3" />
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
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-secondary/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-secondary/40 via-secondary to-secondary/40" />

              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary-dark text-[11px] font-extrabold border border-secondary/30">
                  <Sparkles className="w-3 h-3" />
                  {activeResult.badge || 'המלצת העוזר'}
                </span>

                {activeResult.estimatedPrice && (
                  <span className="text-sm font-extrabold text-secondary-dark font-mono bg-surface/80 px-2 py-0.5 rounded-md border border-secondary/20">
                    {activeResult.estimatedPrice}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-lg font-bold text-on-surface mb-1">
                {activeResult.title}
              </h3>
              
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                {activeResult.summary}
              </p>

              {(activeResult.estimatedDuration || activeResult.recommendedService) && (
                <div className="flex flex-wrap gap-2 text-[11px] mb-3 bg-surface/90 p-2 rounded-xl border border-outline-variant/40">
                  {activeResult.estimatedDuration && (
                    <span className="flex items-center gap-1 text-on-surface font-semibold">
                      <Clock className="w-3.5 h-3.5 text-secondary-dark" />
                      משך זמן משוער: {activeResult.estimatedDuration}
                    </span>
                  )}
                </div>
              )}

              {activeResult.proTip && (
                <div className="bg-amber-100/70 border border-amber-300/60 rounded-xl p-2.5 text-[11px] text-amber-950 font-medium leading-normal mb-3 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span>{activeResult.proTip}</span>
                </div>
              )}

              <button
                onClick={() => {
                  onNavigate(activeResult.targetPage);
                  onCloseWidget();
                }}
                className="w-full bg-secondary text-primary font-bold text-xs sm:text-sm py-3 rounded-xl hover:bg-secondary-dark hover:text-white transition-all shadow-md flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <span>{activeResult.actionLabel}</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-xs text-on-surface-variant hover:text-secondary-dark transition-colors font-medium underline underline-offset-4"
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
              <h3 className="text-sm font-bold text-on-surface leading-snug">
                {currentStep.question}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
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
                  className="w-full text-right p-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:bg-secondary/10 hover:border-secondary/60 transition-all flex items-center gap-3 shadow-xs group"
                >
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    {renderIcon(option.iconName)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-secondary-dark transition-colors flex items-center justify-between">
                      <span>{option.title}</span>
                      <ChevronLeft className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-secondary-dark transition-transform group-hover:-translate-x-1" />
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
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
