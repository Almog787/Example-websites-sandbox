import { AssistantConfig } from './types';

export const ASSISTANT_CONFIG: AssistantConfig = {
  theme: {
    primaryColor: '#121212',
    accentColor: '#D4AF37',
    botName: 'Lumière Assistant',
    roleTitle: 'עוזר אינטראקטיבי עצמאי',
    welcomeBubbleText: 'צריך עזרה או התאמה מהירה? לחץ כאן ✨'
  },
  initialQuizStepId: 'step_goal',
  quizTree: {
    step_goal: {
      id: 'step_goal',
      question: 'מה המטרה העיקרית של הביקור שלך היום?',
      subtitle: 'בחר את האפשרות המתאימה ביותר כדי שנוכל להכווין אותך למסלול המהיר ביותר:',
      options: [
        {
          id: 'opt_hair',
          iconName: 'Scissors',
          title: 'תספורת וסטיילינג לשיער',
          description: 'קלאסי, סקין פייד מודרני או טיפול קרקפת',
          nextStepId: 'step_hair_style'
        },
        {
          id: 'opt_beard',
          iconName: 'Flame',
          title: 'עיצוב וטיפוח זקן',
          description: 'יישור קווים בתער, ספא מגבות חמות או קומבו',
          nextStepId: 'step_beard_style'
        },
        {
          id: 'opt_event',
          iconName: 'Crown',
          title: 'הכנה לאירוע חתן / אירוע יוקרתי',
          description: 'חבילת טיפול מלאה לקראת יום צילומים או אירוע',
          result: {
            title: 'חבילת VIP VIP Event Grooming',
            badge: 'חבילת פרימיום',
            summary: 'תספורת Master Fade, פיסול זקן בתער, עיסוי קרקפת ומסכת פנים מחדשת.',
            estimatedPrice: '₪250',
            estimatedDuration: '75 דקות',
            recommendedService: 'VIP Grooming Package',
            targetPage: 'book',
            actionLabel: 'שריין משבצת ביומן השבועי',
            proTip: 'מומלץ לקבוע 48 שעות לפני יום האירוע למראה טבעי ושלם.'
          }
        },
        {
          id: 'opt_booking_choice',
          iconName: 'Sparkles',
          title: 'אני יודע מה אני רוצה - רוצה להזמין תור',
          description: 'בחירת ממשק ההזמנה הנוח ביותר עבורך',
          nextStepId: 'step_booking_method'
        }
      ]
    },
    step_hair_style: {
      id: 'step_hair_style',
      question: 'איזה סגנון תספורת תעדיף?',
      subtitle: 'נתאים לך את השירות והזמן הנדרש:',
      options: [
        {
          id: 'opt_hair_classic',
          iconName: 'Scissors',
          title: 'תספורת גברים קלאסית',
          description: 'עבודה מדויקת במספריים, מראה מעודן ונקי',
          result: {
            title: 'תספורת גברים קלאסית (Classic Cut)',
            badge: 'בחירה מעודנת',
            summary: 'תספורת מותאמת אישית עם שטיפה, עיצוב בפומייד יוקרתי ומגבת מבושמת.',
            estimatedPrice: '₪120',
            estimatedDuration: '45 דקות',
            recommendedService: 'תספורת גברים קלאסית',
            targetPage: 'book-minimal',
            actionLabel: 'קבע תור מהיר ב-3 קליקים',
            proTip: 'מגיע לראשונה? מומלץ להציג לספר תמונה של הסגנון המבוקש.'
          }
        },
        {
          id: 'opt_hair_fade',
          iconName: 'Flame',
          title: 'סקין פייד מודרני (Master Fade)',
          description: 'דירוג אפס מושלם וטקסטורה עליונה',
          result: {
            title: 'תספורת פרימיום Master Fade',
            badge: 'הכי מבוקש 🔥',
            summary: 'דירוג אפס מילימטרי, עיצוב טקסטורה עליונה עם חומר מט ומגבת מרעננת.',
            estimatedPrice: '₪150',
            estimatedDuration: '50 דקות',
            recommendedService: 'Master Fade Premium',
            targetPage: 'book',
            actionLabel: 'קבע ביומן השבועי החזותי',
            proTip: 'מומלץ לתחזק דירוג פייד מדי שבועיים-שלושה לשמירה על חדות.'
          }
        },
        {
          id: 'opt_hair_spa',
          iconName: 'Crown',
          title: 'טיפול קרקפת ועיסוי מלא',
          description: 'חפיפה כפולה, מסכה והמרצת שורשים',
          result: {
            title: 'טיפול קרקפת ועיצוב מלא VIP',
            badge: 'חוויית רוגע',
            summary: 'תספורת מלאה, עיסוי קרקפת בשמנים ארומטיים, חפיפה כפולה ומגבת חמה.',
            estimatedPrice: '₪190',
            estimatedDuration: '60 דקות',
            recommendedService: 'Scalp Spa & Cut',
            targetPage: 'services',
            actionLabel: 'צפה בכל השירותים והמחירים',
            proTip: 'טיפול מומלץ במיוחד בסוף שבוע עמוס לשחרור מתחים.'
          }
        }
      ]
    },
    step_beard_style: {
      id: 'step_beard_style',
      question: 'מה הטיפול הדרוש לזקן שלך?',
      subtitle: 'עיצוב בתער, מגבות חמות ושמנים מזינים:',
      options: [
        {
          id: 'opt_beard_trim',
          iconName: 'Scissors',
          title: 'יישור קווים ופיסול בתער',
          description: 'קווי מתאר נקיים בלחיים ובצוואר',
          result: {
            title: 'עיצוב זקן קלאסי בתער',
            badge: 'מדויק ומהיר',
            summary: 'פיסול קווי המתאר בתער מסורתי, יישור נפחים ושמן הזנה אורגני.',
            estimatedPrice: '₪70',
            estimatedDuration: '25 דקות',
            recommendedService: 'עיצוב זקן בתער',
            targetPage: 'book-chat',
            actionLabel: 'קבע תור בצ\'אט בוט',
            proTip: 'שמן זקן יומי מונע גירוד ויובש בעור הפנים.'
          }
        },
        {
          id: 'opt_beard_combo',
          iconName: 'Flame',
          title: 'קומבו מלא: תספורת + זקן',
          description: 'התאמה הרמונית בין מבנה השיער לצורת הפנים',
          result: {
            title: 'חבילת קומבו Lumière Signature',
            badge: 'חיסכון של ₪20 ✨',
            summary: 'תספורת פרימיום + עיצוב זקן מלא בתער, שטיפה כפולה וטיפוח שמנים.',
            estimatedPrice: '₪170',
            estimatedDuration: '60 דקות',
            recommendedService: 'Combo Hair & Beard',
            targetPage: 'book',
            actionLabel: 'בחר משבצת קומבו ביומן',
            proTip: 'חיסכון של ₪20 לעומת הזמנת השירותים בנפרד!'
          }
        }
      ]
    },
    step_booking_method: {
      id: 'step_booking_method',
      question: 'איזה ממשק קביעת תורים מועדף עליך?',
      subtitle: 'הסלון מציע 3 דרכים שונות ונוחות להזמנה:',
      options: [
        {
          id: 'opt_method_grid',
          iconName: 'Calendar',
          title: 'יומן שבועי חזותי (Weekly Grid)',
          description: 'צפייה נוחה בכל המשבצות הפנויות השבוע לפי ימים ושעות',
          result: {
            title: 'יומן שבועי חזותי',
            badge: 'מומלץ למחשב',
            summary: 'תצוגת יומן מפורטת עם בחירת ספר, שעה וסנכרון בזמן אמת.',
            targetPage: 'book',
            actionLabel: 'מעבר ליומן השבועי'
          }
        },
        {
          id: 'opt_method_chat',
          iconName: 'MessageSquare',
          title: 'צ\'אט בוט קביעת תורים (Booking Chatbot)',
          description: 'שיחה קצרה ומהירה עם עוזר הבוט למציאת תור פנוי',
          result: {
            title: 'צ\'אט בוט חכם לקביעת תורים',
            badge: 'חוויה שיחתית',
            summary: 'עונה לשאלות מותאמות אישית ומוצא לך את התור הקרוב ביותר.',
            targetPage: 'book-chat',
            actionLabel: 'פתח צ\'אט בוט להזמנה'
          }
        },
        {
          id: 'opt_method_minimal',
          iconName: 'MousePointerClick',
          title: 'הזמנה מהירה ב-3 קליקים (Apple Minimalist)',
          description: 'ממשק קל, ממוקד ונקי במיוחד מותאם לסלולר',
          result: {
            title: 'קביעת תור ב-3 קליקים',
            badge: 'הכי מהיר בסלולר 📱',
            summary: 'תהליך הזמנה מקוצר ללא הסחות דעת.',
            targetPage: 'book-minimal',
            actionLabel: 'הזמן ב-3 קליקים'
          }
        }
      ]
    }
  },
  quickTools: [
    {
      id: 'tool_combo',
      title: 'מחשבון שילוב שירותים',
      subtitle: 'חישוב עלות, משך דקות ושעת סיום משוערת',
      iconName: 'Scissors',
      badge: 'מחשבון זמנים',
      type: 'combo'
    },
    {
      id: 'tool_savings',
      title: 'מחשבון חיסכון VIP',
      subtitle: 'בדוק כמה תחסוך בכרטיסייה שנתית',
      iconName: 'DollarSign',
      badge: 'חיסכון כספי',
      type: 'savings'
    }
  ],
  goldenTips: [
    {
      id: 'tip_fade',
      category: 'hair',
      categoryLabel: 'טיפוח שיער',
      title: 'שמירה על חדות דירוג הפייד',
      summary: 'כדי שהדירוג ייראה תמיד חד ונקי, מומלץ לחפוף במים פושרים ולהימנע מקרמים כבדים שסותמים נקבוביות.',
      goldenRule: 'כלל הזהב: רענן דירוג כל 14-21 יום להשגת מראה ללא פשרות.',
      targetPage: 'book',
      actionLabel: 'קבע תור לרענון פייד'
    },
    {
      id: 'tip_beard_itch',
      category: 'beard',
      categoryLabel: 'עיצוב זקן',
      title: 'מניעת יובש וגרד בזקן',
      summary: 'עור הפנים מתחת לזקן זקוק ללחות קבועה. שמן זקן איכותי על בסיס חוחובה או ארגן מרכך את הזיפים ומרגיע את העור.',
      goldenRule: 'כלל הזהב: מריחת 3-4 טיפות שמן על זקן לח מיד לאחר מקלחת.',
      targetPage: 'services',
      actionLabel: 'למידע נוסף במחירון'
    },
    {
      id: 'tip_event_timing',
      category: 'event',
      categoryLabel: 'הכנה לאירוע',
      title: 'תזמון תספורת לפני אירוע חשוב / חתונה',
      summary: 'לעולם אל תסתפר שעה לפני החופה או האירוע. תספורת טרייה נראית במיטבה כעבור 24 עד 48 שעות.',
      goldenRule: 'כלל הזהב: קבע תור יומיים לפני מועד האירוע לקבלת נפח טבעי וקווים מושלמים.',
      targetPage: 'book-chat',
      actionLabel: 'שריון תור בצ\'אט בוט'
    },
    {
      id: 'tip_daily_products',
      category: 'daily',
      categoryLabel: 'הרגלים יומיומיים',
      title: 'התאמת חומר עיצוב לפי סוג השיער',
      summary: 'לשיער דק מומלץ חימר מט (Clay/Powder) להוספת נפח. לשיער עבה או יבש מתאים פומייד מבוסס מים עם ברק עדין.',
      goldenRule: 'כלל הזהב: חמם כמות קטנה בגודל אפונה בין כפות הידיים לפני המריחה.',
      targetPage: 'services',
      actionLabel: 'צפה במגוון המוצרים'
    }
  ],
  searchIndex: [
    {
      id: 'search_grid',
      title: 'יומן שבועי חזותי (Weekly Grid)',
      category: 'דף קביעת תור',
      description: 'תצוגת לוח שבועי מלאה עם בחירת ימים, שעות וספרים',
      tags: ['יומן', 'תור', 'שבועי', 'הזמנה', 'ספר', 'שעות'],
      targetPage: 'book',
      actionLabel: 'עבור ליומן',
      badge: 'פופולרי'
    },
    {
      id: 'search_chatbot',
      title: 'צ\'אט בוט קביעת תורים אינטראקטיבי',
      category: 'דף קביעת תור',
      description: 'שיחה מהירה עם בוט חכם למציאת התור המתאים ביותר',
      tags: ['צ\'אט', 'בוט', 'תור', 'שיחה', 'מהיר'],
      targetPage: 'book-chat',
      actionLabel: 'פתח צ\'אט'
    },
    {
      id: 'search_minimal',
      title: 'קביעת תור מהירה ב-3 קליקים',
      category: 'דף קביעת תור',
      description: 'ממשק הזמנה מקוצר ונקי במיוחד, מושלם לסלולר',
      tags: ['3 קליקים', 'מהיר', 'סלולר', 'תור', 'קצר'],
      targetPage: 'book-minimal',
      actionLabel: 'הזמן ב-3 קליקים'
    },
    {
      id: 'search_prices',
      title: 'מחירון ושירותי פרימיום',
      category: 'מחירון',
      description: 'פירוט כל סוגי התספורות, עיצובי הזקן וטיפולי הספא',
      tags: ['מחירון', 'מחיר', 'עלות', 'שירותים', 'תספורת', 'זקן', 'ספא'],
      targetPage: 'services',
      actionLabel: 'צפה במחירון'
    },
    {
      id: 'search_admin',
      title: 'אזור מנהל ודשבורד (Admin Panel)',
      category: 'ניהול',
      description: 'ניהול תורים בזמן אמת, שינוי מועדים, דוחות וסנכרון',
      tags: ['אדמין', 'מנהל', 'דשבורד', 'ניהול', 'תורים', 'יומן מנהל'],
      targetPage: 'admin',
      actionLabel: 'מעבר לדשבורד',
      badge: 'אדמין'
    },
    {
      id: 'search_capabilities',
      title: 'מרכז היכולות והאוטומציות',
      category: 'יכולות',
      description: 'סקירת כל היכולות הטכנולוגיות, סנכרון בלייב ומנויים',
      tags: ['יכולות', 'דמו', 'אוטומציה', 'מנוי', 'סנכרון'],
      targetPage: 'capabilities',
      actionLabel: 'צפה ביכולות'
    }
  ]
};
