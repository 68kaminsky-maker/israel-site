// הדגמה: מנהל האפליקציות. כל הנתונים כאן מומצאים.
window.BLUEPRINT = {
  id: 'demo-apps',
  name: 'מנהל האפליקציות · הדגמה',
  purpose: 'מקום אחד שמראה אם כל אפליקציה עונה, כמה אנשים נכנסו אליה וכמה כניסות נכשלו.',
  owner: 'מנהל המערכות',
  style: 'bold-dark',
  styleOptions: ['bold-dark', 'clean-pro', 'soft-air'],
  brand: { accent: '#19ABBA', logo: '' },
  cover: '',
  roles: [{ id: 'owner', label: 'מנהל המערכות', can: 'רואה ועורך הכל' }],

  tables: [
    {
      id: 'apps', label: 'אפליקציות', item: 'אפליקציה', icon: 'chart',
      title: 'name', subtitle: 'kind', status: 'status', date: 'last', board: true,
      fields: [
        { id: 'name', label: 'שם האפליקציה', type: 'text', required: true },
        { id: 'kind', label: 'סוג', type: 'select', options: ['מכירות', 'ניהול', 'לקוחות', 'פנימית'] },
        { id: 'opens', label: 'פתיחות ב-7 ימים', type: 'number' },
        { id: 'people', label: 'אנשים פעילים', type: 'number' },
        { id: 'failed', label: 'כניסות שנכשלו ב-24 שעות', type: 'number' },
        { id: 'last', label: 'נפתחה לאחרונה', type: 'datetime' },
        { id: 'status', label: 'מצב', type: 'status', options: [
          { v: 'עונה', color: 'green' }, { v: 'תקלה', color: 'red' }, { v: 'מושהית', color: 'gray', done: true }
        ] }
      ]
    },
    {
      id: 'alerts', label: 'התראות', item: 'התראה', icon: 'list',
      title: 'msg', subtitle: 'app', status: 'status', date: 'when',
      fields: [
        { id: 'app', label: 'אפליקציה', type: 'relation', table: 'apps', required: true },
        { id: 'msg', label: 'מה קרה', type: 'text', required: true },
        { id: 'when', label: 'מתי', type: 'datetime' },
        { id: 'status', label: 'סטטוס', type: 'status', options: [
          { v: 'חדשה', color: 'red' }, { v: 'בטיפול', color: 'yellow' }, { v: 'טופלה', color: 'green', done: true }
        ] }
      ]
    }
  ],

  dashboard: {
    kpis: [
      { label: 'אפליקציות שעונות', table: 'apps', count: { status: 'עונה' } },
      { label: 'אפליקציות בתקלה', table: 'apps', count: { status: 'תקלה' } },
      { label: 'התראות חדשות', table: 'alerts', count: { status: 'חדשה' } },
      { label: 'התראות בטיפול', table: 'alerts', count: { status: 'בטיפול' } }
    ],
    focus: { table: 'alerts', where: { status: 'חדשה' }, label: 'מחכות לטיפול' },
    upcoming: { table: 'apps', field: 'last', days: 1 }
  },

  automations: [{ label: 'ייצוא כל טבלה לאקסל בלחיצה', status: 'פעיל' }],
  publicForms: [],

  samples: {
    apps: [
      { id: 'a1', name: 'אפליקציית מכירות', kind: 'מכירות', opens: 412, people: 9, failed: 0, last: 'today 10:12', status: 'עונה' },
      { id: 'a2', name: 'מערכת הזמנות', kind: 'לקוחות', opens: 268, people: 14, failed: 2, last: 'today 09:48', status: 'עונה' },
      { id: 'a3', name: 'לוח משימות', kind: 'פנימית', opens: 190, people: 6, failed: 0, last: 'today 08:30', status: 'עונה' },
      { id: 'a4', name: 'מנהל מלאי', kind: 'ניהול', opens: 96, people: 4, failed: 11, last: '-1d 17:05', status: 'תקלה' },
      { id: 'a5', name: 'פורטל לקוחות', kind: 'לקוחות', opens: 34, people: 3, failed: 0, last: '-2d 12:40', status: 'מושהית' }
    ],
    alerts: [
      { id: 'n1', app: 'a4', msg: 'ריבוי כניסות שנכשלו', when: 'today 07:55', status: 'חדשה' },
      { id: 'n2', app: 'a4', msg: 'האפליקציה לא ענתה לבדיקה', when: 'today 07:50', status: 'חדשה' },
      { id: 'n3', app: 'a2', msg: 'שתי כניסות נכשלו בשעה האחרונה', when: 'today 09:20', status: 'בטיפול' },
      { id: 'n4', app: 'a1', msg: 'חזרה לפעול אחרי הפסקה קצרה', when: '-2d 14:10', status: 'טופלה' }
    ]
  }
};
