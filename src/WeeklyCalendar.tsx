import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Appointment, services } from './App';
import { formatDateISO, isSlotInPast } from './utils/dateUtils';

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const WEEK_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

interface WeeklyCalendarProps {
  appointments: Appointment[];
  mode?: 'client' | 'admin';
  selectedDate?: string;
  selectedTime?: string;
  onSelectSlot?: (date: string, time: string) => void;
}

export default function WeeklyCalendar({ 
  appointments, 
  mode = 'client', 
  selectedDate, 
  selectedTime, 
  onSelectSlot 
}: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); // 0 is Sunday
    d.setDate(d.getDate() - day);
    return d;
  });

  const [mobileSelectedDate, setMobileSelectedDate] = useState<string>('');

  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const prevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };

  const weekDates = WEEK_DAYS.map((name, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    const dateStr = formatDateISO(d);
    return { name, dateStr, dayObj: d };
  });

  // Set initial mobile selected date or update when week changes
  useEffect(() => {
    const todayStr = formatDateISO();
    const isTodayInWeek = weekDates.some(d => d.dateStr === todayStr);
    if (isTodayInWeek) {
      setMobileSelectedDate(todayStr);
    } else {
      setMobileSelectedDate(weekDates[0].dateStr);
    }
  }, [currentWeekStart]);

  const getAppointmentsForSlot = (dateStr: string, hour: number) => {
    return appointments.filter((a: any) => {
      if (a.date !== dateStr) return false;
      const h = parseInt(a.time.split(':')[0], 10);
      return h === hour;
    });
  };

  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-2xl luxury-shadow border border-outline-variant/30 overflow-hidden w-full" dir="rtl">
      <div className="flex justify-between items-center p-4 bg-surface border-b border-outline-variant/30">
        <button type="button" onClick={prevWeek} className="p-2 bg-surface-container hover:bg-surface-variant rounded-full transition-colors text-on-surface">
          <ChevronRight className="w-5 h-5"/>
        </button>
        <div className="font-bold text-on-surface font-serif text-lg">
          {weekDates[0].dateStr.split('-').reverse().join('/')} - {weekDates[5].dateStr.split('-').reverse().join('/')}
        </div>
        <button type="button" onClick={nextWeek} className="p-2 bg-surface-container hover:bg-surface-variant rounded-full transition-colors text-on-surface">
          <ChevronRight className="w-5 h-5 rotate-180"/>
        </button>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:block overflow-x-auto hide-scrollbar">
        <div className="min-w-[800px] grid grid-cols-[80px_repeat(6,1fr)]" style={{ gridTemplateRows: `auto repeat(${HOURS.length}, minmax(80px, auto))` }}>
          <div className="bg-surface/50 p-3 text-center border-b border-l border-outline-variant/30"></div>
          {weekDates.map((day) => (
            <div key={day.dateStr} className="bg-surface/50 p-3 text-center border-b border-l border-outline-variant/30">
              <div className="font-bold text-sm text-on-surface">{day.name}</div>
              <div className="text-xs text-on-surface-variant mt-1">{day.dateStr.split('-').reverse().slice(0,2).join('/')}</div>
            </div>
          ))}

          {HOURS.map((hour, hIdx) => (
            <React.Fragment key={hour}>
              <div 
                className="text-xs text-on-surface-variant p-2 border-b border-l border-outline-variant/30 text-center font-bold flex items-center justify-center bg-surface/30"
                style={{ gridRow: hIdx + 2, gridColumn: 1 }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>

              {weekDates.map((day, dIdx) => {
                const slotApps = getAppointmentsForSlot(day.dateStr, hour);
                const isBooked = slotApps.length > 0;
                const isSelected = selectedDate === day.dateStr && selectedTime === `${hour.toString().padStart(2, '0')}:00`;
                const isPast = isSlotInPast(day.dateStr, hour);

                if (mode === 'admin') {
                  return (
                    <div 
                      key={`${day.dateStr}-${hour}`}
                      onClick={() => onSelectSlot && onSelectSlot(day.dateStr, `${hour.toString().padStart(2, '0')}:00`)}
                      className="border-b border-l border-outline-variant/30 relative bg-surface/10 p-1 flex flex-col gap-1 cursor-pointer hover:bg-secondary/10 transition-colors min-h-[70px]"
                      style={{ gridRow: hIdx + 2, gridColumn: dIdx + 2 }}
                    >
                      {slotApps.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-[10px] text-secondary-dark font-bold">
                          + הוסף תור
                        </div>
                      ) : (
                        slotApps.map((app: any) => (
                          <div 
                            key={app.id} 
                            className={`p-2 rounded text-xs shadow-sm border transition-all hover:scale-[1.02] ${
                              app.status === 'confirmed' 
                                ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold' 
                                : app.status === 'completed' 
                                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold' 
                                  : 'bg-amber-50 border-amber-200 text-amber-900 font-bold'
                            }`}
                          >
                            <div className="font-bold truncate">{app.name}</div>
                            <div className="text-[10px] opacity-90 truncate">
                              {services.find(s => s.id === app.service || s.title === app.service)?.title || app.service} | {app.time}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div 
                      key={`${day.dateStr}-${hour}`}
                      onClick={() => !isBooked && !isPast && onSelectSlot && onSelectSlot(day.dateStr, `${hour.toString().padStart(2, '0')}:00`)}
                      className={`border-b border-l border-outline-variant/30 relative p-2 transition-all duration-300 flex items-center justify-center text-sm
                        ${isBooked || isPast ? 'bg-surface-variant/30 cursor-not-allowed text-on-surface-variant/40' : 
                          isSelected ? 'bg-secondary text-primary font-bold shadow-[inset_0_0_0_2px_#121212] cursor-pointer scale-[0.98]' : 'hover:bg-secondary/20 bg-surface-container-lowest text-on-surface-variant hover:text-on-surface cursor-pointer'}
                      `}
                      style={{ gridRow: hIdx + 2, gridColumn: dIdx + 2 }}
                    >
                      {isBooked ? 'תפוס' : isPast ? 'עבר' : isSelected ? 'נבחר' : 'פנוי'}
                    </div>
                  );
                }
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden flex flex-col">
        {/* Mobile Days Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-outline-variant/30 bg-surface-container-low px-2 py-3 gap-2 snap-x">
          {weekDates.map(day => (
            <button
              key={day.dateStr}
              onClick={() => setMobileSelectedDate(day.dateStr)}
              className={`snap-center flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-xl border transition-all ${
                mobileSelectedDate === day.dateStr
                  ? 'border-secondary bg-secondary/15 text-secondary-dark font-extrabold shadow-sm scale-105'
                  : 'border-outline-variant/50 text-on-surface hover:border-secondary/50 bg-surface-container-lowest'
              }`}
            >
              <span className="font-bold text-sm">{day.name}</span>
              <span className="text-xs mt-1 text-on-surface-variant">{day.dateStr.split('-').reverse().slice(0,2).join('/')}</span>
            </button>
          ))}
        </div>

        {/* Mobile Hours List */}
        <div className="p-4 flex flex-col gap-3">
          {mobileSelectedDate && HOURS.map(hour => {
            const slotApps = getAppointmentsForSlot(mobileSelectedDate, hour);
            const isBooked = slotApps.length > 0;
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            const isSelected = selectedDate === mobileSelectedDate && selectedTime === timeStr;
            const isPast = isSlotInPast(mobileSelectedDate, hour);

            if (mode === 'admin') {
              return (
                <div 
                  key={hour} 
                  onClick={() => onSelectSlot && onSelectSlot(mobileSelectedDate, timeStr)}
                  className="flex gap-4 border border-outline-variant/40 rounded-xl p-3 bg-surface-container-low hover:border-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="w-16 flex-shrink-0 flex items-center justify-center border-l border-outline-variant/30 font-bold text-lg text-secondary-dark">
                    {timeStr}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    {slotApps.length === 0 && (
                      <span className="text-on-surface-variant text-sm italic my-auto flex items-center justify-between">
                        פנוי (לחץ להוספת תור) <span className="text-xs text-secondary-dark font-bold">+</span>
                      </span>
                    )}
                    {slotApps.map((app: any) => (
                      <div 
                        key={app.id} 
                        className={`p-3 rounded-lg text-sm shadow-sm border ${
                          app.status === 'confirmed' 
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold' 
                            : app.status === 'completed' 
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-950 font-bold' 
                              : 'bg-amber-50 border-amber-200 text-amber-900 font-bold'
                        }`}
                      >
                        <div className="font-bold mb-1 text-base">{app.name}</div>
                        <div className="flex items-center justify-between opacity-90 text-xs">
                          <span>{services.find(s => s.id === app.service || s.title === app.service)?.title || app.service}</span>
                          <span className="dir-ltr">{app.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else {
              // User Booking Mode
              return (
                <button
                  key={hour}
                  disabled={isBooked || isPast}
                  onClick={() => onSelectSlot && onSelectSlot(mobileSelectedDate, timeStr)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isBooked || isPast 
                      ? 'border-outline-variant/30 bg-surface-variant/20 text-on-surface-variant/40 cursor-not-allowed'
                      : isSelected
                        ? 'border-secondary bg-secondary text-primary font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'border-outline-variant/50 bg-surface-container-low text-on-surface hover:border-secondary/50 hover:bg-surface-container'
                  }`}
                >
                  <span className="font-bold text-xl">{timeStr}</span>
                  <span className="text-sm font-medium">
                    {isBooked ? 'תפוס' : isPast ? 'עבר' : isSelected ? 'נבחר' : 'הזמן עכשיו'}
                  </span>
                </button>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
