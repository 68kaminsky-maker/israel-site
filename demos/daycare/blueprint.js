// הדגמה: ניהול מעון. כל הנתונים כאן מומצאים: שמות פרטיים בדויים ומספרי טלפון שאינם אמיתיים.
window.BLUEPRINT = {
  id: 'demo-daycare',
  name: 'ניהול מעון · הדגמה',
  purpose: 'רישום ילדים, בקשות חדשות והזמנות להורים. רואים מי ממתין לתשובה ומי כבר רשום.',
  owner: 'מנהלת המעון',
  style: 'clean-pro',
  styleOptions: ['clean-pro', 'soft-air', 'bold-dark'],
  brand: { accent: '#0F9D8A', logo: '' },
  cover: '',
  roles: [{ id: 'owner', label: 'מנהלת המעון', can: 'רואה ועורכת הכל' }],

  tables: [
    {
      id: 'registrations', label: 'בקשות רישום', item: 'בקשה', icon: 'file',
      title: 'parent', subtitle: 'child', status: 'status', date: 'sent', board: true,
      fields: [
        { id: 'parent', label: 'שם ההורה', type: 'text', required: true },
        { id: 'phone', label: 'טלפון', type: 'phone', required: true },
        { id: 'child', label: 'שם הילד או הילדה', type: 'text' },
        { id: 'age', label: 'גיל בחודשים', type: 'number' },
        { id: 'sent', label: 'תאריך בקשה', type: 'date' },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'חדשה', color: 'red' }, { v: 'נוצר קשר', color: 'yellow' }, { v: 'אושרה', color: 'green', done: true }, { v: 'לא התקבלה', color: 'gray', done: true }
        ] }
      ]
    },
    {
      id: 'children', label: 'ילדים', item: 'ילד', icon: 'users',
      title: 'name', subtitle: 'group', status: 'status',
      fields: [
        { id: 'name', label: 'שם פרטי', type: 'text', required: true },
        { id: 'group', label: 'קבוצה', type: 'select', options: ['פעוטות', 'גן קטן', 'גן גדול'] },
        { id: 'parent', label: 'שם ההורה', type: 'text' },
        { id: 'phone', label: 'טלפון', type: 'phone' },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'רשום', color: 'green' }, { v: 'ממתין', color: 'yellow' }, { v: 'הפסיק', color: 'gray', done: true }
        ] }
      ]
    },
    {
      id: 'orders', label: 'הזמנות להורים', item: 'הזמנה', icon: 'wallet',
      title: 'what', subtitle: 'parent', status: 'status', date: 'when', money: 'amount',
      fields: [
        { id: 'parent', label: 'שם ההורה', type: 'text', required: true },
        { id: 'what', label: 'מה הוזמן', type: 'text', required: true },
        { id: 'amount', label: 'סכום', type: 'money' },
        { id: 'when', label: 'תאריך', type: 'date' },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'ממתינה', color: 'yellow' }, { v: 'שולמה', color: 'green', done: true }
        ] }
      ]
    }
  ],

  dashboard: {
    kpis: [
      { label: 'בקשות חדשות', table: 'registrations', count: { status: 'חדשה' } },
      { label: 'ממתינים לשיחה', table: 'registrations', count: { status: 'נוצר קשר' } },
      { label: 'ילדים רשומים', table: 'children', count: { status: 'רשום' } },
      { label: 'הזמנות ממתינות', table: 'orders', count: { status: 'ממתינה' } }
    ],
    focus: { table: 'registrations', where: { status: 'חדשה' }, label: 'בקשות שמחכות לתשובה' },
    upcoming: { table: 'orders', field: 'when', days: 7 }
  },

  automations: [{ label: 'ייצוא כל טבלה לאקסל בלחיצה', status: 'פעיל' }],
  publicForms: [],

  samples: {
    registrations: [
      { id: 'g1', parent: 'דנית', phone: '050-5550201', child: 'נוי', age: 14, sent: 'today', status: 'חדשה' },
      { id: 'g2', parent: 'אסף', phone: '052-5550202', child: 'איתן', age: 20, sent: '-1d', status: 'חדשה' },
      { id: 'g3', parent: 'הילה', phone: '054-5550203', child: 'מאיה', age: 11, sent: '-2d', status: 'נוצר קשר' },
      { id: 'g4', parent: 'גיל', phone: '053-5550204', child: 'אורי', age: 26, sent: '-4d', status: 'נוצר קשר' },
      { id: 'g5', parent: 'שרון', phone: '058-5550205', child: 'תמר', age: 17, sent: '-6d', status: 'אושרה' },
      { id: 'g6', parent: 'יובל', phone: '050-5550206', child: 'דור', age: 22, sent: '-9d', status: 'אושרה' }
    ],
    children: [
      { id: 'c1', name: 'שיר', group: 'פעוטות', parent: 'רינת', phone: '050-5550301', status: 'רשום' },
      { id: 'c2', name: 'רן', group: 'גן קטן', parent: 'עומר', phone: '052-5550302', status: 'רשום' },
      { id: 'c3', name: 'נועם', group: 'גן קטן', parent: 'מיכל', phone: '054-5550303', status: 'רשום' },
      { id: 'c4', name: 'ליה', group: 'גן גדול', parent: 'אלעד', phone: '053-5550304', status: 'רשום' },
      { id: 'c5', name: 'אביב', group: 'פעוטות', parent: 'קרן', phone: '058-5550305', status: 'ממתין' },
      { id: 'c6', name: 'טל', group: 'גן גדול', parent: 'ניר', phone: '050-5550306', status: 'רשום' }
    ],
    orders: [
      { id: 'h1', parent: 'רינת', what: 'חוג מוזיקה, חודש', amount: 180, when: '+2d', status: 'ממתינה' },
      { id: 'h2', parent: 'עומר', what: 'ארוחות נוספות, שבוע', amount: 120, when: '+4d', status: 'ממתינה' },
      { id: 'h3', parent: 'מיכל', what: 'חוג מוזיקה, חודש', amount: 180, when: '-3d', status: 'שולמה' },
      { id: 'h4', parent: 'אלעד', what: 'יום כיף, השתתפות', amount: 60, when: '-5d', status: 'שולמה' }
    ]
  }
};
