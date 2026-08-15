import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Clock, 
  Phone, 
  User, 
  Scissors, 
  Filter, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  CalendarDays, 
  ListFilter, 
  Sparkles,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Appointment, services } from './App';
import WeeklyCalendar from './WeeklyCalendar';
import { formatDateISO } from './utils/dateUtils';

interface AdminPageProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export default function AdminPage({ appointments, setAppointments }: AdminPageProps) {
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'today'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [filterService, setFilterService] = useState<string>('all');
  
  // Modal State for Quick Add / Edit / Details
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Form State for Manual Appointment
  const todayStr = formatDateISO();
  const [newApt, setNewApt] = useState({
    name: '',
    phone: '',
    service: services[0].id,
    date: todayStr,
    time: '12:00',
    status: 'confirmed' as 'pending' | 'confirmed' | 'completed'
  });

  const getServiceName = (id: string) => services.find(s => s.id === id)?.title || id;
  const getServicePrice = (id: string) => {
    const s = services.find(srv => srv.id === id || srv.title === id);
    if (!s) return 100;
    const num = parseInt(s.price.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 100 : num;
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
            ממתין לאישור
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-950 border border-amber-400 shadow-xs">
            <Check className="w-3.5 h-3.5 text-amber-700" />
            אושר
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            הושלם
          </span>
        );
      default:
        return null;
    }
  };

  // Actions
  const updateStatus = (id: string, newStatus: 'pending' | 'confirmed' | 'completed') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const deleteAppointment = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק/לבטל תור זה?')) {
      setAppointments(prev => prev.filter(a => a.id !== id));
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null);
      }
    }
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const isAlreadyTaken = appointments.some(a => a.date === newApt.date && a.time === newApt.time);
    if (isAlreadyTaken) {
      if (!confirm(`שים לב: כבר קיים תור בתאריך ${newApt.date.split('-').reverse().join('/')} בשעה ${newApt.time}. האם לשריין תור נוסף בשעה זו?`)) {
        return;
      }
    }
    const created: Appointment = {
      id: `manual-${Date.now()}`,
      name: newApt.name,
      phone: newApt.phone,
      service: newApt.service,
      date: newApt.date,
      time: newApt.time,
      status: newApt.status
    };
    setAppointments(prev => [...prev, created]);
    setIsAddModalOpen(false);
    setNewApt({
      name: '',
      phone: '',
      service: services[0].id,
      date: todayStr,
      time: '12:00',
      status: 'confirmed'
    });
  };

  const sendWhatsApp = (phone: string, name: string, date: string, time: string, serviceTitle: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? `972${cleanPhone.slice(1)}` : cleanPhone;
    const msg = encodeURIComponent(`שלום ${name}! תזכורת לתורך ב-LUMIÈRE לסלון עבור ${serviceTitle} בתאריך ${date} בשעה ${time}. נשמח לראותך! ✨`);
    window.open(`https://wa.me/${intlPhone}?text=${msg}`, '_blank');
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.phone.includes(searchQuery) ||
                          getServiceName(app.service).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const appServiceObj = services.find(s => s.id === app.service || s.title === app.service);
    const appServiceId = appServiceObj ? appServiceObj.id : app.service;
    const matchesService = filterService === 'all' || appServiceId === filterService || app.service === filterService;
    return matchesSearch && matchesStatus && matchesService;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.time}`).getTime() || 0;
    const timeB = new Date(`${b.date}T${b.time}`).getTime() || 0;
    return timeA - timeB;
  });

  const todayAppointments = sortedAppointments.filter(a => a.date === todayStr);

  // Analytics
  const totalRevenue = appointments
    .filter(a => a.status === 'completed' || a.status === 'confirmed')
    .reduce((sum, a) => sum + getServicePrice(a.service), 0);

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16 text-on-surface" dir="rtl">
      
      {/* Demo Admin Banner */}
      <div className="mb-8 bg-amber-100/95 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-950 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200/90 text-amber-900 flex items-center justify-center flex-shrink-0 border border-amber-300">
            <Sparkles className="w-5 h-5 text-amber-900" />
          </div>
          <div className="text-right">
            <h3 className="font-bold text-sm text-amber-950">דשבורד ניהול דמו אינטראקטיבי</h3>
            <p className="text-xs text-amber-900 mt-0.5 font-medium">
              כאן תוכלו לראות בזמן אמת כיצד כל תור שנקבע בכל אחד מממשקי ההזמנה באתר נכנס מיידית ליומן, משנה סטטוס ומסונכרן.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-200 text-xs font-bold border border-amber-400 text-amber-950 whitespace-nowrap shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          סביבת הדגמה פעילה
        </div>
      </div>

      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-outline-variant/40 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-on-surface font-bold">מערכת ניהול סלון</h1>
            <span className="bg-amber-100 text-amber-950 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-300">
              סביבת הדגמה (Demo)
            </span>
          </div>
          <p className="text-on-surface-variant text-sm mt-1">ניהול מלא, אישור וביטול תורים, צפייה ביומן והוספת תור ידני בזמן אמת.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-none bg-secondary text-primary px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            <Plus className="w-4 h-4" /> הוסף תור חדש
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant text-xs font-bold uppercase tracking-wider">
            <span>סה"כ תורים</span>
            <CalendarDays className="w-4 h-4 text-secondary-dark" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-on-surface">{appointments.length}</span>
            <span className="text-xs text-on-surface-variant">פעילים במערכת</span>
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-300 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span>ממתינים לאישור</span>
            <Clock className="w-4 h-4 text-amber-800" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-amber-950">{pendingCount}</span>
            <span className="text-xs text-amber-900 font-medium">דורשים טיפול</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-secondary/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary-dark text-xs font-bold uppercase tracking-wider">
            <span>תורים להיום</span>
            <Sparkles className="w-4 h-4 text-secondary-dark" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-secondary-dark">{todayAppointments.length}</span>
            <span className="text-xs text-on-surface-variant">{todayStr.split('-').reverse().join('/')}</span>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-300 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <span>הכנסה משוערת</span>
            <TrendingUp className="w-4 h-4 text-emerald-800" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-serif font-bold text-emerald-950">₪{totalRevenue}</span>
            <span className="text-xs text-emerald-900 font-medium">{completedCount} הושלמו</span>
          </div>
        </div>
      </div>

      {/* Navigation View Tabs & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/40">
        <div className="flex bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/40">
          <button 
            onClick={() => setViewMode('today')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              viewMode === 'today' ? 'bg-secondary text-primary shadow' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Clock className="w-4 h-4" /> תורים להיום ({todayAppointments.length})
          </button>
          <button 
            onClick={() => setViewMode('calendar')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              viewMode === 'calendar' ? 'bg-secondary text-primary shadow' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <CalendarIcon className="w-4 h-4" /> לוח שבועי
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              viewMode === 'list' ? 'bg-secondary text-primary shadow' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <ListFilter className="w-4 h-4" /> רשימה מלאה ({filteredAppointments.length})
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="חיפוש לפי שם / טלפון..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl pr-9 pl-3 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-secondary"
            />
          </div>

          <select 
            value={filterStatus}
            onChange={(e: any) => setFilterStatus(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-secondary cursor-pointer"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="pending">ממתין לאישור</option>
            <option value="confirmed">אושר</option>
            <option value="completed">הושלם</option>
          </select>
        </div>
      </div>

      {/* VIEW: TODAY SCHEDULE */}
      {viewMode === 'today' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              לוח הזמנים להיום ({todayStr.split('-').reverse().join('/')})
            </h2>
            <span className="text-xs text-on-surface-variant">{todayAppointments.length} לקוחות מתוכננים</span>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant/50">
              <CalendarDays className="w-12 h-12 text-secondary-dark/60 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-on-surface mb-1">אין תורים שנקבעו להיום</h3>
              <p className="text-xs text-on-surface-variant mb-4">תוכל להוסיף תור ידני או לצפות בכלל התורים ברשימה.</p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-secondary text-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> קבע תור עכשיו
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayAppointments.map(app => (
                <motion.div 
                  key={app.id} 
                  layout
                  className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/60 hover:border-secondary/60 transition-all flex flex-col justify-between gap-4 relative overflow-hidden group luxury-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold font-serif text-secondary-dark">{app.time}</span>
                        {getStatusBadge(app.status)}
                      </div>
                      <h3 className="text-lg font-bold text-on-surface mt-2">{app.name}</h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5 font-medium">
                        <Scissors className="w-3.5 h-3.5 text-secondary-dark" />
                        {getServiceName(app.service)}
                      </p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5 dir-ltr text-right font-medium">
                        <Phone className="w-3.5 h-3.5 text-secondary-dark" />
                        {app.phone}
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {app.status === 'pending' && (
                        <button 
                          onClick={() => updateStatus(app.id, 'confirmed')}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-amber-300"
                          title="אשר תור"
                        >
                          <Check className="w-3.5 h-3.5" /> אשר תור
                        </button>
                      )}
                      {app.status === 'confirmed' && (
                        <button 
                          onClick={() => updateStatus(app.id, 'completed')}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-emerald-300"
                          title="סמן כהושלם"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> סמן כהושלם
                        </button>
                      )}
                      {app.status === 'completed' && (
                        <button 
                          onClick={() => updateStatus(app.id, 'confirmed')}
                          className="bg-surface-container hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-outline-variant/50"
                          title="החזר לפעיל"
                        >
                          החזר לפעיל
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => sendWhatsApp(app.phone, app.name, app.date, app.time, getServiceName(app.service))}
                        className="p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-colors"
                        title="שלח תזכורת בוואטסאפ"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteAppointment(app.id)}
                        className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-colors"
                        title="בטל תור"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* VIEW: WEEKLY CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <WeeklyCalendar 
            appointments={appointments} 
            mode="admin" 
            onSelectSlot={(date, time) => {
              setNewApt(prev => ({ ...prev, date, time }));
              setIsAddModalOpen(true);
            }}
          />
        </motion.div>
      )}

      {/* VIEW: FULL APPOINTMENTS LIST */}
      {viewMode === 'list' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/40 text-on-surface-variant text-xs uppercase tracking-wider font-bold">
                  <th className="py-4 px-6">לקוח</th>
                  <th className="py-4 px-6">טלפון</th>
                  <th className="py-4 px-6">שירות</th>
                  <th className="py-4 px-6">תאריך ושעה</th>
                  <th className="py-4 px-6 text-center">סטטוס</th>
                  <th className="py-4 px-6 text-center">פעולות מהירות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                <AnimatePresence>
                  {sortedAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant text-sm">
                        לא נמצאו תורים התואמים לחיפוש/סינון.
                      </td>
                    </tr>
                  ) : (
                    sortedAppointments.map((app) => (
                      <motion.tr 
                        key={app.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-surface-container-low/60 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold text-on-surface flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary-dark flex items-center justify-center text-xs font-extrabold">
                            {app.name.charAt(0)}
                          </div>
                          {app.name}
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant text-sm dir-ltr text-right font-medium">
                          {app.phone}
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant text-sm font-medium">
                          {getServiceName(app.service)}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface">{app.date.split('-').reverse().join('/')}</span>
                            <span className="text-xs text-secondary-dark font-mono font-bold">{app.time}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button 
                            onClick={() => {
                              const next = app.status === 'pending' ? 'confirmed' : app.status === 'confirmed' ? 'completed' : 'pending';
                              updateStatus(app.id, next);
                            }}
                            className="cursor-pointer hover:scale-105 transition-transform"
                            title="לחץ לשינוי סטטוס"
                          >
                            {getStatusBadge(app.status)}
                          </button>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => sendWhatsApp(app.phone, app.name, app.date, app.time, getServiceName(app.service))}
                              className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-colors"
                              title="שלח וואטסאפ ללקוח"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteAppointment(app.id)}
                              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-colors"
                              title="מחק / בטל תור"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* MODAL: ADD MANUAL APPOINTMENT */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-secondary/40 luxury-shadow relative overflow-hidden text-on-surface"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-serif text-on-surface flex items-center gap-2">
                  <Plus className="w-5 h-5 text-secondary-dark" /> קביעת תור ידנית (אדמין)
                </h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface text-lg font-bold p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                    שם הלקוח
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="ישראל ישראלי"
                    value={newApt.name}
                    onChange={e => setNewApt({...newApt, name: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                    טלפון נייד
                  </label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="050-0000000"
                    value={newApt.phone}
                    onChange={e => setNewApt({...newApt, phone: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-secondary dir-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                    סוג השירות
                  </label>
                  <select 
                    value={newApt.service}
                    onChange={e => setNewApt({...newApt, service: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.title} ({s.price})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                      תאריך
                    </label>
                    <input 
                      type="date" 
                      required 
                      value={newApt.date}
                      onChange={e => setNewApt({...newApt, date: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                      שעה
                    </label>
                    <input 
                      type="time" 
                      required 
                      value={newApt.time}
                      onChange={e => setNewApt({...newApt, time: e.target.value})}
                      className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">
                    סטטוס התחלתי
                  </label>
                  <select 
                    value={newApt.status}
                    onChange={(e: any) => setNewApt({...newApt, status: e.target.value})}
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="confirmed">מאושר (ברירת מחדל לאדמין)</option>
                    <option value="pending">ממתין לאישור</option>
                    <option value="completed">הושלם</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 bg-surface-container hover:bg-surface-container-high py-3 rounded-xl text-sm font-bold text-on-surface transition-colors border border-outline-variant/50"
                  >
                    ביטול
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-secondary text-primary py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  >
                    שמור תור
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
