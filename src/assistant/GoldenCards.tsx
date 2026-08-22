import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
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
    { id: 'hair', label: 'שיער' },
    { id: 'beard', label: 'זקן' },
    { id: 'event', label: 'אירועים' },
    { id: 'daily', label: 'יום-יומי' }
  ];

  const filteredTips = selectedCategory === 'all'
    ? ASSISTANT_CONFIG.goldenTips
    : ASSISTANT_CONFIG.goldenTips.filter(t => t.category === selectedCategory);

  const handleCopy = (tip: TipDefinition, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${tip.title}: ${tip.goldenRule}`);
    setCopiedId(tip.id);
    setEmotionalState('happy');
    setTimeout(() => setCopiedId(null), 2000);
    setTimeout(() => setEmotionalState('idle'), 1000);
  };

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setEmotionalState('thinking');
                setTimeout(() => setEmotionalState('idle'), 500);
              }}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-bold ${
                isActive
                  ? 'bg-cyan-400 text-slate-950 shadow-xs font-black'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-0.5">
        <AnimatePresence mode="popLayout">
          {filteredTips.map(tip => (
            <motion.div
              key={tip.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-400/80 p-3.5 rounded-2xl transition-all shadow-md group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-md border border-cyan-400/40">
                  {tip.categoryLabel}
                </span>

                <button
                  onClick={(e) => handleCopy(tip, e)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-cyan-300 transition-colors bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-cyan-400"
                  title="העתק טיפ ללוח"
                >
                  {copiedId === tip.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">הועתק!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>העתק</span>
                    </>
                  )}
                </button>
              </div>

              <h4 className="font-serif text-sm font-black text-white mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{tip.title}</span>
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed font-medium mb-1.5">
                {tip.summary}
              </p>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-amber-300 font-bold mb-2.5">
                💡 {tip.goldenRule}
              </div>

              {tip.targetPage && (
                <button
                  onClick={() => {
                    onNavigate(tip.targetPage!);
                    onCloseWidget();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-black text-cyan-300 hover:text-cyan-200 transition-colors group/link"
                >
                  <span>{tip.actionLabel || 'עבור לעמוד'}</span>
                  <ChevronLeft className="w-3.5 h-3.5 group-hover/link:-translate-x-1 transition-transform" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
