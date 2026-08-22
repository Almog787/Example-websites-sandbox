import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  DollarSign, 
  Percent, 
  Clock, 
  Sparkles, 
  Check, 
  CheckCircle2,
  Calendar,
  Tag
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

  // Tool 3: Quote & Discount State
  const [basePrice, setBasePrice] = useState<number>(180);
  const [discountPercent, setDiscountPercent] = useState<number>(15);

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

  // Quote calculations
  const calculatedDiscountAmount = Math.round((basePrice * discountPercent) / 100);
  const finalDiscountedPrice = basePrice - calculatedDiscountAmount;

  return (
    <div className="flex flex-col h-full gap-3 text-slate-100">
      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
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
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tool.type === 'combo' && <Scissors className="w-3.5 h-3.5" />}
              {tool.type === 'savings' && <DollarSign className="w-3.5 h-3.5" />}
              {tool.type === 'quote' && <Percent className="w-3.5 h-3.5" />}
              <span className="truncate w-full text-[11px] font-extrabold leading-tight">
                {tool.type === 'combo' ? 'שילוב' : tool.type === 'savings' ? 'חיסכון VIP' : 'הנחה'}
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
            <div className="text-xs text-slate-300 font-medium">
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
                        ? 'border-cyan-400 bg-cyan-950/60 text-white font-bold'
                        : 'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        checked ? 'bg-cyan-400 text-slate-950 border-cyan-400' : 'border-slate-700 bg-slate-950'
                      }`}>
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="font-bold">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400 text-[11px]">{item.duration} דק'</span>
                      <span className="text-amber-300 font-bold font-sans">₪{item.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Start Time Picker */}
            <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
              <label className="font-bold text-slate-200">שעת התחלה משוערת:</label>
              <input
                type="time"
                value={comboStartTime}
                onChange={e => setComboStartTime(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-mono font-bold outline-none focus:border-cyan-400"
              />
            </div>

            {/* Results Summary Box */}
            <div className="bg-slate-900 border-2 border-cyan-400 p-3 rounded-2xl flex items-center justify-between shadow-md">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">אומדן מחיר כולל</div>
                <div className="text-xl font-bold font-serif text-amber-300">₪{totalComboPrice}</div>
              </div>
              <div className="text-center border-x border-slate-800 px-3">
                <div className="text-[11px] text-slate-400 font-medium">משך כולל</div>
                <div className="text-base font-bold text-white">{totalComboDuration} דקות</div>
              </div>
              <div className="text-left">
                <div className="text-[11px] text-slate-400 font-medium">שעת סיום משוערת</div>
                <div className="text-base font-bold font-mono text-cyan-300">{calculateEndTime()}</div>
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate('book');
                onCloseWidget();
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs py-2.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
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
            <div className="text-xs text-slate-300 font-medium">
              בדוק כמה תחסוך בשנה בהצטרפות למנוי חודשי או כרטיסיית תספורות:
            </div>

            <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-100 mb-2">
                <span>תדירות ביקורים בחודש:</span>
                <span className="bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-md font-mono text-sm border border-cyan-400/40">
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
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono font-bold">
                <span>1 בחודש</span>
                <span>2 בחודש</span>
                <span>3 בחודש</span>
                <span>4 בחודש (שבועי)</span>
              </div>
            </div>

            {/* Savings Result Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 font-medium">עלות רגילה לשנה</div>
                <div className="text-base font-bold text-slate-400 font-mono line-through mt-0.5">
                  ₪{regularYearlyCost}
                </div>
              </div>
              <div className="bg-amber-950/60 p-3 rounded-xl border border-amber-400/60 text-center">
                <div className="text-[11px] text-amber-300 font-bold">חיסכון שנתי משוער</div>
                <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                  ₪{yearlySavings} 🔥
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-400/60 p-2.5 rounded-xl text-[11px] text-emerald-200 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>כרטיסיית VIP כוללת 20% הנחה קבועה, שטיפה חינם וקדימות בתורים.</span>
            </div>

            <button
              onClick={() => {
                onNavigate('capabilities');
                onCloseWidget();
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs py-2.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>למד על מנויים ואוטומציות במרכז היכולות</span>
            </button>
          </motion.div>
        )}

        {/* Tool 3: Quote & Discount Calculator */}
        {selectedToolId === 'tool_quote' && (
          <motion.div
            key="tool-quote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-3"
          >
            <div className="text-xs text-slate-300 font-medium">
              חשב הצעת מחיר מהירה כולל אחוזי הנחה, קופוני מועדון או הטבת ביקור ראשון:
            </div>

            <div className="space-y-2.5 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              {/* Base Price input */}
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200">מחיר בסיס לחבילה (₪):</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={e => {
                    setBasePrice(Math.max(0, Number(e.target.value)));
                    setEmotionalState('happy');
                  }}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono font-black text-left outline-none focus:border-cyan-400"
                />
              </div>

              {/* Discount Percentage slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-1">
                  <span>אחוז הנחה / קופון:</span>
                  <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono border border-amber-400/40 font-bold">
                    {discountPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={discountPercent}
                  onChange={e => {
                    setDiscountPercent(Number(e.target.value));
                    setEmotionalState('happy');
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Discount Summary Card */}
            <div className="bg-slate-900 border-2 border-cyan-400 p-3 rounded-2xl flex items-center justify-between shadow-md">
              <div>
                <div className="text-[11px] text-slate-400 font-medium">סכום ההנחה</div>
                <div className="text-base font-bold text-amber-300 font-mono">-₪{calculatedDiscountAmount}</div>
              </div>
              <div className="text-left border-r border-slate-800 pr-3">
                <div className="text-[11px] text-slate-300 font-bold">מחיר סופי לאחר הנחה</div>
                <div className="text-2xl font-black text-cyan-300 font-serif">₪{finalDiscountedPrice}</div>
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate('book-minimal');
                onCloseWidget();
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs py-2.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Tag className="w-4 h-4" />
              <span>הזמן עכשיו במחיר המוזל ב-3 קליקים</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
