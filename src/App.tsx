import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Calendar, Clock, Scissors, Phone, User, CheckCircle2, ChevronRight, Menu, X, Star, ArrowLeft, Sparkles } from 'lucide-react';
import ChatBooking from './ChatBooking';
import MinimalBooking from './MinimalBooking';
import AdminPage from './AdminPage';
import WeeklyCalendar from './WeeklyCalendar';
import CapabilitiesPage from './CapabilitiesPage';
import { formatDateISO } from './utils/dateUtils';

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
}

const pageVariants = {
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  out: { opacity: 0, y: -30, filter: 'blur(8px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-secondary origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

const getMockData = (): Appointment[] => {
  const mock: Appointment[] = [];
  const today = new Date();
  const names = ['דניאל כהן', 'אביב לוי', 'מיכאל שוורץ', 'יותם אברהם', 'רון אלבז', 'גיא עמר', 'תומר דיין', 'ליאור בר', 'שגיא כהן'];
  const services = ['תספורת פרימיום', 'עיצוב זקן ומגבות חמות', 'טיפול פנים קלאסי', 'חבילת חתן'];
  const times = ['09:00', '10:30', '11:00', '14:00', '15:30', '17:00', '18:00', '19:30'];
  
  for(let i=0; i<9; i++) {
    const d = new Date(today);
    // Force more appointments for "today" (i % 3 === 0 or i % 3 === 1)
    if (i > 4) d.setDate(today.getDate() + 1); // Tomorrow
    else if (i === 4) d.setDate(today.getDate() + 2); // Day after
    // else today
    
    mock.push({
      id: `mock-${i}`,
      name: names[i],
      phone: `050-123456${i}`,
      service: services[i % services.length],
      date: formatDateISO(d),
      time: times[i],
      status: i < 2 ? 'completed' : (i < 5 ? 'confirmed' : 'pending')
    });
  }
  return mock;
};

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'admin' | 'capabilities'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  
  // Storage State
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('lumiere_appointments');
      const parsed = saved ? JSON.parse(saved) : [];
      if (parsed.length === 0) {
        const initialMock = getMockData();
        localStorage.setItem('lumiere_appointments', JSON.stringify(initialMock));
        return initialMock;
      }
      
      // Migration check: if any old date format (DD.MM.YYYY) exists, reset to fresh mock data
      if (parsed.some((a: any) => a.date && a.date.includes('.'))) {
        const freshMock = getMockData();
        localStorage.setItem('lumiere_appointments', JSON.stringify(freshMock));
        return freshMock;
      }
      
      return parsed;
    } catch {
      return getMockData();
    }
  });

  useEffect(() => {
    localStorage.setItem('lumiere_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const navigate = (page: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'admin' | 'capabilities') => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
    setIsDemoMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-surface text-on-surface">
      <ScrollProgress />
      {/* Top Demo Disclaimer Banner */}
      <div className="bg-amber-100/95 border-b border-amber-300 text-amber-950 px-4 py-2 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 fixed top-0 left-0 right-0 z-[60] backdrop-blur-md shadow-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse flex-shrink-0" />
        <span>
          <strong>סביבת הדגמה חיה (Demo Showcase):</strong> אתר זה נועד להמחשת יכולות המערכת בלבד. הנתונים נשמרים מקומית בדפדפן לצורך בדיקה והתנסות.
        </span>
      </div>

      {/* Header */}
      <header className="fixed top-9 left-0 right-0 z-50 glass border-b border-white/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('home')}>
            <h1 className="font-serif text-2xl tracking-widest text-primary uppercase">
              לומייר סלון
            </h1>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            <button onClick={() => navigate('home')} className={`text-sm uppercase tracking-widest transition-colors font-medium gold-underline ${activePage === 'home' ? 'text-secondary active' : 'text-on-surface-variant hover:text-secondary'}`}>ראשי</button>
            <button onClick={() => navigate('services')} className={`text-sm uppercase tracking-widest transition-colors font-medium gold-underline ${activePage === 'services' ? 'text-secondary active' : 'text-on-surface-variant hover:text-secondary'}`}>שירותים</button>
            <button onClick={() => navigate('capabilities')} className={`text-sm uppercase tracking-widest transition-colors font-bold gold-underline flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${activePage === 'capabilities' ? 'bg-secondary/15 border-secondary text-secondary shadow-[0_0_15px_rgba(212,175,55,0.25)]' : 'border-secondary/30 text-secondary hover:bg-secondary/10'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              יכולות המערכת
            </button>
            <button onClick={() => navigate('admin')} className={`text-sm uppercase tracking-widest transition-colors font-medium flex items-center gap-1 gold-underline ${activePage === 'admin' ? 'text-secondary active' : 'text-on-surface-variant hover:text-secondary'}`}>אזור מנהל</button>
            
            <div 
              className="relative group"
              onMouseEnter={() => setIsDemoMenuOpen(true)}
              onMouseLeave={() => setIsDemoMenuOpen(false)}
            >
              <button 
                onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)} 
                className="bg-secondary text-primary px-6 py-2 rounded font-medium text-sm uppercase tracking-widest transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                הזמנת תור / הדגמות <ChevronRight className={`w-4 h-4 transition-transform ${isDemoMenuOpen ? '-rotate-90' : 'rotate-90'}`} />
              </button>
              
              <div className={`absolute top-full right-0 mt-2 w-72 bg-surface rounded-xl shadow-2xl border border-secondary/30 transition-all flex flex-col overflow-hidden z-50 origin-top ${isDemoMenuOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}>
                <div className="bg-secondary/10 px-4 py-2 border-b border-secondary/20">
                  <span className="text-xs text-secondary font-bold uppercase tracking-widest">בחר סוג חוויה למשתמש:</span>
                </div>
                <button onClick={() => navigate('book')} className="px-4 py-3 text-right hover:bg-secondary hover:text-primary transition-colors border-b border-surface-variant text-on-surface font-medium flex justify-between items-center group/btn">
                  <span>תור רגיל (גריד קלאסי)</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all"/>
                </button>
                <button onClick={() => navigate('book-chat')} className="px-4 py-3 text-right hover:bg-secondary hover:text-primary transition-colors border-b border-surface-variant text-on-surface font-medium flex justify-between items-center group/btn">
                  <span>צ'אט-בוט אינטראקטיבי</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all"/>
                </button>
                <button onClick={() => navigate('book-minimal')} className="px-4 py-3 text-right hover:bg-secondary hover:text-primary transition-colors border-b border-surface-variant text-on-surface font-medium flex justify-between items-center group/btn">
                  <span>עיצוב מינימליסטי (Apple)</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all"/>
                </button>
                <button onClick={() => navigate('capabilities')} className="px-4 py-3 text-right bg-secondary/5 hover:bg-secondary hover:text-primary transition-colors text-secondary hover:text-primary font-bold flex justify-between items-center group/btn">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> מרכז יכולות והרחבות</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all"/>
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Nav Toggle */}
          <button className="md:hidden text-primary p-2 -mr-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface border-b border-surface-variant overflow-hidden"
            >
              <div className="flex flex-col px-6 py-4 gap-4">
                <button onClick={() => navigate('home')} className="text-right text-sm uppercase tracking-widest text-on-surface hover:text-secondary transition-colors">ראשי</button>
                <button onClick={() => navigate('services')} className="text-right text-sm uppercase tracking-widest text-on-surface hover:text-secondary transition-colors">שירותים</button>
                <button onClick={() => navigate('capabilities')} className="text-right text-sm font-bold uppercase tracking-widest text-secondary flex items-center justify-between bg-secondary/10 p-2.5 rounded-lg border border-secondary/30">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> דף יכולות המערכת</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <div className="flex flex-col gap-2 mt-2 border-t border-surface-variant pt-2 bg-secondary/5 rounded-lg p-2">
                  <span className="text-right text-xs text-secondary mb-1 uppercase tracking-widest font-bold">הדגמות (Showcase):</span>
                  <button onClick={() => navigate('book')} className="text-right text-sm tracking-widest text-on-surface hover:bg-secondary hover:text-primary p-2 rounded transition-colors">תור רגיל (גריד)</button>
                  <button onClick={() => navigate('book-chat')} className="text-right text-sm tracking-widest text-on-surface hover:bg-secondary hover:text-primary p-2 rounded transition-colors">צ'אט-בוט אינטראקטיבי</button>
                  <button onClick={() => navigate('book-minimal')} className="text-right text-sm tracking-widest text-on-surface hover:bg-secondary hover:text-primary p-2 rounded transition-colors">עיצוב מינימליסטי</button>
                </div>

                <button onClick={() => navigate('admin')} className="text-right text-sm uppercase tracking-widest text-on-surface-variant border-t border-surface-variant mt-2 pt-4 hover:text-secondary transition-colors">אזור מנהל</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area with AnimatePresence for smooth transitions */}
      <main className="flex-1 w-full mt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className="w-full h-full flex flex-col"
          >
            {activePage === 'home' && <HomePage onNavigate={navigate} />}
            {activePage === 'services' && <ServicesPage onNavigate={navigate} />}
            {activePage === 'book' && <BookingPage appointments={appointments} setAppointments={setAppointments} onNavigate={navigate} />}
            {activePage === 'book-chat' && <ChatBooking appointments={appointments} onAddAppointment={(apt) => setAppointments(prev => [...prev, { id: Date.now().toString(), ...apt }])} onNavigate={navigate} />}
            {activePage === 'book-minimal' && <MinimalBooking appointments={appointments} onAddAppointment={(apt) => setAppointments(prev => [...prev, { id: Date.now().toString(), ...apt }])} onNavigate={navigate} />}
            {activePage === 'admin' && <AdminPage appointments={appointments} setAppointments={setAppointments} />}
            {activePage === 'capabilities' && <CapabilitiesPage onNavigate={navigate} />}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant w-full mt-auto relative z-10">
        {/* Demo Notice Strip */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-amber-950">
                הודעת מערכת: אתר זה הינו סביבת הדגמה אינטראקטיבית (Demo Showcase)
              </span>
            </div>
            <p className="text-xs text-amber-900/80 max-w-2xl leading-relaxed font-medium">
              כל השירותים, המחירים, השעות והתורים המופיעים באתר הינם לצורך המחשה בלבד ואינם מייצגים עסק פעיל במציאות. הנתונים נשמרים בדפדפן המקומי שלכם בלבד.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="font-serif text-2xl tracking-widest text-primary uppercase mb-4">לומייר סלון</div>
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed mb-6">
              פלטפורמת הדגמה טכנולוגית מבית AutoFlow להמחשת ממשקי קביעת תורים מהירים, דשבורד מנהל, ואוטומציית לקוחות.
            </p>
            <p className="text-xs text-on-surface-variant bg-surface-container p-3 rounded-xl border border-outline-variant inline-block">
              פותח ונבנה על ידי <a href="https://almog787.github.io/AutoFlow/" target="_blank" rel="noopener noreferrer" className="text-secondary-dark hover:text-primary transition-all duration-300 font-bold hover-lift inline-block ml-1 underline decoration-secondary/30 underline-offset-4">צוות AutoFlow</a>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-secondary-dark mb-1">ניווט מהיר</h4>
            <button onClick={() => navigate('home')} className="text-on-surface-variant text-xs hover:text-secondary text-right transition-colors">דף הבית</button>
            <button onClick={() => navigate('capabilities')} className="text-on-surface-variant text-xs hover:text-secondary text-right transition-colors font-bold text-secondary-dark">דף יכולות המערכת</button>
            <button onClick={() => navigate('admin')} className="text-on-surface-variant text-xs hover:text-secondary text-right transition-colors">אזור ניהול (Admin)</button>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-secondary-dark mb-1">ממשקי הזמנה בדמו</h4>
            <button onClick={() => navigate('book')} className="text-on-surface-variant text-xs hover:text-secondary text-right transition-colors">תור רגיל (גריד שבועי)</button>
            <button onClick={() => navigate('book-chat')} className="text-on-surface-variant text-xs hover:text-secondary text-right transition-colors">צ'אט-בוט אינטראקטיבי</button>
            <button onClick={() => navigate('book-minimal')} className="text-on-surface-variant text-xs hover:text-secondary text-right transition-colors">עיצוב מינימליסטי (Apple)</button>
          </div>
          <div className="col-span-1 md:col-span-4 pt-6 border-t border-outline-variant text-center">
            <p className="text-xs text-on-surface-variant">© 2026 AutoFlow Systems. סביבת הדגמה פתוחה להמחשת פתרונות דיגיטליים.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Pages ---

function HomePage({ onNavigate }: { onNavigate: (page: 'book' | 'services' | 'capabilities' | 'admin') => void }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <div className="flex flex-col w-full relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 z-10" />
          <motion.img 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.1 }}
            style={{ y }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000" 
            alt="Barber Shop" 
            className="w-full h-[120%] object-cover -top-[10%] relative"
          />
        </div>
        
        <div className="relative z-20 flex flex-col items-center text-center max-w-5xl mx-auto px-4 md:px-6 mt-12">
          
          {/* Over-title / Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="flex items-center gap-2 md:gap-4 mb-6"
          >
            <div className="h-px w-8 md:w-20 bg-secondary/60"></div>
            <span className="uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-sm text-secondary font-bold">Lumière Premium</span>
            <div className="h-px w-8 md:w-20 bg-secondary/60"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.3 }}
          >
            <h2 className="font-serif text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-bold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
              אמנות הטיפוח<br/> <span className="text-gradient-gold inline-block mt-2">סטנדרט חדש</span>
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-2xl text-white/90 mb-10 max-w-3xl leading-relaxed font-light drop-shadow-md border-b border-white/20 pb-8 px-2"
          >
            חוויית פרימיום חסרת פשרות, המשלבת מסורת של דיוק, קדמה וסטייל מוקפד.
            <br className="hidden md:block"/>
            הזמינו תור כעת והבטיחו את המראה המושלם שלכם בקליק.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
          >
            <button onClick={() => onNavigate('book')} className="w-full sm:w-auto bg-secondary text-primary px-8 md:px-10 py-4 rounded text-sm uppercase tracking-widest font-bold transition-all duration-300 hover:bg-white hover:text-primary hover:scale-[1.02] shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              הזמן תור עכשיו
            </button>
            <button onClick={() => onNavigate('capabilities')} className="w-full sm:w-auto bg-transparent border border-secondary/50 text-secondary px-8 md:px-10 py-4 rounded text-sm uppercase tracking-widest font-bold transition-all duration-300 hover:bg-secondary/10 hover:border-secondary flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> דף יכולות המערכת
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-surface px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Scissors, title: "דיוק מקסימלי", desc: "שילוב של טכניקות מסורתיות עם הטרנדים החמים ביותר לעיצוב מושלם." },
              { icon: Star, title: "חוויית פרימיום", desc: "שירות אישי, אווירה יוקרתית ויחס VIP לכל לקוח מרגע הכניסה." },
              { icon: Clock, title: "זמן הוא כוח", desc: 'מערכת תורים חכמה שמבטיחה אפס זמן המתנה ושירות מדויק ללו"ז שלך.' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: idx * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="flex flex-col items-center text-center p-8 bg-surface-container-lowest rounded-2xl luxury-shadow group transition-shadow duration-500 hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-primary/5 text-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-primary transition-colors duration-500">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-primary">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Capabilities Pitch Banner inside HomePage */}
          <div className="mt-16 bg-gradient-to-r from-surface-container-high via-secondary/10 to-surface-container-high rounded-3xl p-8 md:p-10 border border-secondary/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-right">
              <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center flex-shrink-0 border border-secondary/30">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-serif font-bold text-on-surface">רוצים לראות את כל יכולות המערכת והאוטומציה?</h4>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  הכירו את בוט ה-WhatsApp האוטומטי, סליקת מקדמות, מועדון הלקוחות והדשבורד המלא.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('capabilities')}
              className="w-full md:w-auto bg-secondary text-primary px-6 py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 flex-shrink-0"
            >
              <span>צפה במרכז היכולות</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export const services = [
  { id: 'haircut', title: 'תספורת קלאסית', duration: '45 דק׳', price: '₪120', desc: 'עיצוב שיער מותאם אישית הכולל חפיפה, ייבוש ועיצוב עם מוצרי פרימיום.', image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800' },
  { id: 'beard', title: 'עיצוב זקן', duration: '30 דק׳', price: '₪80', desc: 'סידור ועיצוב זקן מדויק במכונה ותער, כולל טיפול בשמנים ארומטיים.', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800' },
  { id: 'combo', title: 'קומבו VIP', duration: '75 דק׳', price: '₪180', desc: 'החבילה המושלמת: תספורת, עיצוב זקן, מסכת פנים ועיסוי קרקפת.', image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&q=80&w=800' },
  { id: 'color', title: 'צבע והחלקה', duration: '120 דק׳', price: '₪350+', desc: 'שירותי צבע מתקדמים והחלקות קרטין לשיער רך ומבריק לאורך זמן.', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800' },
  { id: 'facial', title: 'טיפול פנים קלאסי', duration: '40 דק׳', price: '₪150', desc: 'ניקוי עמוק, פילינג ומסכת הזנה מותאמת לסוג העור של הגבר.', image: 'https://images.unsplash.com/photo-1512496015851-a1c8141505bd?auto=format&fit=crop&q=80&w=800' },
  { id: 'kids', title: 'תספורת ילדים', duration: '30 דק׳', price: '₪90', desc: 'יחס חם וסבלני לילדים עם חוויית תספורת נעימה ורגועה.', image: 'https://images.unsplash.com/photo-1596722818987-1906f0e4b854?auto=format&fit=crop&q=80&w=800' },
];

function ServicesPage({ onNavigate }: { onNavigate: (page: 'book') => void }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-6 tracking-tight"
        >
          תפריט הטיפולים
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto"
        >
          בחרו את הטיפול המדויק שיתאים לסטייל הייחודי שלכם, לחוויה בלתי נשכחת.
        </motion.p>
      </div>
      
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {services.map((srv) => (
          <motion.div 
            key={srv.id} 
            variants={staggerItem}
            className="group bg-surface-container-lowest rounded-2xl overflow-hidden luxury-shadow border border-outline-variant/30 flex flex-col h-full hover:-translate-y-2 transition-transform duration-500"
          >
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img 
                src={srv.image} 
                alt={srv.title} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 z-20 bg-surface/90 backdrop-blur text-primary font-bold px-4 py-1.5 rounded-full text-sm">
                {srv.price}
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-2xl text-primary font-bold">{srv.title}</h3>
                <span className="text-sm text-secondary bg-secondary/10 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" /> {srv.duration}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8 flex-1">{srv.desc}</p>
              <button 
                onClick={() => onNavigate('book')}
                className="w-full py-4 border border-primary text-primary font-bold uppercase tracking-widest text-sm rounded transition-colors group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center gap-2"
              >
                הזמן עכשיו <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function BookingPage({ appointments, setAppointments, onNavigate }: { appointments: Appointment[], setAppointments: any, onNavigate: (page: 'home' | 'admin') => void }) {
  const [formData, setFormData] = useState({ name: '', phone: '', service: 'haircut', date: '', time: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      alert('נא לבחור תאריך ושעה מהיומן החזותי');
      return;
    }
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending'
    };
    setAppointments([...appointments, newAppointment]);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto w-full py-16 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl luxury-shadow border border-surface-variant text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-green-500/10 text-green-500 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            הזמנת דמו נקלטה בהצלחה
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-primary mb-3">התור נרשם במערכת!</h2>
          <p className="text-on-surface-variant text-base mb-6 leading-relaxed">
            תודה <strong className="text-primary">{formData.name}</strong>, התור נקבע לתאריך <strong className="text-primary">{formData.date}</strong> בשעה <strong className="text-primary">{formData.time}</strong>.<br/>
            התור נשמר בזיכרון המקומי ומסונכרן כעת לכל יומני המערכת.
          </p>

          <div className="bg-surface-container p-4 rounded-2xl border border-outline-variant/60 mb-8 text-xs text-on-surface-variant text-right">
            💡 <strong>רוצים לראות את התור שנקבע?</strong> היכנסו ל<strong>אזור המנהל</strong> ותראו אותו מופיע מיידית ברשימה, ביומן השבועי ובלוח הזמנים להיום.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('admin')}
              className="w-full sm:w-auto bg-secondary text-primary px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              צפה בתור באזור המנהל (Admin)
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto bg-surface-container-high text-on-surface hover:bg-surface-variant px-6 py-3.5 rounded-xl text-sm font-medium border border-outline-variant transition-colors"
            >
              חזרה לעמוד הראשי
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300 mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          סביבת הדגמה - הזמנת תור לדוגמה
        </div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl text-primary mb-3 tracking-tight"
        >
          הזמנת תור (גריד קלאסי)
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base text-on-surface-variant max-w-lg mx-auto"
        >
          בחרו שירות, מלאו פרטים ובחרו שעה פנויה מהיומן השבועי החי שלמטה.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl luxury-shadow border border-outline-variant/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -z-0" />
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <User className="w-4 h-4 text-secondary" /> שם מלא
              </label>
              <input 
                required 
                type="text" 
                className="w-full bg-surface border-b-2 border-outline-variant/50 px-4 py-3 focus:outline-none focus:border-secondary focus:bg-surface-container transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="הכנס את שמך"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" /> טלפון נייד
              </label>
              <input 
                required 
                type="tel" 
                className="w-full bg-surface border-b-2 border-outline-variant/50 px-4 py-3 focus:outline-none focus:border-secondary focus:bg-surface-container transition-all text-left dir-ltr"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="05X-XXXXXXX"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <Scissors className="w-4 h-4 text-secondary" /> סוג שירות
            </label>
            <select 
              className="w-full bg-surface border-b-2 border-outline-variant/50 px-4 py-3 focus:outline-none focus:border-secondary focus:bg-surface-container transition-all cursor-pointer"
              value={formData.service}
              onChange={e => setFormData({...formData, service: e.target.value})}
            >
              {services.map(s => <option key={s.id} value={s.id}>{s.title} - {s.price}</option>)}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4 mt-6">
            <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-secondary" /> בחר מועד (תאריך ושעה)
            </label>
            <WeeklyCalendar 
              appointments={appointments} 
              mode="client" 
              selectedDate={formData.date} 
              selectedTime={formData.time} 
              onSelectSlot={(date: string, time: string) => setFormData({...formData, date, time})} 
            />
            {formData.date && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary font-bold mt-2 text-center bg-secondary/20 py-3 rounded border border-secondary/40">
                נבחר התור ל: {formData.date.split('-').reverse().join('/')} בשעה {formData.time}
              </motion.div>
            )}
          </div>

          <div className="pt-8 border-t border-outline-variant/30 flex justify-end">
            <button type="submit" className="bg-primary text-on-primary px-10 py-4 rounded text-sm uppercase tracking-widest font-bold hover:bg-secondary transition-all shadow-md flex items-center gap-3 group overflow-hidden relative">
              <span className="relative z-10 flex items-center gap-3">
                אישור והזמנת תור
                <span className="transition-transform duration-300 group-hover:-translate-x-2"><ChevronRight className="w-5 h-5"/></span>
              </span>
              <div className="absolute inset-0 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300 ease-out z-0"></div>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
