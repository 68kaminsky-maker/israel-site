// מנוע המערכות של קלוד לעצלנים.
// קורא את window.BLUEPRINT (blueprint.js) ובונה ממנו מערכת מלאה, מובייל פירסט:
// דשבורד, רשימות עם חיפוש וסינון, לוח עמודות, כרטיס פרטים, טפסים, הגדרות וייצוא לאקסל.
// עם Supabase (config.js): כניסה במייל ושמירה בענן לפי צוות. בלי Supabase: מצב הדגמה בדפדפן.
// ?preview=1&theme=<סגנון> מציג את המערכת עם נתוני הדוגמה, בלי לשמור (משמש את blueprint.html).
(function () {
  'use strict';
  const BP = window.BLUEPRINT;
  const CFG = window.APP_CONFIG || {};
  const LIVE = Boolean(CFG.supabaseUrl && CFG.supabaseKey);
  const Q = new URLSearchParams(location.search);
  const PREVIEW = Q.has('preview');
  const STORE_KEY = 'lazy-app:' + BP.id;
  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
  const root = document.getElementById('app');

  const THEMES = {
    'clean-pro': { label: 'נקי ומקצועי', sw: ['#F4F5F7', '#FFFFFF', '#111827', '#2563EB'] },
    'bold-dark': { label: 'כהה ונועז', sw: ['#0C0C0F', '#18181D', '#F4F4F6', '#FFE14D'] },
    'soft-air': { label: 'רך ואוורירי', sw: ['#EEECF5', '#FFFFFF', '#1F1C2E', '#5B5BD6'] },
    'photo-immersive': { label: 'חווייתי ותמונתי', sw: ['#0E1714', '#1D3A30', '#F3F6F4', '#FFFFFF'] },
    'playful-blocks': { label: 'צבעוני ושמח', sw: ['#FFF9EF', '#FFE48A', '#E3DAFF', '#1C1B1F'] }
  };

  // ---------- אייקונים ----------
  const ICONS = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.2 14.6A6.5 6.5 0 0 1 21.5 20"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-2.5z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
    wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M16 13h2M3 10h18"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.2 6.2l2.1 2.1M17.7 15.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 17.8l2.1-2.1M17.7 8.3l2.1-2.1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    phone: '<path d="M5 4h3l1.5 4.5-2 1.2a11 11 0 0 0 6.8 6.8l1.2-2L20 16v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    chat: '<path d="M4 12a8 8 0 1 1 3.3 6.5L4 20l1.3-3.5A7.9 7.9 0 0 1 4 12z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    back: '<path d="M9 6l6 6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    board: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/>',
    rows: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="11" width="18" height="5" rx="1.5"/><path d="M3 20h18"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    map: '<path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.3"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    structure: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="8.5" y="14" width="7" height="7" rx="2"/><path d="M6.5 10v2h11v-2M12 12v2"/>'
  };
  const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ICONS.list}</svg>`;

  // ---------- כלים ----------
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const digits = s => String(s || '').replace(/\D/g, '');
  const intl = s => { let d = digits(s); if (d.startsWith('972')) return d; if (d.startsWith('0')) d = d.slice(1); return '972' + d; };
  const money = n => (n === '' || n == null || isNaN(+n)) ? '' : new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(+n);
  const dayStart = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const dayDiff = iso => Math.round((dayStart(iso) - dayStart(new Date())) / 864e5);
  function relDay(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const diff = dayDiff(d);
    if (diff === 0) return 'היום';
    if (diff === 1) return 'מחר';
    if (diff === -1) return 'אתמול';
    return d.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  const timeOf = iso => new Date(iso).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  const pad = n => String(n).padStart(2, '0');
  const toLocalInput = iso => { const d = new Date(iso); if (isNaN(d)) return ''; return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  function resolveSampleDate(v, type) {
    if (typeof v !== 'string') return v;
    const m = v.match(/^(today|[+-]\d+d)(?:\s+(\d{1,2}):(\d{2}))?$/);
    if (!m) return v;
    const d = new Date();
    if (m[1] !== 'today') d.setDate(d.getDate() + parseInt(m[1], 10));
    if (m[2]) d.setHours(+m[2], +m[3], 0, 0); else d.setHours(9, 0, 0, 0);
    return type === 'date' ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : d.toISOString();
  }
  function onColor(hex) {
    const h = String(hex || '').replace('#', '');
    if (h.length < 6) return '#ffffff';
    const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => (c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4));
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) > 0.45 ? '#111111' : '#ffffff';
  }
  const initials = s => String(s || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('');
  const T = id => BP.tables.find(t => t.id === id);
  const F = (t, id) => t.fields.find(f => f.id === id);
  const statusField = t => t.status ? F(t, t.status) : t.fields.find(f => f.type === 'status');
  const optList = f => (f.options || []).map(o => (typeof o === 'string' ? { v: o } : o));
  const optColor = (f, v) => { const o = optList(f).find(x => x.v === v); return `var(--c-${(o && o.color) || 'gray'})`; };
  // סטטוס "סגור": מסומן done בקובץ המבנה, ואם לא, לפי המילים המקובלות
  const isDone = (f, v) => { if (!f || !v) return false; const o = optList(f).find(x => x.v === v); if (o && 'done' in o) return Boolean(o.done); return /הושלמ|הושלם|נסגר|סגור|שולם|בוטל|הסתיים|בוצע/.test(v); };

  // ---------- נתונים ----------
  let DB = { rows: {}, settings: {} };
  let sb = null;
  let ws = null; // הסביבה של העסק בענן
  let session = null;

  function seedRows() {
    const out = {};
    for (const t of BP.tables) {
      out[t.id] = (BP.samples?.[t.id] || []).map((r, i) => {
        const row = { ...r, id: r.id || uid(), created_at: new Date(Date.now() - i * 36e5).toISOString(), _sample: true };
        for (const f of t.fields) if ((f.type === 'date' || f.type === 'datetime') && row[f.id]) row[f.id] = resolveSampleDate(row[f.id], f.type);
        return row;
      });
    }
    return out;
  }

  const Demo = {
    load() {
      if (PREVIEW) return { rows: seedRows(), settings: {} };
      try { const s = JSON.parse(localStorage.getItem(STORE_KEY)); if (s && s.rows) return s; } catch { /* ריק */ }
      const s = { rows: seedRows(), settings: {} };
      Demo.persist(s);
      return s;
    },
    persist(s = DB) {
      if (PREVIEW) return true;
      try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); return true; } catch { return false; }
    }
  };

  const api = {
    async save(tableId, row) {
      const now = new Date().toISOString();
      const list = DB.rows[tableId] || (DB.rows[tableId] = []);
      const existing = list.find(r => r.id === row.id);
      const clean = { ...row, updated_at: now };
      if (!clean.id) clean.id = uid();
      if (!existing) clean.created_at = clean.created_at || now;
      if (LIVE) {
        const { id, created_at, updated_at, _sample, ...data } = clean;
        const { error } = await sb.from('records').upsert({ id, workspace_id: ws.id, table_name: tableId, data, updated_at: now });
        if (error) throw error;
      }
      if (existing) Object.assign(existing, clean); else list.unshift(clean);
      if (!LIVE && !Demo.persist()) throw new Error('הדפדפן לא הצליח לשמור. אולי התמונה גדולה מדי.');
      return clean;
    },
    async remove(tableId, id) {
      if (LIVE) { const { error } = await sb.from('records').delete().eq('id', id); if (error) throw error; }
      DB.rows[tableId] = (DB.rows[tableId] || []).filter(r => r.id !== id);
      if (!LIVE) Demo.persist();
    },
    async saveSettings(patch) {
      Object.assign(DB.settings, patch);
      if (LIVE) { const { error } = await sb.from('workspaces').update({ settings: DB.settings }).eq('id', ws.id); if (error) throw error; }
      else Demo.persist();
    },
    async uploadPhoto(file) {
      if (!LIVE) return shrink(file, 900);
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const path = `${ws.id}/${uid()}.${ext}`;
      const { error } = await sb.storage.from('app-files').upload(path, file, { contentType: file.type });
      if (error) throw error;
      return sb.storage.from('app-files').getPublicUrl(path).data.publicUrl;
    }
  };

  function shrink(file, max) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // ---------- ערכת נושא ----------
  function applyTheme() {
    const theme = Q.get('theme') || DB.settings.theme || BP.style || 'clean-pro';
    document.documentElement.dataset.theme = THEMES[theme] ? theme : 'clean-pro';
    const accent = DB.settings.accent || BP.styleAccents?.[theme] || BP.brand?.accent;
    const st = document.documentElement.style;
    if (accent) { st.setProperty('--accent', accent); st.setProperty('--on-accent', onColor(accent)); }
    else { st.removeProperty('--accent'); st.removeProperty('--on-accent'); }
    if (BP.cover) st.setProperty('--cover', `url("${BP.cover}")`);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  }

  // ---------- תצוגת ערכים ----------
  const titleOf = (t, r) => (r && r[t.title]) || '(ללא שם)';
  function display(t, f, v) {
    if (v === '' || v == null) return '';
    switch (f.type) {
      case 'money': return money(v);
      case 'date': return relDay(v);
      case 'datetime': return `${relDay(v)}, ${timeOf(v)}`;
      case 'checkbox': return v ? 'כן' : 'לא';
      case 'relation': { const rt = T(f.table); const r = (DB.rows[f.table] || []).find(x => x.id === v); return r ? titleOf(rt, r) : ''; }
      default: return String(v);
    }
  }
  const statusChip = (f, v) => v ? `<span class="status" style="--c:${optColor(f, v)}">${esc(v)}</span>` : '';

  function itemHtml(t, r, compact) {
    const sf = statusField(t);
    const sub = t.subtitle ? display(t, F(t, t.subtitle), r[t.subtitle]) : '';
    const df = t.date ? F(t, t.date) : null;
    const mf = t.money ? F(t, t.money) : null;
    const photoF = t.fields.find(f => f.type === 'photo');
    const av = photoF && r[photoF.id] ? `<img src="${esc(r[photoF.id])}" alt="">` : esc(initials(titleOf(t, r)));
    const when = df && r[df.id] ? display(t, df, r[df.id]) : '';
    const late = df && r[df.id] && dayDiff(r[df.id]) < 0 && sf && !isDone(sf, r[sf.id]);
    return `<a class="item" href="#/t/${t.id}/${esc(r.id)}">
      ${compact ? '' : `<span class="item__av">${av}</span>`}
      <span class="item__main"><b>${esc(titleOf(t, r))}</b>${sub ? `<small>${esc(sub)}</small>` : ''}${compact && when ? `<small>${esc(when)}</small>` : ''}</span>
      <span class="item__end">${!compact && sf ? statusChip(sf, r[sf.id]) : ''}${mf && r[mf.id] ? `<span class="money ltr">${esc(money(r[mf.id]))}</span>` : ''}${!compact && when ? `<small style="${late ? 'color:var(--c-red)' : ''}">${esc(when)}</small>` : ''}</span>
    </a>`;
  }

  // ---------- ניווט ----------
  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path, query] = raw.split('?');
    const parts = path.split('/').filter(Boolean);
    return { parts, params: new URLSearchParams(query || '') };
  }
  const extraNav = () => (BP.extraNav || []).slice(0, 1);
  const navTables = () => BP.tables.slice(0, 3 - extraNav().length);
  function navHtml(active) {
    const items = [{ href: '#/', icon: 'home', label: 'בית', key: 'home' }]
      .concat(navTables().map(t => ({ href: `#/t/${t.id}`, icon: t.icon || 'list', label: t.label, key: t.id })))
      .concat(extraNav().map(n => ({ href: `#/x/${n.view}`, icon: n.icon || 'chart', label: n.label, key: 'x-' + n.view })))
      .concat(BP.tables.length > navTables().length ? [{ href: '#/more', icon: 'list', label: 'עוד', key: 'more' }] : [])
      .concat([{ href: '#/settings', icon: 'settings', label: 'הגדרות', key: 'settings' }]);
    return `<nav class="nav" aria-label="ניווט">${items.map(i => `<a href="${i.href}" class="${i.key === active ? 'on' : ''}" aria-label="${esc(i.label)}">${icon(i.icon)}<span>${esc(i.label)}</span></a>`).join('')}</nav>`;
  }
  const topHtml = (title, sub, back) => `<header class="top">
      ${back ? `<a class="icon-btn" href="${back}" aria-label="חזרה">${icon('back')}</a>` : ''}
      <div class="top__title"><h1>${esc(title)}</h1>${sub ? `<small>${esc(sub)}</small>` : ''}</div>
      ${back ? '' : BP.brand?.logo ? `<a class="avatar avatar--logo" href="#/settings" aria-label="הגדרות"><img src="${esc(BP.brand.logo)}" alt=""></a>` : `<a class="avatar" href="#/settings" aria-label="הגדרות">${esc(initials(DB.settings.owner || BP.owner || 'א'))}</a>`}
    </header>`;
  const fabHtml = t => t ? `<a class="fab" href="#/t/${t.id}/new">${icon('plus')}${esc(t.item)} חדש${/ה$/.test(t.item) ? 'ה' : ''}</a>` : '';

  // ---------- מסכים ----------
  const views = {};
  const ui = { search: {}, filter: {}, mode: {} };

  views.home = () => {
    const name = DB.settings.owner || BP.owner || '';
    const hour = new Date().getHours();
    const hello = hour < 12 ? 'בוקר טוב' : hour < 17 ? 'צהריים טובים' : 'ערב טוב';
    const dash = BP.dashboard || {};
    const kpis = (dash.kpis || []).slice(0, 4).map(k => `<div class="kpi"><b class="${k.sum ? 'ltr' : ''}">${esc(kpiValue(k))}</b><span>${esc(k.label)}</span></div>`).join('');
    const focusT = dash.focus ? T(dash.focus.table) : null;
    const focusRows = focusT ? filterWhere(DB.rows[focusT.id] || [], dash.focus.where).slice(0, 4) : [];
    const up = dash.upcoming ? T(dash.upcoming.table) : null;
    const upRows = up ? (DB.rows[up.id] || []).filter(r => { const d = r[dash.upcoming.field]; if (!d) return false; const dd = dayDiff(d); return dd >= 0 && dd <= (dash.upcoming.days || 7); }).sort((a, b) => new Date(a[dash.upcoming.field]) - new Date(b[dash.upcoming.field])).slice(0, 6) : [];
    const theme = document.documentElement.dataset.theme;
    const header = theme === 'photo-immersive'
      ? `<div class="cover"><h1>${esc(hello)},<br><b>${esc(name)}</b></h1><p>${esc(DB.settings.name || BP.name)}</p></div>`
      : `<div class="greet"><h1>${esc(hello)}${name ? ', ' + esc(name) : ''}</h1><p>${esc(new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' }))}</p></div>`;
    return `${theme === 'photo-immersive' ? '' : topHtml(DB.settings.name || BP.name)}
      ${header}
      <div class="kpis">${kpis}</div>
      <div class="quick">${BP.tables.map(t => `<a class="chip-btn" href="#/t/${t.id}/new">${icon('plus')}${esc(t.item)}</a>`).join('')}</div>
      ${focusT ? `<section class="section"><div class="section__head"><h2>${esc(dash.focus.label || 'מחכה לטיפול')}</h2><a href="#/t/${focusT.id}">הכל</a></div>
        <div class="list">${focusRows.length ? focusRows.map(r => itemHtml(focusT, r)).join('') : `<div class="empty"><b>אין כרגע מה לטפל</b>הכל מטופל. כל הכבוד.</div>`}</div></section>` : ''}
      ${up ? `<section class="section"><div class="section__head"><h2>בימים הקרובים</h2><a href="#/t/${up.id}">הכל</a></div>
        <div class="list">${upRows.length ? upRows.map(r => itemHtml(up, r)).join('') : `<div class="empty"><b>היומן פנוי</b>אין כלום ב-${dash.upcoming.days || 7} הימים הקרובים.</div>`}</div></section>` : ''}
      ${fabHtml(focusT || BP.tables[0])}`;
  };

  function filterWhere(rows, where) {
    if (!where) return rows;
    return rows.filter(r => Object.entries(where).every(([f, v]) => (Array.isArray(v) ? v.includes(r[f]) : r[f] === v)));
  }
  function kpiValue(k) {
    let rows = filterWhere(DB.rows[k.table] || [], k.count && typeof k.count === 'object' ? k.count : k.where);
    if (k.period) {
      const t = T(k.table);
      const now = new Date();
      const when = r => new Date(r[t.date] || r.created_at);
      if (k.period === 'today') rows = rows.filter(r => dayDiff(when(r)) === 0);
      if (k.period === 'week') rows = rows.filter(r => { const d = dayDiff(when(r)); return d >= 0 && d < 7; });
      if (k.period === 'month') rows = rows.filter(r => { const d = when(r); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    }
    if (k.sum) return money(rows.reduce((a, r) => a + (+r[k.sum] || 0), 0)) || '₪0';
    return rows.length;
  }

  views.list = t => {
    const all = DB.rows[t.id] || [];
    const sf = statusField(t);
    const q = (ui.search[t.id] || '').trim();
    const fv = ui.filter[t.id] || '';
    const mode = ui.mode[t.id] || (t.board && document.documentElement.dataset.theme === 'bold-dark' ? 'board' : 'list');
    let rows = all;
    if (q) rows = rows.filter(r => t.fields.some(f => String(display(t, f, r[f.id]) || '').includes(q)));
    const counts = sf ? Object.fromEntries(optList(sf).map(o => [o.v, rows.filter(r => r[sf.id] === o.v).length])) : {};
    const listRows = fv ? rows.filter(r => r[sf.id] === fv) : rows;
    const sorted = sortRows(t, listRows);
    const body = mode === 'board' && sf
      ? `<div class="board">${optList(sf).map(o => { const col = sortRows(t, rows.filter(r => r[sf.id] === o.v)); return `<div class="col"><div class="col__head"><span class="dot" style="--c:var(--c-${o.color || 'gray'})"></span>${esc(o.v)}<em>${col.length}</em></div>${col.length ? col.map(r => itemHtml(t, r, true)).join('') : '<div class="empty">ריק</div>'}</div>`; }).join('')}</div>`
      : `<div class="list">${sorted.length ? sorted.map(r => itemHtml(t, r)).join('') : emptyHtml(t, all.length > 0)}</div>`;
    return `${topHtml(t.label, `${all.length} ${all.length === 1 ? t.item : t.label}`)}
      <div class="search">${icon('search')}<input type="search" data-search="${t.id}" value="${esc(q)}" placeholder="חיפוש ב${esc(t.label)}" aria-label="חיפוש"></div>
      ${sf && mode !== 'board' ? `<div class="chips"><button class="chip-btn ${fv ? '' : 'on'}" data-filter="${t.id}" data-v="">הכל <em>${rows.length}</em></button>${optList(sf).map(o => `<button class="chip-btn ${fv === o.v ? 'on' : ''}" data-filter="${t.id}" data-v="${esc(o.v)}"><span class="dot" style="--c:var(--c-${o.color || 'gray'})"></span>${esc(o.v)} <em>${counts[o.v]}</em></button>`).join('')}</div>` : ''}
      ${t.board && sf ? `<div class="toolbar"><small>${listRows.length} מוצגים</small><div class="seg-view"><button class="${mode === 'list' ? 'on' : ''}" data-mode="${t.id}" data-v="list">${icon('rows')}רשימה</button><button class="${mode === 'board' ? 'on' : ''}" data-mode="${t.id}" data-v="board">${icon('board')}לוח</button></div></div>` : ''}
      ${body}
      ${fabHtml(t)}`;
  };
  // סדר: קודם מה שפתוח ומתוכנן (הקרוב ביותר ראשון), אחר כך פתוח בלי תאריך, ובסוף מה שסגור או עבר (האחרון ראשון)
  function sortRows(t, rows) {
    const sf = statusField(t);
    const created = r => new Date(r.created_at).getTime();
    if (!t.date) return [...rows].sort((a, b) => created(b) - created(a));
    const rank = r => {
      const d = r[t.date] ? new Date(r[t.date]) : null;
      if (sf && isDone(sf, r[sf.id])) return 3;
      if (d && dayDiff(d) < 0) return 0;
      if (d) return 1;
      return 2;
    };
    return [...rows].sort((a, b) => {
      const ra = rank(a), rb = rank(b);
      if (ra !== rb) return ra - rb;
      const da = a[t.date] ? new Date(a[t.date]).getTime() : 0, db = b[t.date] ? new Date(b[t.date]).getTime() : 0;
      if (ra === 3) return (db || created(b)) - (da || created(a));
      if (ra === 2) return created(b) - created(a);
      return da - db;
    });
  }
  const emptyHtml = (t, filtered) => filtered
    ? `<div class="empty"><b>לא נמצא</b>נסו מילה אחרת או סינון אחר.</div>`
    : `<div class="empty"><b>עוד אין ${esc(t.label)}</b>כאן יופיעו כל ה${esc(t.label)}.<div class="btn-row"><a class="btn btn--primary" href="#/t/${t.id}/new">${icon('plus')}הוספת ${esc(t.item)}</a></div></div>`;

  views.detail = (t, id) => {
    const r = (DB.rows[t.id] || []).find(x => x.id === id);
    if (!r) return `${topHtml('לא נמצא', '', `#/t/${t.id}`)}<div class="empty"><b>הרשומה לא קיימת</b>אולי היא נמחקה.</div>`;
    const sf = statusField(t);
    const phones = t.fields.filter(f => f.type === 'phone' && r[f.id]);
    const relPhones = t.fields.filter(f => f.type === 'relation' && r[f.id]).flatMap(f => { const rt = T(f.table); const rr = (DB.rows[f.table] || []).find(x => x.id === r[f.id]); return rr ? rt.fields.filter(x => x.type === 'phone' && rr[x.id]).map(x => rr[x.id]) : []; });
    const phone = phones[0] ? r[phones[0].id] : relPhones[0];
    const email = t.fields.find(f => f.type === 'email' && r[f.id]);
    const actions = [];
    if (phone) { actions.push(`<a class="action" href="tel:+${intl(phone)}">${icon('phone')}חיוג</a>`); actions.push(`<a class="action action--wa" href="https://wa.me/${intl(phone)}" target="_blank" rel="noopener">${icon('chat')}וואטסאפ</a>`); }
    if (email) actions.push(`<a class="action" href="mailto:${esc(r[email.id])}">${icon('mail')}מייל</a>`);
    actions.push(`<a class="action" href="#/t/${t.id}/${esc(r.id)}/edit">${icon('edit')}עריכה</a>`);
    const shown = t.fields.filter(f => f.id !== t.title && f.id !== (sf && sf.id) && r[f.id] !== '' && r[f.id] != null);
    const related = BP.tables.flatMap(ot => ot.fields.filter(f => f.type === 'relation' && f.table === t.id).map(f => ({ ot, f })));
    return `${topHtml(t.item, '', `#/t/${t.id}`)}
      <section class="card detail-hero">
        <h2>${esc(titleOf(t, r))}</h2>
        ${t.subtitle && r[t.subtitle] ? `<p>${esc(display(t, F(t, t.subtitle), r[t.subtitle]))}</p>` : ''}
        ${sf ? `<div class="statuses">${optList(sf).map(o => `<button style="--c:var(--c-${o.color || 'gray'})" class="${r[sf.id] === o.v ? 'on' : ''}" data-set-status="${esc(o.v)}" data-t="${t.id}" data-id="${esc(r.id)}">${esc(o.v)}</button>`).join('')}</div>` : ''}
      </section>
      <div class="actions">${actions.join('')}</div>
      ${shown.length ? `<dl class="card fields">${shown.map(f => `<div><dt>${esc(f.label)}</dt><dd class="${f.type === 'longtext' ? 'long' : ''}">${f.type === 'photo' ? `<img src="${esc(r[f.id])}" alt="">` : f.type === 'phone' || f.type === 'email' || f.type === 'money' ? `<span class="ltr">${esc(display(t, f, r[f.id]))}</span>` : esc(display(t, f, r[f.id]))}</dd></div>`).join('')}</dl>` : ''}
      ${related.map(({ ot, f }) => { const rows = sortRows(ot, (DB.rows[ot.id] || []).filter(x => x[f.id] === r.id)); return `<section class="section"><div class="section__head"><h2>${esc(ot.label)} (${rows.length})</h2><a href="#/t/${ot.id}/new?${f.id}=${encodeURIComponent(r.id)}">+ ${esc(ot.item)}</a></div><div class="list">${rows.length ? rows.map(x => itemHtml(ot, x)).join('') : `<div class="empty">עוד אין ${esc(ot.label)} ל${esc(t.item)} הזה</div>`}</div></section>`; }).join('')}
      <div class="btn-row"><button class="btn btn--danger" data-delete="${t.id}" data-id="${esc(r.id)}">${icon('trash')}מחיקה</button></div>`;
  };

  views.form = (t, id, params) => {
    const r = id ? (DB.rows[t.id] || []).find(x => x.id === id) : null;
    if (id && !r) return views.detail(t, id);
    const values = r ? { ...r } : {};
    if (!r) {
      params.forEach((v, k) => { values[k] = v; });
      const sf = statusField(t);
      if (sf && !values[sf.id]) values[sf.id] = optList(sf)[0]?.v;
    }
    return `${topHtml(r ? `עריכת ${t.item}` : `${t.item} ${/ה$/.test(t.item) ? 'חדשה' : 'חדש'}`, '', r ? `#/t/${t.id}/${esc(r.id)}` : `#/t/${t.id}`)}
      <form class="form" data-form="${t.id}" data-id="${r ? esc(r.id) : ''}" novalidate>
        ${t.fields.map(f => fieldHtml(f, values[f.id])).join('')}
        <div style="height:70px"></div>
        <div class="savebar"><a class="btn btn--ghost" href="${r ? `#/t/${t.id}/${esc(r.id)}` : `#/t/${t.id}`}">ביטול</a><button class="btn btn--primary" type="submit">${icon('check')}שמירה</button></div>
      </form>`;
  };

  function fieldHtml(f, v) {
    const req = f.required ? ' <i>*</i>' : '';
    const id = `f-${f.id}`;
    const val = v ?? '';
    const wrap = (inner, labelFor = true) => `<div class="f" data-f="${f.id}">${labelFor ? `<label for="${id}">${esc(f.label)}${req}</label>` : `<span>${esc(f.label)}${req}</span>`}${inner}<span class="err" hidden></span></div>`;
    switch (f.type) {
      case 'longtext': return wrap(`<textarea id="${id}" name="${f.id}" rows="3">${esc(val)}</textarea>`);
      case 'phone': return wrap(`<input id="${id}" name="${f.id}" type="tel" inputmode="tel" dir="ltr" autocomplete="tel" value="${esc(val)}" placeholder="050-0000000">`);
      case 'email': return wrap(`<input id="${id}" name="${f.id}" type="email" inputmode="email" dir="ltr" value="${esc(val)}">`);
      case 'number': return wrap(`<input id="${id}" name="${f.id}" type="text" inputmode="decimal" dir="ltr" value="${esc(val)}">`);
      case 'money': return wrap(`<div class="money-in"><input id="${id}" name="${f.id}" type="text" inputmode="decimal" dir="ltr" value="${esc(val)}"><b>₪</b></div>`);
      case 'date': return wrap(`<input id="${id}" name="${f.id}" type="date" value="${esc(val ? String(val).slice(0, 10) : '')}">`);
      case 'datetime': return wrap(`<input id="${id}" name="${f.id}" type="datetime-local" value="${esc(val ? toLocalInput(val) : '')}">`);
      case 'checkbox': return `<div class="f" data-f="${f.id}"><label class="switch">${esc(f.label)}<input type="checkbox" name="${f.id}" ${val ? 'checked' : ''}></label></div>`;
      case 'status':
      case 'select': return wrap(`<div class="pills" role="radiogroup">${optList(f).map(o => `<label class="${f.type === 'status' ? 'st' : ''}" style="--c:var(--c-${o.color || 'gray'})"><input type="radio" name="${f.id}" value="${esc(o.v)}" ${val === o.v ? 'checked' : ''}>${esc(o.v)}</label>`).join('')}</div>`, false);
      case 'relation': {
        const rt = T(f.table);
        const rows = [...(DB.rows[f.table] || [])].sort((a, b) => titleOf(rt, a).localeCompare(titleOf(rt, b), 'he'));
        return wrap(`<select id="${id}" name="${f.id}"><option value="">בחירת ${esc(rt.item)}</option>${rows.map(x => `<option value="${esc(x.id)}" ${val === x.id ? 'selected' : ''}>${esc(titleOf(rt, x))}</option>`).join('')}</select>`);
      }
      case 'photo': return wrap(`<div class="photo-in">${val ? `<img src="${esc(val)}" alt="">` : ''}<label class="btn btn--ghost btn--sm">${icon('camera')}${val ? 'החלפה' : 'צילום או העלאה'}<input type="file" accept="image/*" capture="environment" data-photo="${f.id}" hidden></label><input type="hidden" name="${f.id}" value="${esc(val)}"></div>`, false);
      default: return wrap(`<input id="${id}" name="${f.id}" type="text" value="${esc(val)}">`);
    }
  }

  views.settings = () => {
    const theme = document.documentElement.dataset.theme;
    const accent = DB.settings.accent || BP.brand?.accent || getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    const hasSamples = BP.tables.some(t => (DB.rows[t.id] || []).some(r => r._sample));
    return `${topHtml('הגדרות')}
      <section class="card set"><h3>העסק</h3>
        <div class="f"><label for="s-name">שם המערכת</label><input id="s-name" data-setting="name" value="${esc(DB.settings.name || BP.name)}"></div>
        <div class="f"><label for="s-owner">השם שלך</label><input id="s-owner" data-setting="owner" value="${esc(DB.settings.owner || BP.owner || '')}"></div>
      </section>
      <section class="card set"><h3>סגנון</h3>
        <div class="themes">${Object.entries(THEMES).map(([k, v]) => `<button class="theme-card ${k === theme ? 'on' : ''}" data-theme-pick="${k}"><span class="swatches">${v.sw.map(c => `<i style="background:${c}"></i>`).join('')}</span><b>${v.label}</b></button>`).join('')}</div>
        <div class="f"><label for="s-accent">צבע הדגשה</label><div style="display:flex;gap:10px;align-items:center"><input id="s-accent" type="color" data-accent value="${esc(accent.startsWith('#') ? accent : '#2563EB')}" style="width:64px;padding:4px"><button class="btn btn--ghost btn--sm" data-accent-reset>חזרה לברירת המחדל</button></div></div>
      </section>
      <section class="card set"><h3>ייצוא לאקסל</h3>
        <div class="btn-row" style="margin:0;flex-wrap:wrap">${BP.tables.map(t => `<button class="btn btn--ghost btn--sm" data-export="${t.id}">${icon('download')}${esc(t.label)}</button>`).join('')}</div>
      </section>
      <section class="card set"><h3>נתונים</h3>
        ${hasSamples ? `<button class="btn btn--ghost" data-clear-samples>מחיקת נתוני הדוגמה ותחילת עבודה</button>` : '<p class="muted">אין נתוני דוגמה. כל מה שכאן שלך.</p>'}
        <a class="btn btn--ghost" href="blueprint.html">${icon('structure')}מבנה המערכת</a>
        ${LIVE ? `<p class="muted">מחובר בתור <span class="ltr">${esc(session?.user?.email || '')}</span></p><button class="btn btn--danger" data-logout>יציאה</button>` : `<p class="demo-note"><b>מצב הדגמה.</b> הנתונים נשמרים רק בדפדפן הזה. אחרי חיבור לענן המערכת עובדת מכל מכשיר, ועם הצוות.</p>`}
      </section>
      <section class="card set"><h3>להוספה למסך הבית</h3>
        <p class="muted">באייפון: כפתור השיתוף ואז "הוספה למסך הבית". באנדרואיד: התפריט של Chrome ואז "התקנת אפליקציה".</p>
      </section>`;
  };

  views.more = () => `${topHtml('עוד')}<div class="list">${BP.tables.slice(navTables().length).map(t => `<a class="item" href="#/t/${t.id}"><span class="item__av">${icon(t.icon || 'list')}</span><span class="item__main"><b>${esc(t.label)}</b><small>${(DB.rows[t.id] || []).length} ${esc(t.label)}</small></span></a>`).join('')}</div>`;

  // ---------- הרחבות (custom.js) ----------
  // מסך מיוחד: LazyApp.view('report', (params, h) => h.top('דוח') + '<div class="card set">...</div>')
  // ובקובץ המבנה: extraNav: [{ view: 'report', label: 'דוח', icon: 'chart' }]
  const customViews = {};
  const helpers = {
    get rows() { return DB.rows; },
    get settings() { return DB.settings; },
    table: T, field: F, display, money, relDay, esc, icon, itemHtml,
    top: (title, sub, back) => topHtml(title, sub, back),
    save: (tableId, row) => api.save(tableId, row),
    remove: (tableId, id) => api.remove(tableId, id),
    toast: (text, undo) => toast(text, undo),
    render: () => render()
  };
  window.LazyApp = {
    view(name, fn) { customViews[name] = fn; if (location.hash.startsWith('#/x/' + name) && DB.rows && Object.keys(DB.rows).length) render(); },
    helpers
  };

  // ---------- ציור ----------
  function render() {
    const { parts, params } = parseRoute();
    let html = '';
    let active = 'home';
    if (parts[0] === 't' && T(parts[1])) {
      const t = T(parts[1]);
      active = navTables().includes(t) ? t.id : 'more';
      if (parts[2] === 'new') html = views.form(t, null, params);
      else if (parts[2] && parts[3] === 'edit') html = views.form(t, parts[2], params);
      else if (parts[2]) html = views.detail(t, parts[2]);
      else html = views.list(t);
    } else if (parts[0] === 'x' && customViews[parts[1]]) {
      active = 'x-' + parts[1];
      html = customViews[parts[1]](params, helpers);
    } else if (parts[0] === 'settings') { active = 'settings'; html = views.settings(); }
    else if (parts[0] === 'more') { active = 'more'; html = views.more(); }
    else html = views.home();
    const isForm = parts[2] === 'new' || parts[3] === 'edit';
    root.innerHTML = `<div class="app">${html}</div>${isForm ? '' : navHtml(active)}<div class="toast" role="status" aria-live="polite"><span></span><button hidden>ביטול</button></div>`;
    if (!PREVIEW) window.scrollTo(0, 0);
  }

  let toastTimer;
  function toast(text, undo) {
    const el = root.querySelector('.toast');
    if (!el) return;
    el.querySelector('span').textContent = text;
    const b = el.querySelector('button');
    b.hidden = !undo;
    b.onclick = undo ? async () => { el.classList.remove('on'); await undo(); } : null;
    el.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('on'), undo ? 5000 : 2400);
  }

  // ---------- אירועים ----------
  root.addEventListener('input', e => {
    const s = e.target.closest('[data-search]');
    if (s) {
      ui.search[s.dataset.search] = s.value;
      const pos = s.selectionStart;
      render();
      const n = root.querySelector('[data-search]');
      if (n) { n.focus(); n.setSelectionRange(pos, pos); }
    }
  });

  root.addEventListener('click', async e => {
    const el = e.target.closest('button, a');
    if (!el) return;
    const d = el.dataset;
    if (d.filter !== undefined) { ui.filter[d.filter] = d.v; render(); return; }
    if (d.mode) { ui.mode[d.mode] = d.v; render(); return; }
    if (d.setStatus) {
      const t = T(d.t); const r = DB.rows[t.id].find(x => x.id === d.id); const sf = statusField(t);
      try { await api.save(t.id, { ...r, [sf.id]: d.setStatus }); render(); toast(`עודכן: ${d.setStatus}`); } catch (err) { toast(err.message || 'העדכון נכשל'); }
      return;
    }
    if (d.delete) {
      const t = T(d.delete); const r = DB.rows[t.id].find(x => x.id === d.id);
      try {
        await api.remove(t.id, r.id);
        location.hash = `#/t/${t.id}`;
        setTimeout(() => toast(`${t.item} נמחק`, async () => { await api.save(t.id, r); render(); }), 30);
      } catch (err) { toast(err.message || 'המחיקה נכשלה'); }
      return;
    }
    if (d.themePick) { await api.saveSettings({ theme: d.themePick }); applyTheme(); render(); return; }
    if (el.hasAttribute('data-accent-reset')) { await api.saveSettings({ accent: '' }); applyTheme(); render(); return; }
    if (d.export) { exportCsv(T(d.export)); return; }
    if (el.hasAttribute('data-clear-samples')) {
      for (const t of BP.tables) DB.rows[t.id] = (DB.rows[t.id] || []).filter(r => !r._sample);
      Demo.persist(); render(); toast('נתוני הדוגמה נמחקו. המערכת מוכנה לעבודה.');
      return;
    }
    if (el.hasAttribute('data-logout')) { await sb.auth.signOut(); location.reload(); }
  });

  root.addEventListener('change', async e => {
    const s = e.target.closest('[data-setting]');
    if (s) { await api.saveSettings({ [s.dataset.setting]: s.value.trim() }); toast('נשמר'); return; }
    const a = e.target.closest('[data-accent]');
    if (a) { await api.saveSettings({ accent: a.value }); applyTheme(); return; }
    const p = e.target.closest('[data-photo]');
    if (p && p.files[0]) {
      try {
        toast('מעלה...');
        const url = await api.uploadPhoto(p.files[0]);
        const box = p.closest('.photo-in');
        box.querySelector('input[type=hidden]').value = url;
        let img = box.querySelector('img');
        if (!img) { img = document.createElement('img'); box.prepend(img); }
        img.src = url;
        toast('התמונה נוספה');
      } catch (err) { toast(err.message || 'ההעלאה נכשלה'); }
    }
  });

  root.addEventListener('submit', async e => {
    const form = e.target.closest('[data-form]');
    if (!form) return;
    e.preventDefault();
    const t = T(form.dataset.form);
    const old = form.dataset.id ? DB.rows[t.id].find(x => x.id === form.dataset.id) : null;
    const row = old ? { ...old } : {};
    let firstBad = null;
    for (const f of t.fields) {
      const box = form.querySelector(`[data-f="${f.id}"]`);
      const err = box?.querySelector('.err');
      let v;
      if (f.type === 'checkbox') v = form.querySelector(`[name="${f.id}"]`).checked;
      else if (f.type === 'status' || f.type === 'select') v = form.querySelector(`[name="${f.id}"]:checked`)?.value || '';
      else v = (form.querySelector(`[name="${f.id}"]`)?.value || '').trim();
      if (f.type === 'money' || f.type === 'number') v = v === '' ? '' : Number(String(v).replace(/[^\d.-]/g, ''));
      if (f.type === 'datetime' && v) v = new Date(v).toISOString();
      let bad = '';
      if (f.required && (v === '' || v == null)) bad = 'שדה חובה';
      else if (f.type === 'phone' && v && digits(v).length < 9) bad = 'מספר טלפון לא תקין';
      else if (f.type === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) bad = 'כתובת מייל לא תקינה';
      if (box) { box.classList.toggle('bad', Boolean(bad)); if (err) { err.hidden = !bad; err.textContent = bad; } }
      if (bad && !firstBad) firstBad = box;
      row[f.id] = v;
    }
    if (firstBad) { firstBad.scrollIntoView({ block: 'center' }); return; }
    delete row._sample;
    try {
      const saved = await api.save(t.id, row);
      location.hash = `#/t/${t.id}/${saved.id}`;
      setTimeout(() => toast(old ? 'השינויים נשמרו' : `${t.item} נוסף`), 30);
    } catch (err) { toast(err.message || 'השמירה נכשלה'); }
  });

  function exportCsv(t) {
    const cols = t.fields;
    const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = (DB.rows[t.id] || []).map(r => cols.map(f => cell(f.type === 'relation' ? display(t, f, r[f.id]) : f.type === 'datetime' && r[f.id] ? new Date(r[f.id]).toLocaleString('he-IL') : r[f.id])).join(','));
    const csv = '﻿' + [cols.map(f => cell(f.label)).join(','), ...rows].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `${t.label}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('הקובץ ירד');
  }

  // ---------- כניסה לענן ----------
  function loadScript(src) {
    return new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = reject; document.head.append(s); });
  }
  function renderLogin() {
    root.innerHTML = `<div class="login"><form class="card" data-login>
      <h1>${esc(BP.name)}</h1><p class="muted">נשלח לך קישור כניסה למייל. אין צורך בסיסמה.</p>
      <div class="f"><label for="l-email">המייל שלך</label><input id="l-email" type="email" required dir="ltr" autocomplete="email"></div>
      <button class="btn btn--primary" type="submit">שלחו לי קישור</button><p class="muted" data-login-note></p></form></div>`;
    root.querySelector('[data-login]').addEventListener('submit', async e => {
      e.preventDefault();
      const email = root.querySelector('#l-email').value.trim();
      const note = root.querySelector('[data-login-note]');
      note.textContent = 'שולח...';
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href.split('#')[0] } });
      note.textContent = error ? 'לא הצלחנו לשלוח. בדקו את המייל ונסו שוב.' : 'שלחנו קישור. פתחו את המייל ולחצו עליו.';
    }, { once: true });
  }
  async function loadLive() {
    let { data: mem } = await sb.from('members').select('role, workspace:workspaces(id, name, settings)').limit(1);
    if (!mem || !mem.length) {
      const { error } = await sb.rpc('create_workspace', { p_name: BP.name });
      if (error) throw error;
      ({ data: mem } = await sb.from('members').select('role, workspace:workspaces(id, name, settings)').limit(1));
    }
    ws = mem[0].workspace;
    DB.settings = ws.settings || {};
    const { data: recs, error } = await sb.from('records').select('id, table_name, data, created_at, updated_at').eq('workspace_id', ws.id);
    if (error) throw error;
    DB.rows = {};
    for (const t of BP.tables) DB.rows[t.id] = [];
    for (const r of recs) (DB.rows[r.table_name] || (DB.rows[r.table_name] = [])).push({ ...r.data, id: r.id, created_at: r.created_at, updated_at: r.updated_at });
  }

  // ---------- הפעלה ----------
  async function start() {
    if (!LIVE || PREVIEW) {
      DB = Demo.load();
      applyTheme();
      render();
      window.addEventListener('hashchange', render);
      return;
    }
    applyTheme();
    root.innerHTML = '<div class="login"><p class="muted">טוען...</p></div>';
    try {
      await loadScript(SUPABASE_JS);
      sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey);
      ({ data: { session } } = await sb.auth.getSession());
      if (!session) { renderLogin(); sb.auth.onAuthStateChange((ev, s) => { if (ev === 'SIGNED_IN' && s) location.reload(); }); return; }
      await loadLive();
      applyTheme();
      render();
      window.addEventListener('hashchange', render);
    } catch (err) {
      root.innerHTML = `<div class="login"><div class="card"><h1>לא הצלחנו להתחבר</h1><p class="muted">${esc(err.message || 'בדקו את החיבור לאינטרנט ונסו שוב.')}</p></div></div>`;
    }
  }

  // התקנה כאפליקציה (מסך הבית ועבודה עם קליטה חלשה): רק כשהמערכת באוויר
  if (/^https?:$/.test(location.protocol) && !PREVIEW) {
    const m = document.createElement('link');
    m.rel = 'manifest';
    m.href = 'manifest.webmanifest';
    document.head.append(m);
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  start();
})();
