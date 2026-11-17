// מבנה המערכת. הפורמט המלא: library/blueprint-format.md
window.BLUEPRINT = {
  id: 'gate-agents',
  name: 'שער · סוכנים',
  purpose: 'כל סוכן מקבל קוד אישי קצר, מקליד אותו והשער נפתח, גם בחמש בבוקר. אתה שולט מי נכנס, מתי ומי ניסה.',
  owner: 'ישראל',
  style: 'bold-dark',
  styleOptions: ['bold-dark', 'clean-pro', 'soft-air'],
  brand: { accent: '#F9B914', logo: '' },
  cover: '',

  roles: [
    { id: 'owner', label: 'בעל העסק', can: 'רואה ועורך הכל: מוסיף קודים, משהה, מוחק ורואה את יומן הכניסות' }
  ],

  tables: [
    {
      id: 'agents', label: 'סוכנים', item: 'סוכן', icon: 'users',
      title: 'name', subtitle: 'code', status: 'status',
      fields: [
        { id: 'name', label: 'שם הסוכן', type: 'text', required: true },
        { id: 'code', label: 'קוד כניסה (4 עד 6 ספרות)', type: 'text', required: true, unique: true, digits: [4, 6], randomCode: 6 },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'פעיל', color: 'green' },
          { v: 'מושהה', color: 'yellow' },
          { v: 'חסום', color: 'gray', done: true }
        ] },
        { id: 'days', label: 'באילו ימים מותר (ריק = כל הימים)', type: 'select', options: ['כל הימים', 'ימים א׳–ה׳', 'ימים א׳–ו׳'] },
        { id: 'from', label: 'משעה, למשל 04:30 (ריק = ללא הגבלה)', type: 'text' },
        { id: 'to', label: 'עד שעה, למשל 07:00 (ריק = ללא הגבלה)', type: 'text' },
        { id: 'until', label: 'תוקף הקוד עד תאריך (ריק = ללא הגבלה)', type: 'date' },
        { id: 'oneTime', label: 'קוד חד-פעמי: נפסל אחרי פתיחה אחת', type: 'checkbox' },
        { id: 'phone', label: 'טלפון', type: 'phone' },
        { id: 'company', label: 'חברה או סוכנות', type: 'text' },
        { id: 'notes', label: 'הערות', type: 'longtext' }
      ]
    },
    {
      id: 'log', label: 'יומן כניסות', item: 'כניסה', icon: 'clock',
      title: 'agentName', subtitle: 'note', status: 'result', date: 'when',
      fields: [
        { id: 'agentName', label: 'מי', type: 'text', required: true },
        { id: 'result', label: 'תוצאה', type: 'status', options: [
          { v: 'נפתח', color: 'green', done: true },
          { v: 'מחוץ לשעות', color: 'yellow', done: true },
          { v: 'נדחה', color: 'red', done: true }
        ] },
        { id: 'when', label: 'מתי', type: 'datetime' },
        { id: 'note', label: 'פירוט', type: 'text' },
        { id: 'ip', label: 'מזהה מכשיר מקוצר', type: 'text' }
      ]
    }
  ],

  dashboard: {
    kpis: [
      { label: 'פתיחות היום', table: 'log', where: { result: 'נפתח' }, period: 'today' },
      { label: 'סוכנים עם קוד פעיל', table: 'agents', count: { status: 'פעיל' } },
      { label: 'ניסיונות שנדחו היום', table: 'log', where: { result: ['נדחה', 'מחוץ לשעות'] }, period: 'today' },
      { label: 'קודים מושהים', table: 'agents', count: { status: 'מושהה' } }
    ],
    focus: { table: 'log', where: { result: 'נדחה' }, label: 'ניסיונות עם קוד שגוי' }
  },

  extraNav: [{ view: 'gate', label: 'שער', icon: 'gate' }],

  automations: [
    { label: 'סוכן מקליד קוד בדף אחד, והשער נפתח', status: 'פעיל' },
    { label: 'הגבלה לפי ימים ושעות לכל סוכן', status: 'פעיל' },
    { label: 'יומן של כל פתיחה וכל ניסיון שנדחה', status: 'פעיל' },
    { label: 'הודעת וואטסאפ מוכנה לסוכן עם הקוד והקישור', status: 'פעיל' },
    { label: 'חיבור לשער האמיתי ב-PalGate', status: 'בהמשך' }
  ],

  publicForms: [],

  samples: {
    agents: [
      { id: 'a1', name: 'אבי מלכה', code: '4821', status: 'פעיל', days: 'ימים א׳–ה׳', from: '04:30', to: '07:00', phone: '050-1234567', company: 'הובלות הצפון' },
      { id: 'a2', name: 'יוסי חדד', code: '7305', status: 'פעיל', days: 'ימים א׳–ה׳', from: '04:30', to: '07:00', phone: '052-7654321', company: 'הובלות הצפון' },
      { id: 'a3', name: 'מוטי אזולאי', code: '1593', status: 'פעיל', days: 'כל הימים', from: '05:00', to: '08:00', phone: '054-1112233', company: 'סחר ושינוע' },
      { id: 'a4', name: 'דני שרעבי', code: '6048', status: 'פעיל', days: 'ימים א׳–ו׳', from: '04:00', to: '09:00', phone: '053-4445566', company: 'סחר ושינוע' },
      { id: 'a5', name: 'רפי בן דוד', code: '2276', status: 'מושהה', days: 'ימים א׳–ה׳', from: '05:00', to: '07:00', phone: '058-9998877', company: 'משלוחי דרום', notes: 'הושהה עד סוף החודש' },
      { id: 'a6', name: 'שמעון לוי', code: '9917', status: 'פעיל', days: 'כל הימים', from: '00:00', to: '23:59', phone: '050-3332211', company: 'צוות פנימי' },
      { id: 'a7', name: 'אלי פרץ', code: '3384', status: 'חסום', days: 'ימים א׳–ה׳', from: '05:00', to: '07:00', phone: '052-6667788', company: 'משלוחי דרום' }
    ],
    log: [
      { id: 'l1', agentName: 'אבי מלכה', result: 'נפתח', when: 'today 04:52', note: 'דף הסוכנים' },
      { id: 'l2', agentName: 'יוסי חדד', result: 'נפתח', when: 'today 05:03', note: 'דף הסוכנים' },
      { id: 'l3', agentName: 'לא מזוהה', result: 'נדחה', when: 'today 05:10', note: 'קוד שגוי: 1111' },
      { id: 'l4', agentName: 'מוטי אזולאי', result: 'נפתח', when: 'today 05:21', note: 'דף הסוכנים' },
      { id: 'l5', agentName: 'רפי בן דוד', result: 'נדחה', when: 'today 05:34', note: 'הקוד מושהה' },
      { id: 'l6', agentName: 'דני שרעבי', result: 'נפתח', when: 'today 06:05', note: 'דף הסוכנים' },
      { id: 'l7', agentName: 'מוטי אזולאי', result: 'מחוץ לשעות', when: '-1d 22:40', note: 'מותר רק בין 05:00 ל-08:00' },
      { id: 'l8', agentName: 'אבי מלכה', result: 'נפתח', when: '-1d 04:47', note: 'דף הסוכנים' },
      { id: 'l9', agentName: 'יוסי חדד', result: 'נפתח', when: '-1d 05:12', note: 'דף הסוכנים' },
      { id: 'l10', agentName: 'שמעון לוי', result: 'נפתח', when: '-2d 14:20', note: 'פתיחה ידנית' }
    ]
  }
};
