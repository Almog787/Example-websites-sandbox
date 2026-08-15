import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Calendar, Clock, Scissors, Phone, CheckCircle2, Bot } from 'lucide-react';
import { formatDateISO } from './utils/dateUtils';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  type?: 'service' | 'date' | 'time' | 'name' | 'phone' | 'confirm';
}

const services = ['תספורת פרימיום', 'עיצוב זקן ומגבות חמות', 'טיפול פנים קלאסי', 'חבילת חתן'];
const ALL_TIMES = ['09:00', '10:00', '10:30', '11:00', '11:30', '13:00', '14:00', '15:00', '15:30', '16:30', '17:00', '18:00', '19:30'];

export default function ChatBooking({ appointments, onAddAppointment, onNavigate }: { appointments: any[], onAddAppointment: (apt: any) => void, onNavigate: (page: string) => void }) {
  
  const generateDates = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i); // Starting from today
      return {
        label: d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'short' }),
        value: formatDateISO(d)
      };
    });
  };
  const dateOptions = generateDates();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'ברוכים הבאים ל-Lumière! אני כאן כדי לעזור לכם לקבוע תור בקלות. איזה שירות תרצו לקבוע?',
      options: services,
      type: 'service'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [bookingData, setBookingData] = useState<any>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleOptionClick = (optionLabel: string, type?: string) => {
    // Add user message
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: optionLabel }]);
    
    // Process and add bot response
    setTimeout(() => {
      let nextMsg: ChatMessage;
      
      if (type === 'service') {
        setBookingData((prev: any) => ({ ...prev, service: optionLabel }));
        nextMsg = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `מעולה, ${optionLabel} זו בחירה מצוינת! באיזה תאריך תרצו להגיע?`,
          options: dateOptions.map(d => d.label),
          type: 'date'
        };
      } else if (type === 'date') {
        const selectedDate = dateOptions.find(d => d.label === optionLabel)?.value || optionLabel;
        setBookingData((prev: any) => ({ ...prev, date: selectedDate }));
        
        // Calculate available times for this date
        const taken = appointments.filter(a => a.date === selectedDate).map(a => a.time);
        const freeTimes = ALL_TIMES.filter(t => !taken.includes(t));
        
        if (freeTimes.length > 0) {
          nextMsg = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `מצוין. אלו השעות הפנויות. מתי נוח לכם?`,
            options: freeTimes,
            type: 'time'
          };
        } else {
          nextMsg = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `אוי, נראה שאין שעות פנויות ביום הזה. אנא בחרו תאריך אחר:`,
            options: dateOptions.map(d => d.label),
            type: 'date'
          };
        }
      } else if (type === 'time') {
        setBookingData((prev: any) => ({ ...prev, time: optionLabel }));
        nextMsg = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `מעולה. כדי שאוכל לרשום את התור, מה השם המלא שלכם?`,
          type: 'name'
        };
      }
      setMessages(prev => [...prev, nextMsg!]);
    }, 600);
  };

  const handleSendText = () => {
    const text = inputValue.trim();
    if (!text) return;
    
    const lastBotMessage = messages.slice().reverse().find(m => m.sender === 'bot');
    const type = lastBotMessage?.type;

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text }]);
    setInputValue('');
    
    setTimeout(() => {
      let nextMsg: ChatMessage;

      if (type === 'service') {
        const matchedService = services.find(s => s.toLowerCase().includes(text.toLowerCase())) || text;
        setBookingData((prev: any) => ({ ...prev, service: matchedService }));
        nextMsg = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `מעולה, ${matchedService} זו בחירה מצוינת! באיזה תאריך תרצו להגיע?`,
          options: dateOptions.map(d => d.label),
          type: 'date'
        };
      } else if (type === 'date') {
        const matchedDateObj = dateOptions.find(d => d.label.includes(text) || d.value.includes(text));
        const selectedDate = matchedDateObj ? matchedDateObj.value : dateOptions[0].value;
        setBookingData((prev: any) => ({ ...prev, date: selectedDate }));

        const taken = appointments.filter(a => a.date === selectedDate).map(a => a.time);
        const freeTimes = ALL_TIMES.filter(t => !taken.includes(t));

        if (freeTimes.length > 0) {
          nextMsg = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `מצוין. אלו השעות הפנויות לתאריך ${selectedDate.split('-').reverse().join('/')}. מתי נוח לכם?`,
            options: freeTimes,
            type: 'time'
          };
        } else {
          nextMsg = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `נראה שאין שעות פנויות ביום הזה. אנא בחרו תאריך אחר:`,
            options: dateOptions.map(d => d.label),
            type: 'date'
          };
        }
      } else if (type === 'time') {
        const matchedTime = ALL_TIMES.find(t => t.includes(text)) || text;
        setBookingData((prev: any) => ({ ...prev, time: matchedTime }));
        nextMsg = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `מעולה. כדי שאוכל לרשום את התור, מה השם המלא שלכם?`,
          type: 'name'
        };
      } else if (type === 'name') {
        setBookingData((prev: any) => ({ ...prev, name: text }));
        nextMsg = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `נעים מאוד ${text}! מה מספר הטלפון שלכם לחזרה ותזכורת?`,
          type: 'phone'
        };
      } else if (type === 'phone') {
        setBookingData((prev: any) => {
          const newData = { ...prev, phone: text };
          onAddAppointment({
            name: newData.name,
            phone: newData.phone,
            service: newData.service || services[0],
            date: newData.date || dateOptions[0].value,
            time: newData.time || '12:00',
            status: 'pending'
          });
          return newData;
        });
        
        nextMsg = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `תודה רבה ${text}! התור נקבע בהצלחה ומסונכרן כעת לכל המערכות. נתראה! ✨`,
          type: 'confirm'
        };
      } else {
        nextMsg = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `התור כבר נרשם! לחץ על כפתור ההזמנות או פנה לאזור המנהל כדי לצפות בו.`,
          type: 'confirm'
        };
      }

      setMessages(prev => [...prev, nextMsg]);
    }, 600);
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col pt-24 pb-8 px-4 max-w-3xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-lowest rounded-3xl luxury-shadow flex-1 flex flex-col overflow-hidden border border-outline-variant/60 relative"
      >
        <div className="bg-surface-container-low p-4 flex items-center gap-4 border-b border-outline-variant/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary text-primary rounded-full flex items-center justify-center font-bold shadow-sm">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">Lumière Booking Bot</h3>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> בוט תורים פעיל
              </p>
            </div>
          </div>
          <div className="mr-auto inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            סביבת הדגמה
          </div>
        </div>

        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 custom-scrollbar bg-surface-container/30">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-secondary text-primary rounded-br-sm font-semibold' 
                    : 'bg-surface-container-lowest text-on-surface border border-outline-variant/50 rounded-bl-sm'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  
                  {msg.options && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {msg.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt, msg.type)}
                          className="px-4 py-2 bg-surface-container-low hover:bg-secondary hover:text-primary text-on-surface text-sm rounded-full border border-outline-variant/60 hover:border-secondary transition-all text-right font-medium shadow-xs"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.type === 'confirm' && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                       <button onClick={() => onNavigate('admin')} className="px-5 py-2.5 bg-secondary text-primary rounded-xl font-bold uppercase text-xs sm:text-sm tracking-wider hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]">צפה בתור באזור מנהל</button>
                       <button onClick={() => onNavigate('home')} className="px-5 py-2.5 bg-surface-container-low text-on-surface border border-outline-variant/60 rounded-xl font-medium text-xs sm:text-sm hover:bg-surface-container transition-colors">חזרה לעמוד הראשי</button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-surface-container-low border-t border-outline-variant/40">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="הקלידו הודעה..."
              className="w-full bg-surface-container-lowest rounded-full pl-14 pr-6 py-4 text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary/50 border border-outline-variant/50 transition-all shadow-inner"
            />
            <button
              onClick={handleSendText}
              disabled={!inputValue.trim()}
              className="absolute left-2 w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center disabled:opacity-40 disabled:bg-surface-container-high disabled:text-on-surface-variant transition-colors shadow-sm"
            >
              <Send size={18} className="mr-1" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
