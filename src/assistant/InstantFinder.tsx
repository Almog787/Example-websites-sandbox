import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronLeft, ArrowUpRight, Sparkles, AlertCircle } from 'lucide-react';
import { EmotionalState } from './types';
import { ASSISTANT_CONFIG } from './assistantConfig';

interface InstantFinderProps {
  onNavigate: (page: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'capabilities' | 'admin') => void;
  setEmotionalState: (state: EmotionalState) => void;
  onCloseWidget: () => void;
}

export const InstantFinder: React.FC<InstantFinderProps> = ({
  onNavigate,
  setEmotionalState,
  onCloseWidget
}) => {
  const [query, setQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setEmotionalState('thinking');
      const t = setTimeout(() => {
        const queryNorm = val.trim().toLowerCase();
        const matches = ASSISTANT_CONFIG.searchIndex.filter(item => {
          const matchTitle = item.title.toLowerCase().includes(queryNorm);
          const matchCategory = item.category.toLowerCase().includes(queryNorm);
          const matchDesc = item.description.toLowerCase().includes(queryNorm);
          const matchTags = item.tags.some(t => t.toLowerCase().includes(queryNorm));
          return matchTitle || matchCategory || matchDesc || matchTags;
        });

        if (matches.length === 0) {
          setEmotionalState('shake');
        } else {
          setEmotionalState('idle');
        }
      }, 350);
      return () => clearTimeout(t);
    } else {
      setEmotionalState('idle');
    }
  };

  const normalizedQuery = query.trim().toLowerCase();

  const results = normalizedQuery
    ? ASSISTANT_CONFIG.searchIndex.filter(item => {
        const matchTitle = item.title.toLowerCase().includes(normalizedQuery);
        const matchCategory = item.category.toLowerCase().includes(normalizedQuery);
        const matchDesc = item.description.toLowerCase().includes(normalizedQuery);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(normalizedQuery));
        return matchTitle || matchCategory || matchDesc || matchTags;
      })
    : ASSISTANT_CONFIG.searchIndex; // Show all by default if search is empty

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100">
      {/* Search Bar Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="חפש תספורת, יומן, מחירון או אדמין..."
          className="w-full bg-slate-900 border-2 border-slate-800 focus:border-cyan-400 rounded-2xl py-2.5 pr-10 pl-4 text-xs font-bold text-white placeholder-slate-400 outline-none transition-all shadow-inner"
        />
        <Search className="w-4 h-4 text-cyan-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setEmotionalState('idle');
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded-md"
          >
            איפוס
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-0.5">
        <span>{normalizedQuery ? `תוצאות חיפוש (${results.length})` : 'ניווט מהיר בכל דפי האתר'}</span>
        <span className="text-[10px] text-cyan-300 font-mono">0ms Client-Search</span>
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-0.5">
        {results.length > 0 ? (
          results.map(item => (
            <motion.button
              key={item.id}
              onClick={() => {
                onNavigate(item.targetPage);
                setEmotionalState('success');
                onCloseWidget();
              }}
              whileHover={{ scale: 1.01, x: -2 }}
              whileTap={{ scale: 0.99 }}
              className="w-full text-right p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400/80 transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/40">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors truncate">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 truncate font-medium">
                  {item.description}
                </p>
              </div>

              <div className="w-7 h-7 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-cyan-400 transition-colors flex-shrink-0 mr-2">
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-transform group-hover:-translate-x-1" />
              </div>
            </motion.button>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 bg-slate-900/60 rounded-2xl border border-slate-800 p-4"
          >
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h4 className="text-sm font-black text-white mb-1">לא נמצאו תוצאות</h4>
            <p className="text-xs text-slate-300">
              נסה לחפש מילים כמו "מחירון", "תורים", "זקן" או "אדמין"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
