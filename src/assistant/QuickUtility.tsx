import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Check, 
  ChevronLeft, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { EmotionalState } from './types';
import { ASSISTANT_CONFIG } from './assistantConfig';

interface QuickUtilityProps {
  onNavigate: (page: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'capabilities' | 'admin') => void;
  setEmotionalState: (state: EmotionalState) => void;
  onCloseWidget: () => void;
}

export const QuickUtility: React.FC<QuickUtilityProps> = ({
  onNavigate,
  setEmotionalState,
  onCloseWidget
}) => {
  const [selectedToolId, setSelectedToolId] = useState<string>('tool_combo');

  // Tool 1: Combo State
  const [selectedComboServices, setSelectedComboServices] = useState<string[]>(['cut', 'beard']);
  const [comboStartTime, setComboStartTime] = useState<string>('12:00');

  // Tool 2: Savings State
  const [visitsPerMonth, setVisitsPerMonth] = useState<number>(2);

  const COMBO_ITEMS = [
    { id: 'cut', title: 'תספורת גברים פרימיום', price: 150, duration: 45 },
    { id: 'beard', title: 'עיצוב זקן ומגבת חמה', price: 70, duration: 25 },
    { id: 'spa', title: 'חפיפה טיפולית ומסכה', price: 50, duration: 15 },
    { id: 'color', title: 'הסוואת שיער שיבה / טשטוש', price: 80, duration: 20 }
  ];

  const toggleComboService = (id: string) => {
    setSelectedComboServices(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      setEmotionalState('happy');
      setTimeout(() => setEmotionalState('idle'), 1000);
      return next;
    });
  };

  // Combo calculations
  const totalComboPrice = COMBO_ITEMS
    .filter(item => selectedComboServices.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const totalComboDuration = COMBO_ITEMS
    .filter(item => selectedComboServices.includes(item.id))
    .reduce((sum, item) => sum + item.duration, 0);

  // Calculate finish time
  const calculateEndTime = () => {
    if (!comboStartTime) return '--:--';
    const [h, m] = comboStartTime.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMinutes(date.getMinutes() + totalComboDuration);
    const endH = String(date.getHours()).padStart(2, '0');
    const endM = String(date.getMinutes()).padStart(2, '0');
    return `${endH}:${endM}`;
  };

  // Savings calculations
  const standardPrice = 150;
  const yearlyVisits = visitsPerMonth * 12;
  const regularYearlyCost = yearlyVisits * standardPrice;
  const vipYearlyCost = yearlyVisits * (standardPrice * 0.8);
  const yearlySavings = regularYearlyCost - vipYearlyCost;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-container rounded-xl border border-outline-variant/40">
        {ASSISTANT_CONFIG.quickTools.map(tool => {
          const isSelected = selectedToolId === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setSelectedToolId(tool.id);
                setEmotionalState('thinking');
                setTimeout(() => setEmotionalState('idle'), 800);
              }}
              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                isSelected
                  ? 'bg-secondary text-primary shadow-xs font-extrabold scale-[1.02]'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'
              }`}
            >
              {tool.type === 'combo' && <Scissors className="w-3.5 h-3.5" />}
              {tool.type === 'savings' && <DollarSign className="w-3.5 h-3.5" />}
              <span className="truncate w-full text-[11px] leading-tight">
                {tool.type === 'combo' ? 'שילוב שירותים' : 'חיסכון VIP'}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Tool 1: Combo Calculator */}
        {selectedToolId === 'tool_combo' && (
          <motion.div
            key="tool-combo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-2.5"
          >
            <div className="text-xs text-on-surface-variant">
              סמן שירותים מבוקשים לקבלת משך טיפול ועלות מדויקת בזמן אמת:
            </div>

            <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-0.5">
              {COMBO_ITEMS.map(item => {
                const checked = selectedComboServices.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleComboService(item.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      checked
                        ? 'border-secondary bg-secondary/15 text-on-surface font-bold'
                        : 'border-outline-variant/50 bg-surface-container-lowest text-on-surface hover:border-secondary/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        checked ? 'bg-secondary text-primary border-secondary' : 'border-outline-variant bg-surface'
                      }`}>
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant font-mono">
                      <span>{item.duration} דק'</span>
                      <span className="text-secondary-dark font-bold font-sans">₪{item.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Start Time Picker */}
            <div className="flex items-center justify-between bg-surface-container p-2.5 rounded-xl border border-outline-variant/40 text-xs">
              <label className="font-semibold text-on-surface">שעת התחלה משוערת:</label>
              <input
                type="time"
                value={comboStartTime}
                onChange={e => setComboStartTime(e.target.value)}
                className="bg-surface border border-outline-variant/60 rounded-lg px-2 py-1 text-xs text-on-surface font-mono outline-none focus:border-secondary"
              />
            </div>

            {/* Results Summary Box */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 border border-secondary/30 p-3 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-[11px] text-on-surface-variant">אומדן מחיר כולל</div>
                <div className="text-xl font-bold font-serif text-secondary-dark">₪{totalComboPrice}</div>
              </div>
              <div className="text-center border-x border-secondary/20 px-3">
                <div className="text-[11px] text-on-surface-variant">משך כולל</div>
                <div className="text-base font-bold text-on-surface">{totalComboDuration} דקות</div>
              </div>
              <div className="text-left">
                <div className="text-[11px] text-on-surface-variant">שעת סיום משוערת</div>
                <div className="text-base font-bold font-mono text-secondary-dark">{calculateEndTime()}</div>
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate('book');
                onCloseWidget();
              }}
              className="w-full bg-secondary text-primary font-bold text-xs py-2.5 rounded-xl hover:bg-secondary-dark hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>שריון משבצת משולבת ביומן השבועי</span>
            </button>
          </motion.div>
        )}

        {/* Tool 2: Savings Calculator */}
        {selectedToolId === 'tool_savings' && (
          <motion.div
            key="tool-savings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-3"
          >
            <div className="text-xs text-on-surface-variant">
              בדוק כמה תחסוך בשנה בהצטרפות למנוי חודשי או כרטיסיית תספורות:
            </div>

            <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/60">
              <div className="flex items-center justify-between text-xs font-bold text-on-surface mb-2">
                <span>תדירות ביקורים בחודש:</span>
                <span className="bg-secondary/20 text-secondary-dark px-2 py-0.5 rounded-md font-mono text-sm">
                  {visitsPerMonth} {visitsPerMonth === 1 ? 'ביקור' : 'ביקורים'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={visitsPerMonth}
                onChange={e => {
                  setVisitsPerMonth(Number(e.target.value));
                  setEmotionalState('happy');
                }}
                className="w-full accent-secondary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant mt-1 font-mono">
                <span>1 בחודש</span>
                <span>2 בחודש</span>
                <span>3 בחודש</span>
                <span>4 בחודש (שבועי)</span>
              </div>
            </div>

            {/* Savings Result Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/40 text-center">
                <div className="text-[11px] text-on-surface-variant">עלות רגילה לשנה</div>
                <div className="text-base font-bold text-on-surface-variant font-mono line-through mt-0.5">
                  ₪{regularYearlyCost}
                </div>
              </div>
              <div className="bg-amber-100/60 p-3 rounded-xl border border-amber-300/80 text-center">
                <div className="text-[11px] text-amber-950 font-bold">חיסכון שנתי משוער</div>
                <div className="text-xl font-extrabold text-secondary-dark font-mono mt-0.5">
                  ₪{yearlySavings} 🔥
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-[11px] text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>כרטיסיית VIP כוללת 20% הנחה קבועה, שטיפה חינם וקדימות בתורים.</span>
            </div>

            <button
              onClick={() => {
                onNavigate('capabilities');
                onCloseWidget();
              }}
              className="w-full bg-secondary text-primary font-bold text-xs py-2.5 rounded-xl hover:bg-secondary-dark hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>למד על מנויים ואוטומציות במרכז היכולות</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
