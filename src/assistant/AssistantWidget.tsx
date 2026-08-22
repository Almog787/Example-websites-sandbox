import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Calculator, 
  Lightbulb, 
  Search, 
  X
} from 'lucide-react';
import { InteractiveAvatar } from './InteractiveAvatar';
import { QuizMatcher } from './QuizMatcher';
import { QuickUtility } from './QuickUtility';
import { GoldenCards } from './GoldenCards';
import { InstantFinder } from './InstantFinder';
import { AssistantTab, EmotionalState } from './types';
import { ASSISTANT_CONFIG } from './assistantConfig';

interface AssistantWidgetProps {
  onNavigate: (page: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'capabilities' | 'admin') => void;
}

export const AssistantWidget: React.FC<AssistantWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>('quiz');
  const [emotionalState, setEmotionalState] = useState<EmotionalState>('idle');
  const [showCallout, setShowCallout] = useState<boolean>(true);

  // Hide initial callout bubble after 9 seconds or when opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCallout(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowCallout(false);
    setEmotionalState('happy');
    setTimeout(() => setEmotionalState('idle'), 1200);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEmotionalState('idle');
  };

  const tabs: { id: AssistantTab; label: string; icon: React.ReactNode }[] = [
    { id: 'quiz', label: 'הכוונה', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'tools', label: 'מחשבונים', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'tips', label: 'כללי זהב', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { id: 'search', label: 'חיפוש', icon: <Search className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none font-sans" dir="rtl">
      {/* Floating Trigger Button & Avatar */}
      <AnimatePresence>
        {!isOpen && (
          <div className="relative flex items-center">
            {/* Animated Callout / Notification Bubble */}
            <AnimatePresence>
              {showCallout && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="absolute right-full mr-3 whitespace-nowrap bg-surface-container-lowest text-on-surface border border-secondary/50 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer hover:border-secondary transition-all"
                  onClick={handleOpen}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse flex-shrink-0" />
                  <span className="text-xs font-bold text-on-surface">
                    {ASSISTANT_CONFIG.theme.welcomeBubbleText}
                  </span>
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-surface-container-lowest border-t border-r border-secondary/50 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trigger Button */}
            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative p-1 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white shadow-[0_10px_35px_rgba(0,0,0,0.35),0_0_20px_rgba(212,175,55,0.3)] border-2 border-secondary/60 hover:border-secondary flex items-center justify-center group"
              title="פתח עוזר אינטראקטיבי עצמאי"
            >
              <InteractiveAvatar size={54} emotionalState={emotionalState} isTrigger={true} />

              {/* Status Ping Dot */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-secondary border-2 border-primary" />
              </span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Flyout Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="w-[calc(100vw-32px)] sm:w-[415px] max-h-[85vh] sm:max-h-[620px] bg-surface text-on-surface rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_30px_rgba(212,175,55,0.15)] border border-secondary/40 flex flex-col overflow-hidden relative"
          >
            {/* Header: Dark Luxury Brand Styling with Gold Accent Line */}
            <div className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-black text-white p-3.5 px-4 flex items-center justify-between border-b border-neutral-800">
              {/* Neon Gold Glow Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />

              <div className="flex items-center gap-2.5">
                <InteractiveAvatar size={42} emotionalState={emotionalState} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif text-sm font-bold text-white tracking-wide">
                      {ASSISTANT_CONFIG.theme.botName}
                    </h3>
                    <span className="text-[9px] bg-secondary/25 text-amber-300 font-mono px-1.5 py-0.2 rounded border border-secondary/40 font-bold">
                      Zero-AI / 0ms
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    {ASSISTANT_CONFIG.theme.roleTitle}
                  </p>
                </div>
              </div>

              {/* Close & Minimize buttons */}
              <div className="flex items-center gap-1 text-neutral-400">
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-full hover:bg-neutral-800 hover:text-white transition-colors"
                  title="סגור עוזר"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs (4 Modules) */}
            <div className="grid grid-cols-4 gap-1 p-2 bg-surface-container border-b border-outline-variant/40">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setEmotionalState('thinking');
                      setTimeout(() => setEmotionalState('idle'), 600);
                    }}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 relative ${
                      isActive
                        ? 'bg-secondary text-primary shadow-xs font-extrabold scale-[1.02]'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50'
                    }`}
                  >
                    {tab.icon}
                    <span className="text-[11px] leading-none">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-surface/95">
              <AnimatePresence mode="wait">
                {activeTab === 'quiz' && (
                  <motion.div
                    key="tab-quiz"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuizMatcher
                      onNavigate={onNavigate}
                      setEmotionalState={setEmotionalState}
                      onCloseWidget={handleClose}
                    />
                  </motion.div>
                )}

                {activeTab === 'tools' && (
                  <motion.div
                    key="tab-tools"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuickUtility
                      onNavigate={onNavigate}
                      setEmotionalState={setEmotionalState}
                      onCloseWidget={handleClose}
                    />
                  </motion.div>
                )}

                {activeTab === 'tips' && (
                  <motion.div
                    key="tab-tips"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GoldenCards
                      onNavigate={onNavigate}
                      setEmotionalState={setEmotionalState}
                      onCloseWidget={handleClose}
                    />
                  </motion.div>
                )}

                {activeTab === 'search' && (
                  <motion.div
                    key="tab-search"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <InstantFinder
                      onNavigate={onNavigate}
                      setEmotionalState={setEmotionalState}
                      onCloseWidget={handleClose}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Status Strip */}
            <div className="p-2 px-3 bg-surface-container text-center border-t border-outline-variant/30 text-[10px] text-on-surface-variant flex items-center justify-between font-medium">
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                100% Client-Side • פרטיות מלאה
              </span>
              <span className="text-on-surface-variant/80 font-mono">
                AutoFlow Assistant Engine
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
