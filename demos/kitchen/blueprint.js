// הדגמה: מטבח מוסדי. כל הנתונים כאן מומצאים.
window.BLUEPRINT = {
  id: 'demo-kitchen',
  name: 'מטבח מוסדי · הדגמה',
  purpose: 'מתכונים, ייצור יומי וחשבוניות במקום אחד. רואים מה מייצרים היום, כמה זה עולה למנה ומה צריך לשלם.',
  owner: 'מנהל המטבח',
  style: 'bold-dark',
  styleOptions: ['bold-dark', 'clean-pro', 'soft-air'],
  brand: { accent: '#FF8A3D', logo: '' },
  cover: '',
  roles: [{ id: 'owner', label: 'מנהל המטבח', can: 'רואה ועורך הכל' }],

  tables: [
    {
      id: 'production', label: 'ייצור יומי', item: 'ייצור', icon: 'wrench',
      title: 'label', subtitle: 'recipe', status: 'status', date: 'day', board: true,
      fields: [
        { id: 'label', label: 'ארוחה', type: 'text', required: true },
        { id: 'recipe', label: 'מתכון', type: 'relation', table: 'recipes', required: true },
        { id: 'portions', label: 'מספר מנות', type: 'number' },
        { id: 'day', label: 'יום', type: 'date' },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'מתוכנן', color: 'blue' }, { v: 'בייצור', color: 'yellow' }, { v: 'הושלם', color: 'green', done: true }
        ] }
      ]
    },
    {
      id: 'recipes', label: 'מתכונים', item: 'מתכון', icon: 'list',
      title: 'name', subtitle: 'category', status: 'state', money: 'cost',
      fields: [
        { id: 'name', label: 'שם המנה', type: 'text', required: true },
        { id: 'category', label: 'קטגוריה', type: 'select', options: ['מרקים', 'עיקריות', 'תוספות', 'קינוחים'] },
        { id: 'portions', label: 'מנות בקבוצה', type: 'number' },
        { id: 'cost', label: 'עלות למנה', type: 'money' },
        { id: 'state', label: 'מצב', type: 'status', options: [
          { v: 'טיוטה', color: 'gray' }, { v: 'מאושר', color: 'green' }
        ] },
        { id: 'notes', label: 'הערות', type: 'longtext' }
      ]
    },
    {
      id: 'invoices', label: 'חשבוניות', item: 'חשבונית', icon: 'file',
      title: 'supplier', subtitle: 'note', status: 'status', date: 'due', money: 'amount',
      fields: [
        { id: 'supplier', label: 'ספק', type: 'text', required: true },
        { id: 'note', label: 'על מה', type: 'text' },
        { id: 'amount', label: 'סכום', type: 'money' },
        { id: 'due', label: 'לתשלום עד', type: 'date' },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'ממתינה', color: 'yellow' }, { v: 'שולמה', color: 'green', done: true }
        ] }
      ]
    }
  ],

  dashboard: {
    kpis: [
      { label: 'בייצור עכשיו', table: 'production', count: { status: 'בייצור' } },
      { label: 'מתוכננים להיום', table: 'production', count: { status: 'מתוכנן' } },
      { label: 'מתכונים מאושרים', table: 'recipes', count: { state: 'מאושר' } },
      { label: 'הוצאות החודש', table: 'invoices', sum: 'amount', where: { status: 'שולמה' }, period: 'month' }
    ],
    focus: { table: 'production', where: { status: 'בייצור' }, label: 'מה מייצרים עכשיו' },
    upcoming: { table: 'invoices', field: 'due', days: 7 }
  },

  automations: [{ label: 'ייצוא כל טבלה לאקסל בלחיצה', status: 'פעיל' }],
  publicForms: [],

  samples: {
    recipes: [
      { id: 'r1', name: 'מרק ירקות', category: 'מרקים', portions: 80, cost: 3.2, state: 'מאושר' },
      { id: 'r2', name: 'חזה עוף בתנור', category: 'עיקריות', portions: 60, cost: 9.8, state: 'מאושר' },
      { id: 'r3', name: 'אורז עם ירקות', category: 'תוספות', portions: 100, cost: 2.1, state: 'מאושר' },
      { id: 'r4', name: 'קציצות בעגבניות', category: 'עיקריות', portions: 70, cost: 8.4, state: 'מאושר' },
      { id: 'r5', name: 'קומפוט פירות', category: 'קינוחים', portions: 90, cost: 1.9, state: 'טיוטה' },
      { id: 'r6', name: 'פירה תפוחי אדמה', category: 'תוספות', portions: 80, cost: 1.8, state: 'טיוטה' }
    ],
    production: [
      { id: 'd1', label: 'ארוחת צהריים', recipe: 'r2', portions: 60, day: 'today', status: 'בייצור' },
      { id: 'd2', label: 'ארוחת צהריים', recipe: 'r3', portions: 100, day: 'today', status: 'בייצור' },
      { id: 'd3', label: 'פתיחת יום', recipe: 'r1', portions: 80, day: 'today', status: 'הושלם' },
      { id: 'd4', label: 'ארוחת ערב', recipe: 'r4', portions: 70, day: 'today', status: 'מתוכנן' },
      { id: 'd5', label: 'ארוחת ערב', recipe: 'r6', portions: 80, day: 'today', status: 'מתוכנן' },
      { id: 'd6', label: 'קינוח', recipe: 'r5', portions: 90, day: '+1d', status: 'מתוכנן' }
    ],
    invoices: [
      { id: 'i1', supplier: 'ספק ירקות', note: 'הזמנה שבועית', amount: 3150, due: '+2d', status: 'ממתינה' },
      { id: 'i2', supplier: 'ספק בשר ועוף', note: 'הזמנה שבועית', amount: 7800, due: '+5d', status: 'ממתינה' },
      { id: 'i3', supplier: 'ספק יבשים', note: 'חודשי', amount: 4600, due: '-4d', status: 'שולמה' },
      { id: 'i4', supplier: 'ספק מוצרי ניקיון', note: 'חודשי', amount: 1250, due: '-8d', status: 'שולמה' }
    ]
  }
};
