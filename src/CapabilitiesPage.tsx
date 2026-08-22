import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageSquare, 
  CreditCard, 
  BellRing, 
  Users, 
  Building2, 
  BarChart3, 
  Package, 
  Award, 
  CalendarSync, 
  FolderHeart, 
  CheckCircle2, 
  ArrowLeft, 
  Zap, 
  Check, 
  DollarSign, 
  Layers, 
  Cpu, 
  MousePointerClick
} from 'lucide-react';

interface CapabilitiesPageProps {
  onNavigate: (page: 'home' | 'services' | 'book' | 'book-chat' | 'book-minimal' | 'admin' | 'capabilities') => void;
}

export default function CapabilitiesPage({ onNavigate }: CapabilitiesPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'future'>('all');
  const [simulatorDailyClients, setSimulatorDailyClients] = useState<number>(15);
  const [simulatorAveragePrice, setSimulatorAveragePrice] = useState<number>(120);

  // Calculated ROI simulator
  const monthlyRevenue = simulatorDailyClients * simulatorAveragePrice * 25;
  const noShowSavings = Math.round(monthlyRevenue * 0.12); // ~12% no-show prevented with automated reminders & deposits
  const hoursSavedPerMonth = Math.round(simulatorDailyClients * 25 * 3 / 60); // 3 mins per call saved

  const liveFeatures = [
    {
      id: 'live-multi-ui',
      title: '3 חוויות הזמנה שונות (Multi-Experience)',
      tag: 'פעיל בדמו',
      icon: Layers,
      description: 'הלקוח יכול לבחור בין יומן שבועי קלאסי, צ\'אט-בוט שיחתי מהיר, או עיצוב מינימליסטי מבית Apple. מאפשר לעסק לבחור מה הכי מתאים לקהל היעד.',
      actionPage: 'book',
      actionText: 'נסה את ההדגמות'
    },
    {
      id: 'live-autonomous-assistant',
      title: 'עוזר אינטראקטיבי עצמאי (Zero-AI Chat Assistant)',
      tag: 'חדש! פעיל במסך',
      icon: Sparkles,
      description: 'דמות אינטראקטיבית עם מעקב עיניים חי (Eye Tracking), שאלון הכוונה מודרך, מחשבונים אינטראקטיביים, מאגר כללי זהב וחיפוש פנימי ב-0ms ללא תלות בשרת.',
      actionPage: 'home',
      actionText: 'לחץ על העוזר הצף משמאל'
    },
    {
      id: 'live-sync',
      title: 'סנכרון תורים בזמן אמת (Real-time Live Sync)',
      tag: 'פעיל בדמו',
      icon: Cpu,
      description: 'מוח מרכזי אחד: כל תור שנקבע בצ\'אט, במינימליסטי או ביומן הקלאסי תופס את השעה באופן מיידי ומונע הזמנות כפולות בכל המערכות.',
      actionPage: 'book-chat',
      actionText: 'בדוק סנכרון בצ\'אט'
    },
    {
      id: 'live-admin',
      title: 'דשבורד מנהל אינטראקטיבי מלא',
      tag: 'פעיל בדמו',
      icon: BarChart3,
      description: 'לוח זמנים להיום, יומן גריד שבועי, רשימת תורים עם חיפוש וסינון, הוספת תור ידנית ללקוחות טלפוניים, ושינוי סטטוס בלחיצה.',
      actionPage: 'admin',
      actionText: 'כניסה למערכת הניהול'
    },
    {
      id: 'live-whatsapp-quick',
      title: 'תזכורת WhatsApp בקליק אחד',
      tag: 'פעיל בדמו',
      icon: MessageSquare,
      description: 'מתוך פאנל הניהול, לחיצה על כפתור הוואטסאפ פותחת מיד הודעת תזכורת מעוצבת אישית עם שם הלקוח, מועד התור וסוג השירות.',
      actionPage: 'admin',
      actionText: 'צפה בפעולה באדמין'
    }
  ];

  const extendedFeatures = [
    {
      id: 'feat-auto-whatsapp',
      title: 'בוט WhatsApp אוטומטי מלא 24/7',
      category: 'אוטומציה ובוטים',
      badge: 'בוט תורים אוטומטי',
      icon: MessageSquare,
      highlightColor: 'from-emerald-500/10 to-transparent border-emerald-600/30 text-emerald-900',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'בוט אוטומטי שמחובר למספר הטלפון של העסק, מציג תפריט אפשרויות מהיר, מציע שעות פנויות, קובע או מבטל תורים אוטומטית ללא מגע יד אדם.',
      benefits: ['אפס שיחות טלפון בזמן עבודה', 'הזמנת תורים 24/7 גם בלילה ובסופ״ש', 'תפריט מהיר, יציב ומדויק ללא שגיאות']
    },
    {
      id: 'feat-payments',
      title: 'סליקת אשראי, מקדמות ואבטחת No-Show',
      category: 'פיננסים וסליקה',
      badge: 'הגנה על הכנסות',
      icon: CreditCard,
      highlightColor: 'from-amber-500/10 to-transparent border-amber-600/30 text-amber-950',
      iconBg: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'חיבור ישיר למסופי סליקה ישראליים (משולם, iCredit, טרנזילה). אפשרות לגביית מקדמה מראש או שמירת כרטיס אשראי לביטחון.',
      benefits: ['חיסול כמעט מוחלט של אי-הגעות (No-Show)', 'תשלום ב-Apple Pay / Google Pay בקליק', 'הפקת חשבוניות מס ירוקות אוטומטית']
    },
    {
      id: 'feat-sms-journey',
      title: 'מסע לקוח אוטומטי ב-SMS ו-WhatsApp',
      category: 'שיווק ושימור לקוחות',
      badge: 'שיווק אוטומטי',
      icon: BellRing,
      highlightColor: 'from-blue-500/10 to-transparent border-blue-600/30 text-blue-950',
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'שרשרת הודעות חכמה: אישור תור מיידי, תזכורת 24 שעות לפני, תזכורת 2 שעות לפני, ובקשת דירוג בגוגל שעה אחרי סיום הטיפול.',
      benefits: ['הגדלת דירוגים וביקורות חיוביות ב-Google Maps', 'ירידה של 90% בשכחת תורים', 'הודעות יום הולדת וקופוני שימור אוטומטיים']
    },
    {
      id: 'feat-multi-staff',
      title: 'ניהול עובדים, עמדות ויומנים מרובים',
      category: 'תפעול וניהול צוות',
      badge: 'ריבוי עובדים',
      icon: Users,
      highlightColor: 'from-purple-500/10 to-transparent border-purple-600/30 text-purple-950',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'הגדרת ספרים/מטפלים שונים בסלון, יומן נפרד לכל עובד, שעות פעילות וזמני הפסקות אישיים, וחישוב עמלות מדויק לכל איש צוות.',
      benefits: ['הלקוח בוחר את הספר המועדף עליו', 'מניעת התנגשות בעמדות עבודה', 'דוח שכר ועמלות עובדים בלחיצת כפתור']
    },
    {
      id: 'feat-multi-branch',
      title: 'מערכת רשת סניפים (Multi-Branch)',
      category: 'רשתות וארגונים',
      badge: 'סקייל עסקי',
      icon: Building2,
      highlightColor: 'from-cyan-500/10 to-transparent border-cyan-600/30 text-cyan-950',
      iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description: 'תמיכה מלאה ברשתות של מספר סניפים עם בחירת סניף מבוסס מיקום, ניהול מחירונים לפי סניף, ודשבורד ראשי אחד לבעל הרשת.',
      benefits: ['שליטה מלאה בכל הסניפים ממסך אחד', 'השוואת ביצועים ורווחיות בין סניפים', 'מעבר קל ללקוחות בין מיקומים']
    },
    {
      id: 'feat-bi-analytics',
      title: 'דוחות BI וניתוח עסקי מתקדם',
      category: 'אנליטיקה ונתונים',
      badge: 'קבלת החלטות חכמה',
      icon: BarChart3,
      highlightColor: 'from-rose-500/10 to-transparent border-rose-600/30 text-rose-950',
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'גרפים ודוחות על שעות השיא בעסק, השירותים הכי רווחיים, לקוחות חוזרים מול לקוחות שנטשו, ותחזית הכנסות חודשית קדימה.',
      benefits: ['זיהוי מדויק של שעות מתות והפעלת מבצעים', 'מעקב שווי לקוח ממוצע (LTV)', 'יצוא דוחות לאקסל ורואה חשבון']
    },
    {
      id: 'feat-pos-inventory',
      title: 'ניהול מלאי וחנות מוצרים משלימים (POS)',
      category: 'קופה ומלאי',
      badge: 'הגדלת סל ממוצע',
      icon: Package,
      highlightColor: 'from-amber-500/10 to-transparent border-amber-600/30 text-amber-950',
      iconBg: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'ניהול מוצרי שיער, שמפו, ווקסים וטיפולים. הוספת מוצרים להזמנה ישירות בעת קביעת התור, והתראות כשהמלאי על המדף עומד להסתיים.',
      benefits: ['הגדלת הכנסה ממוצעת מכל לקוח ב-20-30%', 'ספירת מלאי נוחה ומניעת חוסרים', 'חיבור לקופה רושמת']
    },
    {
      id: 'feat-loyalty-club',
      title: 'מועדון לקוחות וכרטיסייה דיגיטלית',
      category: 'שימור לקוחות',
      badge: 'נאמנות לקוחות',
      icon: Award,
      highlightColor: 'from-amber-400/10 to-transparent border-secondary/40 text-amber-950',
      iconBg: 'bg-secondary/15 text-secondary-dark border-secondary/30',
      description: 'כרטיסיית תספורות וירטואלית בטלפון (למשל: תספורת 10 במתנה), צבירת נקודות למימוש בהנחות, ומבצעי VIP לחברי מועדון.',
      benefits: ['נעילת לקוחות לטווח ארוך ומניעת עזיבה למתחרים', 'הגדלת תדירות הביקורים בסלון', 'חוויית VIP דיגיטלית ב-Apple Wallet']
    },
    {
      id: 'feat-calendar-sync',
      title: 'סנכרון דו-כיווני עם Google & Apple Calendar',
      category: 'אינטגרציות',
      badge: 'חיבור ליומן אישי',
      icon: CalendarSync,
      highlightColor: 'from-emerald-500/10 to-transparent border-emerald-600/30 text-emerald-950',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'כל תור שנכנס באתר מופיע תוך שנייה ביומן Google / iPhone האישי של הספר. אם הספר מכניס אירוע פרטי ביומן שלו – השעה נחסמת באתר אוטומטית.',
      benefits: ['עבודה טבעית מהיומן של הטלפון', 'מניעת כפילויות עם אירועים אישיים', 'תזכורות פופ-אפ ישירות בטלפון ובשעון החכם']
    },
    {
      id: 'feat-client-cards',
      title: 'תיק לקוח חכם והיסטוריית טיפולים',
      category: 'שירות פרימיום',
      badge: 'שירות אישי ומדויק',
      icon: FolderHeart,
      highlightColor: 'from-indigo-500/10 to-transparent border-indigo-600/30 text-indigo-950',
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'כרטיס דיגיטלי לכל לקוח עם היסטוריית תורים, גלריית תמונות "לפני ואחרי", הערות מקצועיות (למשל: נוסחת גוון צבע, מספר מכונה מועדף, רגישויות).',
      benefits: ['שירות מותאם אישית שגורם ללקוח להרגיש VIP', 'כל ספר בצוות יודע בדיוק מה הלקוח אוהב', 'תיעוד היסטורי מסודר']
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16 text-on-surface" dir="rtl">
      
      {/* Hero Banner for Client Pitch */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-surface-container-high via-surface-container to-surface border border-secondary/30 p-8 md:p-14 mb-14 luxury-shadow">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 text-secondary text-xs md:text-sm font-bold border border-secondary/30 mb-6">
            <Sparkles className="w-4 h-4" />
            מערכת התורים והניהול המקיפה ביותר בישראל (2026 Edition)
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-on-surface tracking-tight leading-tight mb-6">
            לא רק יומן תורים – <br />
            <span className="text-secondary bg-gradient-to-r from-secondary via-amber-200 to-secondary bg-clip-text text-transparent">
              מנוע צמיחה ואוטומציה מלא לעסק
            </span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-3xl mb-8">
            ברוכים הבאים למרכז היכולות של פלטפורמת <strong className="text-on-surface">Lumière Suite</strong>.
            העמוד הזה מציג את החוויות הפעילות שכבר עובדות בדמו החי, לצד הארכיטקטורה המלאה והיכולות המורחבות הניתנות להטמעה מיידית בעסק שלכם.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-secondary">100%</div>
              <div className="text-xs text-on-surface-variant mt-0.5">סנכרון תורים חי</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-secondary">3</div>
              <div className="text-xs text-on-surface-variant mt-0.5">ממשקי הזמנה מוכנים</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-secondary">90%</div>
              <div className="text-xs text-on-surface-variant mt-0.5">צמצום שיחות וביטולים</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-serif text-secondary">24/7</div>
              <div className="text-xs text-on-surface-variant mt-0.5">קבלת לקוחות עצמאית</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-surface-container-high p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'all' ? 'bg-secondary text-primary shadow-lg font-extrabold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            כל היכולות ({liveFeatures.length + extendedFeatures.length})
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'live' ? 'bg-secondary text-primary shadow-lg font-extrabold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            פעיל בדמו החי ({liveFeatures.length})
          </button>
          <button
            onClick={() => setActiveTab('future')}
            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'future' ? 'bg-secondary text-primary shadow-lg font-extrabold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-secondary" />
            מודולים להרחבה והטמעה ({extendedFeatures.length})
          </button>
        </div>
      </div>

      {/* SECTION 1: LIVE IN DEMO */}
      {(activeTab === 'all' || activeTab === 'live') && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-2xl font-bold font-serif text-on-surface">יכולות הפעילות כעת באתר הדמו</h2>
              </div>
              <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                את כל התכונות הללו ניתן לבדוק ולהרגיש כבר עכשיו באתר בצורה אינטראקטיבית מלאה.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveFeatures.map(feat => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.id}
                  whileHover={{ y: -3 }}
                  className="bg-surface-container-lowest rounded-2xl p-6 border border-emerald-600/30 flex flex-col justify-between relative overflow-hidden group shadow-md"
                >
                  <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-br-full pointer-events-none" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-sm">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-on-surface mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                      {feat.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate(feat.actionPage as any)}
                    className="w-full py-2.5 px-4 rounded-xl bg-surface-container-low hover:bg-secondary hover:text-primary text-secondary-dark text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all border border-outline-variant/60 hover:border-secondary shadow-sm"
                  >
                    <span>{feat.actionText}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: ADVANCED EXPANSION MODULES */}
      {(activeTab === 'all' || activeTab === 'future') && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary-dark" />
                <h2 className="text-2xl font-bold font-serif text-on-surface">מודולים מתקדמים להטמעה מלאה (Production Ecosystem)</h2>
              </div>
              <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                מגוון פתרונות מקיפים הניתנים להפעלה וחיבור ישיר למערכת לפי צורכי העסק שלכם.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extendedFeatures.map(feat => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className={`bg-gradient-to-b ${feat.highlightColor} bg-surface-container-lowest rounded-2xl p-6 border flex flex-col justify-between relative overflow-hidden transition-all hover:scale-[1.01] shadow-md`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${feat.iconBg}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant uppercase tracking-wider border border-outline-variant/40">
                        {feat.badge}
                      </span>
                    </div>

                    <div className="text-xs text-secondary-dark font-bold uppercase tracking-wider mb-1">{feat.category}</div>
                    <h3 className="text-lg font-bold text-on-surface mb-2.5">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-5">
                      {feat.description}
                    </p>

                    <div className="space-y-2 pt-4 border-t border-outline-variant/40 mb-4">
                      {feat.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-on-surface font-medium">
                          <Check className="w-3.5 h-3.5 text-secondary-dark flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-on-surface-variant/80 font-medium italic pt-2">
                    ✓ זמין להפעלה בהתאמה אישית
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: LIVE ROI & TIME SAVINGS SIMULATOR */}
      <section className="mb-16 bg-surface-container-lowest rounded-3xl border border-secondary/30 p-6 sm:p-10 luxury-shadow">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-secondary-dark uppercase tracking-widest mb-2">
            <DollarSign className="w-4 h-4" /> מחשבון החזר השקעה וחיסכון (ROI Calculator)
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-on-surface">
            כמה כסף וזמן המערכת חוסכת לעסק שלך בכל חודש?
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
            גרור את המחוונים כדי לראות את ההשפעה הכלכלית המיידית של אוטומציית תורים ומניעת אי-הגעות:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/50">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-on-surface">לקוחות ביום:</span>
                <span className="text-secondary-dark text-sm font-extrabold">{simulatorDailyClients} לקוחות</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={simulatorDailyClients}
                onChange={(e) => setSimulatorDailyClients(parseInt(e.target.value, 10))}
                className="w-full accent-[#C59B27] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-on-surface">מחיר ממוצע לטיפול:</span>
                <span className="text-secondary-dark text-sm font-extrabold">₪{simulatorAveragePrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={simulatorAveragePrice}
                onChange={(e) => setSimulatorAveragePrice(parseInt(e.target.value, 10))}
                className="w-full accent-[#C59B27] cursor-pointer"
              />
            </div>

            <div className="text-[11px] text-on-surface-variant/80">
              * החישוב מבוסס על 25 ימי עבודה בחודש, צמצום של כ-12% בביטולי פתע וחיסכון של 3 דק' מענה טלפוני לכל תור.
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-300 text-center shadow-sm">
              <div className="text-xs text-amber-900 font-bold uppercase tracking-wider mb-2">
                מניעת הפסד מאי-הגעה
              </div>
              <div className="text-3xl font-serif font-bold text-amber-950 mb-1">
                ₪{noShowSavings.toLocaleString()}
              </div>
              <div className="text-[11px] text-amber-900/80 font-medium">
                חיסכון חודשי מובטח ממקדמות ותזכורות
              </div>
            </div>

            <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-300 text-center shadow-sm">
              <div className="text-xs text-blue-900 font-bold uppercase tracking-wider mb-2">
                שעות עבודה שנחסכות
              </div>
              <div className="text-3xl font-serif font-bold text-blue-950 mb-1">
                {hoursSavedPerMonth} שעות
              </div>
              <div className="text-[11px] text-blue-900/80 font-medium">
                שמתפנות לעבודה עם לקוחות במקום טלפונים
              </div>
            </div>

            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-300 text-center shadow-sm">
              <div className="text-xs text-emerald-900 font-bold uppercase tracking-wider mb-2">
                צפי הכנסות חודשי
              </div>
              <div className="text-3xl font-serif font-bold text-emerald-900 mb-1">
                ₪{monthlyRevenue.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-900/80 font-medium">
                באוטומציה מלאה ויומן מסודר
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARISON TABLE - CUSTOM VS GENERIC APPS */}
      <section className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-on-surface mb-2">
            למה מערכת מותאמת אישית מנצחת אפליקציות גנריות?
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            השוואה ברורה בין נכס דיגיטלי יוקרתי בבעלותך המלאה, לבין פלטפורמות שכורות וגנריות.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 overflow-hidden luxury-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/50 text-xs sm:text-sm font-bold">
                  <th className="py-4 px-6 text-on-surface">מאפיין המערכת</th>
                  <th className="py-4 px-6 text-secondary-dark bg-secondary/15 text-center font-bold">פלטפורמת Lumière Boutique</th>
                  <th className="py-4 px-6 text-on-surface-variant text-center">אפליקציות מדף גנריות (Torim/Wix)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs sm:text-sm">
                <tr>
                  <td className="py-4 px-6 font-bold text-on-surface">עיצוב ומיתוג יוקרתי (White Label)</td>
                  <td className="py-4 px-6 text-center bg-secondary/5 font-bold text-emerald-700">
                    ✓ מיתוג מלא בלעדי לעסק, ללא לוגואים זרים
                  </td>
                  <td className="py-4 px-6 text-center text-rose-700 font-medium">
                    ✗ תבניות גנריות המציגות לוגואים של הפלטפורמה
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-on-surface">חשיפת הלקוחות למתחרים</td>
                  <td className="py-4 px-6 text-center bg-secondary/5 font-bold text-emerald-700">
                    ✓ אפס מתחרים – הלקוח רק אצלך
                  </td>
                  <td className="py-4 px-6 text-center text-rose-700 font-medium">
                    ✗ הלקוח מחפש באפליקציה ורואה מספרות אחרות לידך
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-on-surface">מגוון חוויות הזמנה (3 ממשקים)</td>
                  <td className="py-4 px-6 text-center bg-secondary/5 font-bold text-emerald-700">
                    ✓ גריד שבועי, צ'אט בוט ועיצוב מינימליסטי
                  </td>
                  <td className="py-4 px-6 text-center text-rose-700 font-medium">
                    ✗ טופס בסיסי ומשעמם אחד בלבד
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-on-surface">עמלות סליקה חודשיות</td>
                  <td className="py-4 px-6 text-center bg-secondary/5 font-bold text-emerald-700">
                    ✓ סליקה ישירה לחשבון הבנק שלך ללא גזירת אחוזים
                  </td>
                  <td className="py-4 px-6 text-center text-amber-800 font-medium">
                    ✗ עמלות גבוהות על כל עסקה וסליקה
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-on-surface">סנכרון מלא עם WhatsApp ויומני Google</td>
                  <td className="py-4 px-6 text-center bg-secondary/5 font-bold text-emerald-700">
                    ✓ סנכרון דו-כיווני בזמן אמת
                  </td>
                  <td className="py-4 px-6 text-center text-amber-800 font-medium">
                    ✗ חלקי או כרוך בתשלום נוסף
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-on-surface">בעלות על הנתונים ורשימת הלקוחות</td>
                  <td className="py-4 px-6 text-center bg-secondary/5 font-bold text-emerald-700">
                    ✓ נכס דיגיטלי של 100% שלך
                  </td>
                  <td className="py-4 px-6 text-center text-rose-700 font-medium">
                    ✗ הנתונים שמורים בפלטפורמה צד שלישי
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION */}
      <div className="text-center bg-gradient-to-r from-surface-container-low via-secondary/15 to-surface-container-low p-8 sm:p-12 rounded-3xl border border-secondary/40 luxury-shadow">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-on-surface mb-3">
          מוכנים לשדרג את העסק לרמה הבאה?
        </h2>
        <p className="text-xs sm:text-base text-on-surface-variant max-w-xl mx-auto mb-8 leading-relaxed">
          בואו נבנה יחד את המערכת המדויקת עבורכם. צפו בהדגמות החיות או פנו אלינו להתאמה אישית מלאה.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('book')}
            className="bg-secondary text-primary px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2"
          >
            <MousePointerClick className="w-4 h-4" /> התחל הדגמה חיה
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className="bg-surface-container-lowest hover:bg-surface-container text-on-surface px-6 py-3.5 rounded-xl font-bold text-sm border border-outline-variant/60 transition-colors flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4 text-secondary-dark" /> פתח דשבורד מנהל
          </button>
        </div>
      </div>

    </div>
  );
}
