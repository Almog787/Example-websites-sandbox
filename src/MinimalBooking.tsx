import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { formatDateISO } from './utils/dateUtils';

const servicesList = [
  { id: '1', title: 'תספורת קלאסית', price: '₪120', duration: '45 דקות' },
  { id: '2', title: 'עיצוב זקן', price: '₪80', duration: '30 דקות' },
  { id: '3', title: 'תספורת פרימיום + זקן', price: '₪180', duration: '75 דקות' },
  { id: '4', title: 'טיפול פנים וניקוי', price: '₪150', duration: '45 דקות' }
];

const generateDates = () => {
  const dates = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      date: d,
      dayName: d.toLocaleDateString('he-IL', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('he-IL', { month: 'short' })
    });
  }
  return dates;
};

const ALL_TIMES = ['09:00', '10:00', '10:30', '11:00', '11:30', '13:00', '14:00', '15:00', '15:30', '16:30', '17:00', '18:00', '19:30'];

export default function MinimalBooking({ appointments, onAddAppointment, onNavigate }: { appointments: any[], onAddAppointment: (apt: any) => void, onNavigate: (page: string) => void }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<any>({
    service: '',
    date: null,
    time: '',
    name: '',
    phone: ''
  });

  const dates = generateDates();

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAppointment({
      ...bookingData,
      date: formatDateISO(bookingData.date),
      status: 'pending'
    });
    setStep(4);
  };

  const getAvailableTimes = () => {
    if (!bookingData.date) return [];
    const dateStr = formatDateISO(bookingData.date);
    const taken = appointments.filter((a: any) => a.date === dateStr).map((a: any) => a.time);
    return ALL_TIMES.filter(t => !taken.includes(t));
  };
  const availableTimes = getAvailableTimes();

  return (
    <div className="flex-1 w-full bg-surface text-on-surface flex flex-col justify-center min-h-screen relative overflow-hidden pt-20">
      
      {/* Progress Bar */}
      <div className="absolute top-24 left-0 right-0 h-1 bg-surface-container">
        <motion.div 
          className="h-full bg-secondary"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="max-w-4xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300 mb-3 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  סביבת הדגמה מינימליסטית
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-on-surface font-bold">בחר שירות</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicesList.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => {
                      setBookingData({ ...bookingData, service: srv.title });
                      handleNext();
                    }}
                    className="p-8 border border-outline-variant/60 bg-surface-container-lowest rounded-2xl hover:border-secondary hover:bg-surface-container-low transition-all text-right group luxury-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-2xl font-bold text-on-surface group-hover:text-secondary-dark transition-colors">{srv.title}</h3>
                      <span className="text-secondary-dark font-extrabold text-xl">{srv.price}</span>
                    </div>
                    <p className="text-on-surface-variant font-medium">{srv.duration}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full"
            >
              <div className="mb-12 flex items-center justify-between">
                <h2 className="text-4xl md:text-5xl font-serif text-on-surface font-bold">מתי נח לך?</h2>
                <button onClick={handleBack} className="text-secondary-dark font-bold hover:text-on-surface flex items-center gap-1"><ChevronLeft size={20}/> חזור</button>
              </div>
              
              <div className="mb-12">
                <h3 className="text-xl mb-6 text-on-surface font-semibold">תאריך</h3>
                <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x">
                  {dates.map((d, idx) => (
                    <button
                      key={idx}
                      onClick={() => setBookingData({ ...bookingData, date: d.date, time: '' })}
                      className={`snap-center flex-shrink-0 w-24 h-32 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        bookingData.date === d.date 
                          ? 'border-secondary bg-secondary/15 text-secondary-dark font-bold shadow-md scale-105' 
                          : 'border-outline-variant/60 bg-surface-container-lowest hover:border-secondary/50 text-on-surface'
                      }`}
                    >
                      <span className="text-sm font-medium opacity-80">{d.month}</span>
                      <span className="text-3xl font-bold">{d.dayNumber}</span>
                      <span className="text-sm font-medium opacity-80">{d.dayName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {bookingData.date && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 className="text-xl mb-6 text-on-surface font-semibold">שעה</h3>
                    <div className="flex flex-wrap gap-4">
                      {availableTimes.length === 0 && <p className="text-on-surface-variant font-medium">אין שעות פנויות ביום זה.</p>}
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setBookingData({ ...bookingData, time });
                            handleNext();
                          }}
                          className={`px-8 py-4 rounded-xl border text-lg font-bold transition-all ${
                            bookingData.time === time 
                              ? 'border-secondary bg-secondary text-primary shadow-md' 
                              : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:border-secondary/60 hover:bg-surface-container-low'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-xl mx-auto"
            >
              <div className="mb-12 flex items-center justify-between">
                <h2 className="text-4xl md:text-5xl font-serif text-on-surface font-bold">פרטים אחרונים</h2>
                <button onClick={handleBack} className="text-secondary-dark font-bold hover:text-on-surface flex items-center gap-1"><ChevronLeft size={20}/> חזור</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/50 luxury-shadow">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-on-surface">שם מלא</label>
                  <input 
                    type="text" 
                    required
                    value={bookingData.name}
                    onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-lg text-on-surface outline-none focus:border-secondary transition-colors"
                    placeholder="הכנס שם כאן..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-on-surface">טלפון</label>
                  <input 
                    type="tel" 
                    required
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-3 text-lg text-on-surface outline-none focus:border-secondary transition-colors dir-ltr text-right"
                    placeholder="050-0000000"
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="w-full sm:w-auto bg-secondary text-primary px-12 py-4 rounded-xl text-base font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-[0_0_25px_rgba(212,175,55,0.35)]">
                    אשר הזמנה
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full text-center flex flex-col items-center py-6 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/50 luxury-shadow max-w-xl mx-auto"
            >
              <div className="w-20 h-20 bg-secondary text-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle2 size={42} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300 mb-4 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                הזמנת דמו נקלטה בהצלחה
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-on-surface font-bold mb-4">התור אושר בהצלחה!</h2>
              <p className="text-base text-on-surface-variant mb-6 max-w-md mx-auto font-medium">
                {bookingData.name}, התור נקבע לתאריך <strong className="text-secondary-dark font-bold">{bookingData.date ? bookingData.date.toLocaleDateString('he-IL') : ''}</strong> בשעה <strong className="text-secondary-dark font-bold">{bookingData.time}</strong>.
              </p>

              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/50 mb-8 text-xs text-on-surface-variant max-w-md w-full text-right font-medium">
                💡 <strong>רוצים לראות את התור?</strong> היכנסו ל<strong>אזור המנהל</strong> ותראו אותו מופיע מיידית ומסונכרן!
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <button onClick={() => onNavigate('admin')} className="bg-secondary text-primary px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  צפה בתור באזור מנהל
                </button>
                <button onClick={() => onNavigate('home')} className="border border-outline-variant/60 text-on-surface hover:bg-surface-container-low px-8 py-3.5 rounded-xl font-medium text-sm transition-all">
                  חזרה לראשי
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
