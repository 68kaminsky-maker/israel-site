// מבנה המערכת. הפורמט המלא: library/blueprint-format.md
window.BLUEPRINT = {
  id: 'demo-clients',
  name: 'ניהול לקוחות · הדגמה',
  purpose: 'כל הלקוחות, הפרויקטים והצעות המחיר במקום אחד, במקום וואטסאפ מתבלגן. רואים מי מחכה לתשובה, וחוזרים לכל אחד בזמן.',
  owner: 'ישראל',
  style: 'bold-dark',
  styleOptions: ['bold-dark', 'clean-pro', 'soft-air'],
  brand: { accent: '#F9B914', logo: 'logo.svg' },
  cover: '',

  roles: [
    { id: 'owner', label: 'ישראל, בעל העסק', can: 'רואה ועורך הכל, מייצא לאקסל ומנהל את ההגדרות' }
  ],

  tables: [
    {
      id: 'customers', label: 'לקוחות ולידים', item: 'לקוח', icon: 'users',
      title: 'name', subtitle: 'business', status: 'status', date: 'follow',
      board: true,
      fields: [
        { id: 'name', label: 'שם', type: 'text', required: true },
        { id: 'phone', label: 'טלפון', type: 'phone', required: true },
        { id: 'email', label: 'מייל', type: 'email' },
        { id: 'business', label: 'שם העסק', type: 'text' },
        { id: 'source', label: 'הגיע מ', type: 'select', options: ['וואטסאפ', 'המלצה', 'אתר', 'פייסבוק', 'לינקדאין'] },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'חדש', color: 'red' },
          { v: 'בשיחה', color: 'yellow' },
          { v: 'הצעת מחיר', color: 'blue' },
          { v: 'נסגר', color: 'green', done: true },
          { v: 'לא רלוונטי', color: 'gray', done: true }
        ] },
        { id: 'follow', label: 'לחזור אליו ב', type: 'date' },
        { id: 'notes', label: 'הערות', type: 'longtext' }
      ]
    },
    {
      id: 'projects', label: 'פרויקטים', item: 'פרויקט', icon: 'wrench',
      title: 'name', subtitle: 'customer', status: 'status', date: 'due', money: 'price',
      board: true,
      fields: [
        { id: 'customer', label: 'לקוח', type: 'relation', table: 'customers', required: true },
        { id: 'name', label: 'שם הפרויקט', type: 'text', required: true },
        { id: 'kind', label: 'סוג עבודה', type: 'select', options: ['אתר', 'מערכת', 'אוטומציה', 'אפליקציה', 'תחזוקה'] },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'לפני התחלה', color: 'red' },
          { v: 'בעבודה', color: 'yellow' },
          { v: 'מחכה ללקוח', color: 'blue' },
          { v: 'הושלם', color: 'green' },
          { v: 'שולם', color: 'teal', done: true }
        ] },
        { id: 'due', label: 'תאריך יעד', type: 'date' },
        { id: 'price', label: 'מחיר', type: 'money' },
        { id: 'notes', label: 'הערות', type: 'longtext' }
      ]
    },
    {
      id: 'quotes', label: 'הצעות מחיר', item: 'הצעה', icon: 'file',
      title: 'title', subtitle: 'customer', status: 'status', date: 'sent', money: 'amount',
      board: true,
      fields: [
        { id: 'customer', label: 'לקוח', type: 'relation', table: 'customers', required: true },
        { id: 'title', label: 'על מה ההצעה', type: 'text', required: true },
        { id: 'amount', label: 'סכום', type: 'money' },
        { id: 'sent', label: 'תאריך שליחה', type: 'date' },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'בהכנה', color: 'gray' },
          { v: 'נשלחה', color: 'yellow' },
          { v: 'אושרה', color: 'green', done: true },
          { v: 'נדחתה', color: 'red', done: true }
        ] },
        { id: 'notes', label: 'הערות', type: 'longtext' }
      ]
    },
    {
      id: 'calls', label: 'שיחות', item: 'שיחה', icon: 'list',
      title: 'summary', subtitle: 'customer', status: 'channel', date: 'when',
      fields: [
        { id: 'customer', label: 'לקוח', type: 'relation', table: 'customers', required: true },
        { id: 'when', label: 'מתי', type: 'datetime' },
        { id: 'channel', label: 'איפה דיברנו', type: 'select', options: ['טלפון', 'וואטסאפ', 'פגישה', 'מייל'] },
        { id: 'summary', label: 'סיכום קצר', type: 'text', required: true },
        { id: 'next', label: 'מה צריך לעשות אחר כך', type: 'longtext' }
      ]
    }
  ],

  dashboard: {
    kpis: [
      { label: 'לידים חדשים', table: 'customers', count: { status: 'חדש' } },
      { label: 'מחכים לתשובה', table: 'quotes', count: { status: 'נשלחה' } },
      { label: 'פרויקטים בעבודה', table: 'projects', count: { status: 'בעבודה' } },
      { label: 'הכנסות החודש', table: 'projects', sum: 'price', where: { status: 'שולם' }, period: 'month' }
    ],
    focus: { table: 'quotes', where: { status: 'נשלחה' }, label: 'הצעות שמחכות לתשובה' },
    upcoming: { table: 'customers', field: 'follow', days: 7 }
  },

  automations: [
    { label: 'ייצוא כל טבלה לאקסל בלחיצה', status: 'פעיל' },
    { label: 'תזכורת בדשבורד: מי צריך שיחה חוזרת היום', status: 'פעיל' },
    { label: 'הודעת וואטסאפ מוכנה ללקוח שמחכה להצעה', status: 'בהמשך' },
    { label: 'סיכום שבועי: כמה לידים נכנסו וכמה נסגרו', status: 'בהמשך' }
  ],

  publicForms: [],

  samples: {
    customers: [
      { id: 'c1', name: 'דנה אברמוב', phone: '050-1234567', email: 'dana@example.com', business: 'קליניקת פיזיותרפיה', source: 'המלצה', status: 'חדש', follow: 'today' },
      { id: 'c2', name: 'יוסי כהן', phone: '052-7654321', business: 'מוסך כהן', source: 'וואטסאפ', status: 'בשיחה', follow: '+1d' },
      { id: 'c3', name: 'מיכל לוי', phone: '054-1112233', business: 'סטודיו לעיצוב פנים', source: 'אתר', status: 'הצעת מחיר', follow: '+2d' },
      { id: 'c4', name: 'אבי מזרחי', phone: '053-4445566', business: 'חברת הובלות', source: 'פייסבוק', status: 'הצעת מחיר', follow: '+4d' },
      { id: 'c5', name: 'שירה גולן', phone: '058-9998877', business: 'מאפיית השכונה', source: 'לינקדאין', status: 'נסגר' },
      { id: 'c6', name: 'משה ביטון', phone: '050-3332211', business: 'משרד רואי חשבון', source: 'המלצה', status: 'נסגר' },
      { id: 'c7', name: 'נועה פרץ', phone: '052-6667788', business: 'חנות בגדים', source: 'אתר', status: 'חדש', follow: 'today' },
      { id: 'c8', name: 'אלון שמעוני', phone: '054-2223344', business: 'מכון כושר', source: 'וואטסאפ', status: 'לא רלוונטי' }
    ],
    projects: [
      { id: 'p1', customer: 'c5', name: 'אתר תדמית למאפייה', kind: 'אתר', status: 'שולם', due: '-5d', price: 4500 },
      { id: 'p2', customer: 'c6', name: 'מערכת ניהול לקוחות למשרד', kind: 'מערכת', status: 'בעבודה', due: '+9d', price: 9000 },
      { id: 'p3', customer: 'c6', name: 'אוטומציה לשליחת חשבוניות', kind: 'אוטומציה', status: 'מחכה ללקוח', due: '+3d', price: 2500 },
      { id: 'p4', customer: 'c5', name: 'תחזוקה חודשית', kind: 'תחזוקה', status: 'שולם', due: '-1d', price: 600 },
      { id: 'p5', customer: 'c3', name: 'אתר לסטודיו', kind: 'אתר', status: 'לפני התחלה', due: '+20d', price: 6000 },
      { id: 'p6', customer: 'c2', name: 'אפליקציה לקביעת תורים', kind: 'אפליקציה', status: 'הושלם', due: '-2d', price: 7500 }
    ],
    quotes: [
      { id: 'q1', customer: 'c3', title: 'אתר תדמית לסטודיו', amount: 6000, sent: '-2d', status: 'נשלחה' },
      { id: 'q2', customer: 'c4', title: 'מערכת הזמנות להובלות', amount: 11000, sent: '-4d', status: 'נשלחה' },
      { id: 'q3', customer: 'c2', title: 'אפליקציה לקביעת תורים', amount: 7500, sent: '-12d', status: 'אושרה' },
      { id: 'q4', customer: 'c8', title: 'אתר למכון כושר', amount: 5000, sent: '-20d', status: 'נדחתה' },
      { id: 'q5', customer: 'c1', title: 'דף נחיתה לקליניקה', amount: 3200, sent: 'today', status: 'בהכנה' }
    ],
    calls: [
      { id: 'k1', customer: 'c1', when: 'today 09:30', channel: 'טלפון', summary: 'התקשרה, רוצה דף נחיתה לקליניקה', next: 'לשלוח הצעת מחיר עד מחר' },
      { id: 'k2', customer: 'c2', when: '-1d 17:00', channel: 'וואטסאפ', summary: 'שלח צילומי מסך של המערכת הנוכחית', next: 'לבדוק ולחזור אליו' },
      { id: 'k3', customer: 'c3', when: '-2d 11:00', channel: 'פגישה', summary: 'פגישת היכרות, אהבה את הסגנון הכהה', next: 'מחכה לתשובה להצעה' },
      { id: 'k4', customer: 'c4', when: '-4d 14:15', channel: 'מייל', summary: 'ביקש מחיר למערכת הזמנות', next: 'לחזור אליו אם לא יענה' },
      { id: 'k5', customer: 'c6', when: '-3d 10:00', channel: 'טלפון', summary: 'עדכון התקדמות על המערכת', next: 'לשלוח לו גרסה לבדיקה' },
      { id: 'k6', customer: 'c7', when: 'today 12:00', channel: 'וואטסאפ', summary: 'פנתה דרך האתר, רוצה חנות אונליין', next: 'לקבוע שיחה' }
    ]
  }
};

