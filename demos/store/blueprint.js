// הדגמה: ניהול חנות. כל הנתונים כאן מומצאים.
window.BLUEPRINT = {
  id: 'demo-store',
  name: 'ניהול חנות · הדגמה',
  purpose: 'מלאי, הזמנות וחשבוניות ספקים במקום אחד. רואים מה אוזל, מה מחכה למשלוח ומה צריך לשלם השבוע.',
  owner: 'בעל החנות',
  style: 'clean-pro',
  styleOptions: ['clean-pro', 'soft-air', 'bold-dark'],
  brand: { accent: '#8B2252', logo: '' },
  cover: '',
  roles: [{ id: 'owner', label: 'בעל החנות', can: 'רואה ועורך הכל' }],

  tables: [
    {
      id: 'orders', label: 'הזמנות', item: 'הזמנה', icon: 'list',
      title: 'who', subtitle: 'items', status: 'status', date: 'when', money: 'total', board: true,
      fields: [
        { id: 'who', label: 'שם', type: 'text', required: true },
        { id: 'phone', label: 'טלפון', type: 'phone' },
        { id: 'items', label: 'מה הוזמן', type: 'text' },
        { id: 'total', label: 'סכום', type: 'money' },
        { id: 'when', label: 'מתי', type: 'datetime' },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'חדשה', color: 'red' }, { v: 'בהכנה', color: 'yellow' }, { v: 'נשלחה', color: 'blue' }, { v: 'נמסרה', color: 'green', done: true }
        ] }
      ]
    },
    {
      id: 'products', label: 'מוצרים', item: 'מוצר', icon: 'box',
      title: 'name', subtitle: 'category', status: 'stock', money: 'price',
      fields: [
        { id: 'name', label: 'שם המוצר', type: 'text', required: true },
        { id: 'category', label: 'סוג', type: 'select', options: ['אדום', 'לבן', 'רוזה', 'מבעבע'] },
        { id: 'price', label: 'מחיר', type: 'money' },
        { id: 'qty', label: 'כמות במלאי', type: 'number' },
        { id: 'stock', label: 'מצב מלאי', type: 'status', options: [
          { v: 'במלאי', color: 'green' }, { v: 'מלאי נמוך', color: 'orange' }, { v: 'אזל', color: 'red' }
        ] }
      ]
    },
    {
      id: 'invoices', label: 'חשבוניות ספקים', item: 'חשבונית', icon: 'file',
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
      { label: 'הזמנות חדשות', table: 'orders', count: { status: 'חדשה' } },
      { label: 'מלאי נמוך', table: 'products', count: { stock: 'מלאי נמוך' } },
      { label: 'חשבוניות ממתינות', table: 'invoices', count: { status: 'ממתינה' } },
      { label: 'מכירות החודש', table: 'orders', sum: 'total', where: { status: 'נמסרה' }, period: 'month' }
    ],
    focus: { table: 'orders', where: { status: 'חדשה' }, label: 'הזמנות שמחכות לטיפול' },
    upcoming: { table: 'invoices', field: 'due', days: 7 }
  },

  automations: [{ label: 'ייצוא כל טבלה לאקסל בלחיצה', status: 'פעיל' }],
  publicForms: [],

  samples: {
    orders: [
      { id: 'o1', who: 'ליאור', phone: '050-5550101', items: 'שלוש בקבוקי אדום ובקבוק מבעבע', total: 540, when: 'today 09:40', status: 'חדשה' },
      { id: 'o2', who: 'נעמה', phone: '052-5550102', items: 'מארז מתנה, שני בקבוקים', total: 390, when: 'today 11:15', status: 'חדשה' },
      { id: 'o3', who: 'עידו', phone: '054-5550103', items: 'ארגז של שישה בקבוקי לבן', total: 960, when: '-1d 16:00', status: 'בהכנה' },
      { id: 'o4', who: 'מיה', phone: '050-5550104', items: 'רוזה, ארבעה בקבוקים', total: 420, when: '-1d 12:30', status: 'נשלחה' },
      { id: 'o5', who: 'אורי', phone: '053-5550105', items: 'אדום יבש, שני בקבוקים', total: 310, when: '-2d 18:20', status: 'נמסרה' },
      { id: 'o6', who: 'תמר', phone: '058-5550106', items: 'מארז לאירוח, שמונה בקבוקים', total: 1280, when: '-3d 10:00', status: 'נמסרה' },
      { id: 'o7', who: 'רן', phone: '052-5550107', items: 'מבעבע, שלושה בקבוקים', total: 450, when: '-4d 14:45', status: 'נמסרה' }
    ],
    products: [
      { id: 'p1', name: 'אדום יבש, בקבוק 750', category: 'אדום', price: 105, qty: 48, stock: 'במלאי' },
      { id: 'p2', name: 'לבן חצי יבש, בקבוק 750', category: 'לבן', price: 98, qty: 34, stock: 'במלאי' },
      { id: 'p3', name: 'רוזה קליל, בקבוק 750', category: 'רוזה', price: 89, qty: 6, stock: 'מלאי נמוך' },
      { id: 'p4', name: 'מבעבע, בקבוק 750', category: 'מבעבע', price: 150, qty: 5, stock: 'מלאי נמוך' },
      { id: 'p5', name: 'אדום בשל, מהדורה מיוחדת', category: 'אדום', price: 190, qty: 0, stock: 'אזל' },
      { id: 'p6', name: 'לבן יבש, בקבוק 750', category: 'לבן', price: 110, qty: 27, stock: 'במלאי' }
    ],
    invoices: [
      { id: 'i1', supplier: 'ספק א׳', note: 'משלוח שבועי', amount: 4200, due: '+2d', status: 'ממתינה' },
      { id: 'i2', supplier: 'ספק ב׳', note: 'מארזי מתנה', amount: 1650, due: '+5d', status: 'ממתינה' },
      { id: 'i3', supplier: 'חברת שילוח', note: 'משלוחים לחודש', amount: 980, due: '-3d', status: 'שולמה' },
      { id: 'i4', supplier: 'ספק ג׳', note: 'הזמנה חודשית', amount: 5400, due: '-6d', status: 'שולמה' }
    ]
  }
};
