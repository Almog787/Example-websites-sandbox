import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ChevronLeft, 
  Lightbulb
} from 'lucide-react';
import { TipDefinition, EmotionalState } from './types';
import { ASSISTANT_CONFIG } from './assistantConfig';

interface GoldenCardsProps {
  onNavigate: (page: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'capabilities' | 'admin') => void;
  setEmotionalState: (state: EmotionalState) => void;
  onCloseWidget: () => void;
}

export const GoldenCards: React.FC<GoldenCardsProps> = ({
  onNavigate,
  setEmotionalState,
  onCloseWidget
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'הכל' },
    { id: 'hair', label: 'טיפוח שיער' },
    { id: 'beard', label: 'עיצוב זקן' },
    { id: 'event', label: 'הכנה לאירוע' },
    { id: 'daily', label: 'הרגלים יומיומיים' }
  ];

  const filteredTips = selectedCategory === 'all'
    ? ASSISTANT_CONFIG.goldenTips
    : ASSISTANT_CONFIG.goldenTips.filter(tip => tip.category === selectedCategory);

  const handleCopyTip = (tip: TipDefinition) => {
    const textToCopy = `${tip.title}\n${tip.summary}\n${tip.goldenRule}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(tip.id);
    setEmotionalState('happy');

    setTimeout(() => {
      setCopiedId(null);
      setEmotionalState('idle');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full gap-2.5">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 hide-scrollbar">
        {categories.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setEmotionalState('thinking');
                setTimeout(() => setEmotionalState('idle'), 600);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-secondary text-primary shadow-xs scale-105'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Cards Scroll Container */}
      <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-0.5">
        <AnimatePresence mode="popLayout">
          {filteredTips.map(tip => {
            const isCopied = copiedId === tip.id;
            return (
              <motion.div
                key={tip.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="p-3.5 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest hover:border-secondary/50 transition-all shadow-xs flex flex-col gap-2 relative group"
              >
                {/* Header Strip */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary-dark bg-secondary/15 px-2 py-0.5 rounded-md border border-secondary/30">
                    {tip.categoryLabel}
                  </span>

                  <button
                    onClick={() => handleCopyTip(tip)}
                    title="העתק טיפ"
                    className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg font-bold transition-all ${
                      isCopied
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'text-on-surface-variant hover:text-secondary-dark hover:bg-surface-container'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-700" />
                        <span>הועתק!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>העתק טיפ</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title & Summary */}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-on-surface leading-snug">
                    {tip.title}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">
                    {tip.summary}
                  </p>
                </div>

                {/* Highlighted Golden Rule */}
                <div className="bg-amber-50/90 border border-amber-300/70 p-2.5 rounded-xl text-[11px] text-amber-950 font-bold leading-normal flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <span>{tip.goldenRule}</span>
                </div>

                {/* Optional Deep Link Button */}
                {tip.targetPage && (
                  <button
                    onClick={() => {
                      onNavigate(tip.targetPage!);
                      onCloseWidget();
                    }}
                    className="self-start text-[11px] text-secondary-dark font-bold hover:text-primary flex items-center gap-1 group/btn pt-0.5"
                  >
                    <span>{tip.actionLabel || 'למידע וקביעת תור'}</span>
                    <ChevronLeft className="w-3 h-3 group-hover/btn:-translate-x-1 transition-transform" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
