import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  ChevronLeft
} from 'lucide-react';
import { SearchItem, EmotionalState } from './types';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus search input on tab open
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timeout);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setEmotionalState('thinking');
      const t = setTimeout(() => setEmotionalState('idle'), 600);
      return () => clearTimeout(t);
    }
  };

  const normalizedQuery = query.trim().toLowerCase();

  const searchResults: SearchItem[] = !normalizedQuery
    ? ASSISTANT_CONFIG.searchIndex.slice(0, 4) // Show top items when empty
    : ASSISTANT_CONFIG.searchIndex.filter(item => {
        const matchTitle = item.title.toLowerCase().includes(normalizedQuery);
        const matchCategory = item.category.toLowerCase().includes(normalizedQuery);
        const matchDesc = item.description.toLowerCase().includes(normalizedQuery);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(normalizedQuery));
        return matchTitle || matchCategory || matchDesc || matchTags;
      });

  const popularSuggestions = [
    'יומן שבועי',
    'צ\'אט בוט',
    'מחירון',
    'דשבורד מנהל',
    'דירוג פייד',
    'אוטומציות'
  ];

  return (
    <div className="flex flex-col h-full gap-2.5">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-on-surface-variant absolute right-3 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => handleQueryChange(e.target.value)}
          placeholder="חפש שירותים, דפי הזמנה, כלים או מחירון..."
          className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl pr-9 pl-8 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/70 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/40 transition-all shadow-inner"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute left-2.5 p-1 text-on-surface-variant hover:text-on-surface rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggestion Chips */}
      {!query && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-on-surface-variant font-medium ml-1">חיפושים נפוצים:</span>
          {popularSuggestions.map(s => (
            <button
              key={s}
              onClick={() => handleQueryChange(s)}
              className="text-[10px] bg-surface-container hover:bg-secondary/15 hover:text-secondary-dark text-on-surface font-semibold px-2 py-0.5 rounded-md border border-outline-variant/40 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1">
        <span>
          {query ? `נמצאו ${searchResults.length} תוצאות` : 'תוצאות מומלצות לניווט מהיר:'}
        </span>
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-0.5">
        <AnimatePresence mode="popLayout">
          {searchResults.length > 0 ? (
            searchResults.map(item => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => {
                  setEmotionalState('success');
                  onNavigate(item.targetPage);
                  onCloseWidget();
                }}
                className="w-full text-right p-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest hover:bg-secondary/10 hover:border-secondary/60 transition-all flex items-center justify-between gap-3 shadow-xs group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-secondary-dark bg-secondary/15 px-1.5 py-0.2 rounded border border-secondary/20">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold text-amber-950 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-secondary-dark transition-colors">
                    {item.title}
                  </div>

                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-1 text-xs text-secondary-dark font-bold group-hover:translate-x-[-2px] transition-transform">
                  <span className="hidden sm:inline text-[11px]">{item.actionLabel}</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </motion.button>
            ))
          ) : (
            <div className="py-8 text-center bg-surface-container rounded-2xl border border-outline-variant/40">
              <Search className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
              <p className="text-xs font-bold text-on-surface">לא נמצאו תוצאות עבור "{query}"</p>
              <p className="text-[11px] text-on-surface-variant mt-1">נסה מילת מפתח אחרת כמו "תור", "זקן", או "מנהל"</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
