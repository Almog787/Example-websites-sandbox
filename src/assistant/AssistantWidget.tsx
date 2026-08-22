import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
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
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  // Expose API for external sites to trigger animations (Agnostic Embedding)
  useEffect(() => {
    (window as any).CalcE = {
      trigger: (state: EmotionalState) => {
        setEmotionalState(state);
        setTimeout(() => setEmotionalState('idle'), 2000);
      },
      open: () => setIsOpen(true),
      close: () => setIsOpen(false)
    };
  }, []);

  // Hide initial callout bubble after 9 seconds or when opened
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCallout(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  const toggleOpen = () => {
    if (isDragging) return;
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
      setShowCallout(false);
      setEmotionalState('happy');
      setTimeout(() => setEmotionalState('idle'), 1200);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setEmotionalState('idle');
  };

  const tabs: { id: AssistantTab; label: string; icon: React.ReactNode }[] = [
    { id: 'quiz', label: 'הכוונה', icon: <Compass className="w-4 h-4" /> },
    { id: 'tools', label: 'מחשבונים', icon: <Calculator className="w-4 h-4" /> },
    { id: 'tips', label: 'כללי זהב', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'search', label: 'חיפוש', icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Invisible layer for drag constraints to snap to edges */}
      <div ref={dragConstraintsRef} className="fixed inset-4 pointer-events-none z-40" />

      <motion.div 
        className="fixed bottom-6 left-6 z-50 select-none font-sans opacity-90 hover:opacity-100 transition-opacity duration-300" 
        dir="rtl"
        drag
        dragConstraints={dragConstraintsRef}
        dragElastic={0.4}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setTimeout(() => setIsDragging(false), 100);
        }}
        whileDrag={{ scale: 0.95, cursor: 'grabbing' }}
        style={{ touchAction: "none" }}
      >
        {/* Floating Trigger Button & Avatar - ALWAYS VISIBLE */}
        <div className="relative flex items-center group/trigger cursor-grab active:cursor-grabbing">
          {/* Animated Callout / Notification Bubble */}
          <AnimatePresence>
            {showCallout && !isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="absolute right-full mr-3 whitespace-nowrap bg-slate-900 text-cyan-300 border-2 border-cyan-400 px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer hover:border-cyan-300 hover:scale-105 transition-all"
                onClick={toggleOpen}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping flex-shrink-0" />
                <span className="text-xs font-black tracking-wide text-cyan-200">
                  {ASSISTANT_CONFIG.theme.welcomeBubbleText}
                </span>
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3.5 h-3.5 bg-slate-900 border-t-2 border-r-2 border-cyan-400 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger Button - High Contrast Neon Gradient Ring */}
          <motion.button
            onClick={toggleOpen}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`relative p-1.5 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 text-white shadow-[0_15px_45px_rgba(0,0,0,0.6),0_0_30px_rgba(6,182,212,0.5)] border-2 transition-colors pointer-events-auto ${isOpen ? 'border-amber-400' : 'border-cyan-400 group-hover/trigger:border-amber-400'}`}
            title="פתח/סגור עוזר אינטראקטיבי"
          >
            <InteractiveAvatar size={58} emotionalState={emotionalState} isTrigger={!isOpen} />

            {/* Status Ping Dot */}
            {!isOpen && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border-2 border-slate-950" />
              </span>
            )}
          </motion.button>
        </div>

        {/* Flyout Window Container - High Contrast Dark Glassmorphism */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.9, transformOrigin: 'bottom left' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="absolute bottom-full mb-4 left-0 w-[calc(100vw-32px)] sm:w-[425px] max-h-[85vh] sm:max-h-[630px] bg-slate-950/95 backdrop-blur-2xl text-slate-100 rounded-3xl shadow-[0_25px_60px_-10px_rgba(6,182,212,0.35),0_0_40px_rgba(0,0,0,0.8)] border-2 border-cyan-500/60 flex flex-col overflow-hidden pointer-events-auto cursor-auto origin-bottom-left"
              onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when clicking inside widget
            >
              {/* Header: Midnight Cyan Brand Styling with Glowing Accent Line */}
              <div 
                className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 text-white p-3.5 px-4 flex items-center justify-between border-b border-cyan-500/30 cursor-grab active:cursor-grabbing"
              >
                {/* Neon Glow Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />

                <div className="flex items-center gap-3 pointer-events-none">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base font-black text-white tracking-wide">
                        {ASSISTANT_CONFIG.theme.botName}
                      </h3>
                    </div>
                    <p className="text-[11px] text-cyan-200/80 font-semibold mt-0.5">
                      {ASSISTANT_CONFIG.theme.roleTitle}
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-full bg-slate-800/80 hover:bg-cyan-500/30 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer pointer-events-auto"
                    title="סגור עוזר"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Tabs (4 Modules) - Vibrant Cyan/Gold Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-900/90 border-b border-cyan-500/20">
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
                      className={`py-2.5 px-1 text-center rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 relative ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-[1.02]'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-800'
                      }`}
                    >
                      {tab.icon}
                      <span className="text-[11px] leading-none tracking-tight">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-4 bg-slate-950/90 text-slate-100 custom-scrollbar">
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
              <div className="p-2.5 px-3.5 bg-slate-900 border-t border-cyan-500/20 text-center text-[10px] text-cyan-200/80 flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  100% Client-Side • פרטיות מלאה
                </span>
                <span className="text-cyan-400/90 font-mono tracking-wider">
                  Calc-E AutoFlow Engine
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
