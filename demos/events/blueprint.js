// הדגמה: אירועים ותשלומים. כל הנתונים כאן מומצאים.
window.BLUEPRINT = {
  id: 'demo-events',
  name: 'אירועים ותשלומים · הדגמה',
  purpose: 'כל האירועים והתשלומים שלהם במקום אחד. רואים מי שילם, מי מאחר ומה צריך לגבות השבוע.',
  owner: 'מפיקה',
  style: 'soft-air',
  styleOptions: ['soft-air', 'clean-pro', 'bold-dark'],
  brand: { accent: '#5B5BD6', logo: '' },
  cover: '',
  roles: [{ id: 'owner', label: 'מפיקה', can: 'רואה ועורכת הכל' }],

  tables: [
    {
      id: 'events', label: 'אירועים', item: 'אירוע', icon: 'calendar',
      title: 'name', subtitle: 'place', status: 'status', date: 'when', money: 'price', board: true,
      fields: [
        { id: 'name', label: 'שם האירוע', type: 'text', required: true },
        { id: 'place', label: 'מקום', type: 'text' },
        { id: 'when', label: 'מתי', type: 'datetime' },
        { id: 'guests', label: 'מספר אורחים', type: 'number' },
        { id: 'price', label: 'מחיר כולל', type: 'money' },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'בתכנון', color: 'yellow' }, { v: 'אושר', color: 'blue' }, { v: 'התקיים', color: 'green', done: true }
        ] }
      ]
    },
    {
      id: 'payments', label: 'תשלומים', item: 'תשלום', icon: 'wallet',
      title: 'note', subtitle: 'event', status: 'status', date: 'due', money: 'amount',
      fields: [
        { id: 'event', label: 'אירוע', type: 'relation', table: 'events', required: true },
        { id: 'note', label: 'מה משלמים', type: 'text', required: true },
        { id: 'amount', label: 'סכום', type: 'money' },
        { id: 'due', label: 'לתשלום עד', type: 'date' },
        { id: 'method', label: 'אמצעי תשלום', type: 'select', options: ['אשראי', 'העברה', 'ביט', 'מזומן'] },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'ממתין', color: 'yellow' }, { v: 'באיחור', color: 'red' }, { v: 'שולם', color: 'green', done: true }
        ] }
      ]
    }
  ],

  dashboard: {
    kpis: [
      { label: 'אירועים מאושרים', table: 'events', count: { status: 'אושר' } },
      { label: 'ממתינים לתשלום', table: 'payments', count: { status: 'ממתין' } },
      { label: 'תשלומים באיחור', table: 'payments', count: { status: 'באיחור' } },
      { label: 'נגבה החודש', table: 'payments', sum: 'amount', where: { status: 'שולם' }, period: 'month' }
    ],
    focus: { table: 'payments', where: { status: 'באיחור' }, label: 'תשלומים באיחור' },
    upcoming: { table: 'events', field: 'when', days: 14 }
  },

  automations: [{ label: 'ייצוא כל טבלה לאקסל בלחיצה', status: 'פעיל' }],
  publicForms: [],

  samples: {
    events: [
      { id: 'e1', name: 'חתונה, אולם הגן', place: 'אולם גדול', when: '+6d 19:30', guests: 220, price: 86000, status: 'אושר' },
      { id: 'e2', name: 'בר מצווה', place: 'אולם קטן', when: '+11d 18:00', guests: 120, price: 42000, status: 'אושר' },
      { id: 'e3', name: 'יום הולדת חמישים', place: 'גן אירועים', when: '+19d 20:00', guests: 70, price: 24500, status: 'בתכנון' },
      { id: 'e4', name: 'ערב חברה', place: 'אולם קטן', when: '+25d 19:00', guests: 90, price: 31000, status: 'בתכנון' },
      { id: 'e5', name: 'ברית', place: 'אולם קטן', when: '-6d 12:00', guests: 60, price: 15500, status: 'התקיים' }
    ],
    payments: [
      { id: 'y1', event: 'e1', note: 'מקדמה', amount: 25000, due: '-12d', method: 'העברה', status: 'שולם' },
      { id: 'y2', event: 'e1', note: 'תשלום שני', amount: 30000, due: '-2d', method: 'העברה', status: 'באיחור' },
      { id: 'y3', event: 'e1', note: 'יתרה', amount: 31000, due: '+4d', method: 'אשראי', status: 'ממתין' },
      { id: 'y4', event: 'e2', note: 'מקדמה', amount: 12000, due: '-5d', method: 'ביט', status: 'שולם' },
      { id: 'y5', event: 'e2', note: 'יתרה', amount: 30000, due: '+9d', method: 'אשראי', status: 'ממתין' },
      { id: 'y6', event: 'e3', note: 'מקדמה', amount: 6000, due: '+3d', method: 'ביט', status: 'ממתין' },
      { id: 'y7', event: 'e5', note: 'יתרה', amount: 9500, due: '-7d', method: 'אשראי', status: 'שולם' }
    ]
  }
};
