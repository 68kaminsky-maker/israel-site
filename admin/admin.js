// אזור הניהול: פניות, טקסטים, לוגו ותמונות, פרטי קשר וצבעים.
// נטען רק כשבכתובת יש ?admin. עם Supabase: כניסה במייל ושמירה בענן. בלי Supabase: מצב הדגמה בדפדפן.
(async function () {
  const S = window.LazySite;
  if (!S || document.querySelector('.adm')) return;

  const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
  const STATUSES = ['חדש', 'בטיפול', 'נסגר'];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const brand = () => S.current('brand.name') || 'האתר שלי';

  const root = document.createElement('div');
  root.className = 'adm';
  root.dir = 'rtl';
  document.body.append(root);
  document.documentElement.classList.add('adm-open');

  let sb = null;

  // ---------- חיבור ----------
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.append(s);
    });
  }

  const api = S.LIVE ? {
    async listLeads() {
      const { data, error } = await sb.from('leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    async updateLead(id, patch) {
      const { error } = await sb.from('leads').update(patch).eq('id', id);
      if (error) throw error;
    },
    async deleteLead(id) {
      const { error } = await sb.from('leads').delete().eq('id', id);
      if (error) throw error;
    },
    async saveContent(map) {
      const now = new Date().toISOString();
      const upserts = Object.entries(map).filter(([, v]) => v !== null).map(([key, value]) => ({ key, value, updated_at: now }));
      const removals = Object.entries(map).filter(([, v]) => v === null).map(([k]) => k);
      if (upserts.length) {
        const { error } = await sb.from('site_content').upsert(upserts);
        if (error) throw error;
      }
      if (removals.length) {
        const { error } = await sb.from('site_content').delete().in('key', removals);
        if (error) throw error;
      }
    },
    async uploadImage(key, file) {
      const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
      const path = `images/${key.replace(/[^a-z0-9]+/gi, '-')}-${Date.now()}.${ext}`;
      const { error } = await sb.storage.from('site').upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      return sb.storage.from('site').getPublicUrl(path).data.publicUrl;
    }
  } : {
    async listLeads() { return S.demo.getLeads(); },
    async updateLead(id, patch) {
      const leads = S.demo.getLeads();
      const lead = leads.find(l => l.id === id);
      if (lead) Object.assign(lead, patch);
      S.demo.setLeads(leads);
    },
    async deleteLead(id) { S.demo.setLeads(S.demo.getLeads().filter(l => l.id !== id)); },
    async saveContent(map) {
      const content = S.demo.getContent();
      for (const [k, v] of Object.entries(map)) { if (v === null) delete content[k]; else content[k] = v; }
      if (!S.demo.setContent(content)) throw new Error('הדפדפן לא הצליח לשמור. אולי התמונה גדולה מדי.');
    },
    async uploadImage(key, file) { return shrinkToDataUrl(file, key === 'brand.logo' ? 600 : 1400); }
  };

  // במצב הדגמה מקטינים תמונות כדי שייכנסו לזיכרון של הדפדפן
  function shrinkToDataUrl(file, max) {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml') {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        resolve(file.type === 'image/png' ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // במצב הדגמה, פניות לדוגמה כדי שאזור הניהול לא יהיה ריק
  function seedDemo() {
    if (S.LIVE || S.demo.isSeeded()) return;
    const ago = min => new Date(Date.now() - min * 60000).toISOString();
    const leads = S.demo.getLeads();
    leads.push(
      { id: 'demo-1', created_at: ago(25), name: 'רונית לוי (דוגמה)', phone: '050-1234567', service: 'מערכות ניהול', message: 'אני רוצה לעשות סדר בלקוחות ובהצעות המחיר', status: 'חדש' },
      { id: 'demo-2', created_at: ago(60 * 26), name: 'יוסי כהן (דוגמה)', phone: '052-7654321', service: 'אתרים ודפי נחיתה', message: 'צריך דף נחיתה למוסך', status: 'בטיפול' },
      { id: 'demo-3', created_at: ago(60 * 24 * 3), name: 'מיכל אברהם (דוגמה)', phone: '054-1112233', service: 'אוטומציות', message: '', status: 'נסגר' }
    );
    S.demo.setLeads(leads);
    S.demo.markSeeded();
  }

  // ---------- כלים ----------
  function toast(text, bad) {
    const t = root.querySelector('.adm-toast');
    if (!t) return;
    t.textContent = text;
    t.classList.toggle('adm-toast--bad', Boolean(bad));
    t.classList.add('adm-toast--on');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('adm-toast--on'), 2600);
  }

  function timeAgo(iso) {
    const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (min < 1) return 'עכשיו';
    if (min < 60) return min === 1 ? 'לפני דקה' : `לפני ${min} דקות`;
    const h = Math.round(min / 60);
    if (h < 24) return h === 1 ? 'לפני שעה' : h === 2 ? 'לפני שעתיים' : `לפני ${h} שעות`;
    const d = Math.round(h / 24);
    if (d === 1) return 'אתמול';
    if (d < 7) return `לפני ${d} ימים`;
    return new Date(iso).toLocaleDateString('he-IL');
  }

  // כל השדות שניתנים לעריכה, לפי הסימונים בדף
  function fields() {
    const map = new Map();
    const add = (key, el, type) => {
      if (!key || el.closest('.adm')) return;
      const f = map.get(key);
      if (f) { if (!f.labelled && el.dataset.label) { f.label = el.dataset.label; f.labelled = true; } return; }
      map.set(key, {
        key, type,
        label: el.dataset.label || key,
        labelled: Boolean(el.dataset.label),
        section: el.closest('[data-section]')?.dataset.section || (el.closest('head') ? 'גוגל ושיתוף' : 'תפריט')
      });
    };
    document.querySelectorAll('[data-edit]').forEach(el => add(el.dataset.edit, el, el.dataset.type || 'text'));
    document.querySelectorAll('[data-edit-meta]').forEach(el => add(el.dataset.editMeta, el, el.dataset.type || 'text'));
    document.querySelectorAll('[data-edit-img]').forEach(el => add(el.dataset.editImg, el, 'image'));
    return [...map.values()];
  }

  // ---------- מסך כניסה ----------
  function renderLogin(note) {
    root.innerHTML = `
      <div class="adm-login">
        <form class="adm-card adm-login__card">
          <span class="adm-badge">אזור ניהול</span>
          <h1>${esc(brand())}</h1>
          <p>נשלח לך למייל קישור כניסה. אין צורך בסיסמה.</p>
          <label class="adm-field"><span>המייל שלך</span><input type="email" name="email" required autocomplete="email" dir="ltr" placeholder="name@example.com"></label>
          <button class="adm-btn adm-btn--yellow adm-btn--wide" type="submit">שלחו לי קישור כניסה</button>
          <p class="adm-login__note" role="status">${esc(note || '')}</p>
          <a class="adm-link" href="index.html">חזרה לאתר</a>
        </form>
      </div>`;
    const form = root.querySelector('form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = form.email.value.trim();
      const out = root.querySelector('.adm-login__note');
      out.textContent = 'שולח...';
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false, emailRedirectTo: location.href.split('#')[0] }
      });
      out.textContent = error
        ? 'המייל הזה לא רשום כמנהל של האתר.'
        : 'שלחנו לך קישור. פתחו את המייל ולחצו עליו, והכניסה תתבצע כאן.';
    });
  }

  // ---------- המסך הראשי ----------
  const TABS = [
    { id: 'leads', label: 'פניות' },
    { id: 'texts', label: 'טקסטים' },
    { id: 'images', label: 'לוגו ותמונות' },
    { id: 'settings', label: 'פרטי קשר וצבעים' }
  ];
  let tab = 'leads';
  let dirty = {};

  function renderApp() {
    root.innerHTML = `
      <header class="adm-top">
        <div class="adm-top__brand"><span class="adm-top__mark"></span><span>אזור ניהול</span><b>${esc(brand())}</b></div>
        <div class="adm-top__actions">
          <button class="adm-btn adm-btn--ghost adm-btn--sm" data-act="view">צפייה באתר</button>
          ${S.LIVE ? '<button class="adm-btn adm-btn--ghost adm-btn--sm" data-act="logout">יציאה</button>' : ''}
        </div>
      </header>
      ${S.LIVE ? '' : '<p class="adm-demo"><b>מצב הדגמה.</b> הפניות והשינויים נשמרים רק בדפדפן הזה. אחרי חיבור ל-Supabase הכל נשמר בענן, ועובד מכל מכשיר.</p>'}
      <div class="adm-body">
        <nav class="adm-tabs" aria-label="לשוניות">
          ${TABS.map(t => `<button class="adm-tab" data-tab="${t.id}">${t.label}<span class="adm-tab__count" data-count="${t.id}"></span></button>`).join('')}
        </nav>
        <main class="adm-main"></main>
      </div>
      <div class="adm-save" hidden>
        <span>יש שינויים שעוד לא נשמרו</span>
        <div><button class="adm-btn adm-btn--ghost-dark adm-btn--sm" data-act="discard">ביטול</button><button class="adm-btn adm-btn--yellow" data-act="save">שמירה</button></div>
      </div>
      <div class="adm-toast" role="status" aria-live="polite"></div>`;

    root.querySelector('.adm-tabs').addEventListener('click', e => {
      const b = e.target.closest('[data-tab]');
      if (b) show(b.dataset.tab);
    });
    root.addEventListener('click', async e => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'view') closeAdmin();
      if (act === 'logout') { await sb.auth.signOut(); location.href = 'index.html'; }
      if (act === 'save') save();
      if (act === 'discard') { location.reload(); }
    });
    show(tab);
  }

  function closeAdmin() {
    if (Object.keys(dirty).length && !confirm('יש שינויים שלא נשמרו. לצאת בכל זאת?')) return;
    root.remove();
    document.documentElement.classList.remove('adm-open');
    history.replaceState(null, '', location.pathname);
  }

  function show(id) {
    tab = id;
    root.querySelectorAll('.adm-tab').forEach(b => b.classList.toggle('adm-tab--on', b.dataset.tab === id));
    const main = root.querySelector('.adm-main');
    ({ leads: viewLeads, texts: viewTexts, images: viewImages, settings: viewSettings })[id](main);
  }

  function markDirty(key, value) {
    dirty[key] = value;
    S.preview(key, value);
    root.querySelector('.adm-save').hidden = false;
  }

  async function save() {
    const btn = root.querySelector('[data-act="save"]');
    btn.disabled = true;
    try {
      await api.saveContent(dirty);
      dirty = {};
      root.querySelector('.adm-save').hidden = true;
      toast('נשמר. השינויים כבר באתר.');
    } catch (err) {
      toast(err.message || 'השמירה נכשלה. נסו שוב.', true);
    }
    btn.disabled = false;
  }

  // ---------- פניות ----------
  let leadFilter = 'הכל';

  async function viewLeads(main) {
    main.innerHTML = '<p class="adm-empty">טוען פניות...</p>';
    let leads;
    try { leads = await api.listLeads(); } catch { main.innerHTML = '<p class="adm-empty">לא הצלחנו לטעון את הפניות. בדקו את החיבור לאינטרנט ונסו שוב.</p>'; return; }

    const draw = () => {
      const count = s => leads.filter(l => l.status === s).length;
      root.querySelector('[data-count="leads"]').textContent = count('חדש') || '';
      const list = leadFilter === 'הכל' ? leads : leads.filter(l => l.status === leadFilter);
      main.innerHTML = `
        <div class="adm-head">
          <div><h2>פניות</h2><p>כל מי שמילא את הטופס באתר.</p></div>
          <button class="adm-btn adm-btn--ghost-dark adm-btn--sm" data-csv ${leads.length ? '' : 'disabled'}>הורדה לאקסל</button>
        </div>
        <div class="adm-stats">
          ${STATUSES.map(s => `<div class="adm-stat adm-stat--${STATUSES.indexOf(s)}"><b>${count(s)}</b><span>${s}</span></div>`).join('')}
        </div>
        <div class="adm-filters">
          ${['הכל', ...STATUSES].map(s => `<button class="adm-chip ${s === leadFilter ? 'adm-chip--on' : ''}" data-filter="${s}">${s}</button>`).join('')}
        </div>
        <div class="adm-leads">
          ${list.length ? list.map(l => `
            <article class="adm-card adm-lead adm-lead--${STATUSES.indexOf(l.status)}">
              <div class="adm-lead__head">
                <b>${esc(l.name)}</b>
                ${l.service ? `<span class="adm-pill">${esc(l.service)}</span>` : ''}
                <time>${esc(timeAgo(l.created_at))}</time>
              </div>
              ${l.message ? `<p class="adm-lead__msg">${esc(l.message)}</p>` : ''}
              <div class="adm-lead__foot">
                <a class="adm-btn adm-btn--blue adm-btn--sm" href="tel:+${S.intl(l.phone)}" dir="ltr">${esc(l.phone)}</a>
                <a class="adm-btn adm-btn--wa adm-btn--sm" href="https://wa.me/${S.intl(l.phone)}" target="_blank" rel="noopener">וואצאפ</a>
                <select class="adm-select" data-status="${esc(l.id)}" aria-label="סטטוס">
                  ${STATUSES.map(s => `<option ${s === l.status ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
                <button class="adm-link adm-link--danger" data-del="${esc(l.id)}">מחיקה</button>
              </div>
            </article>`).join('') : `<p class="adm-empty">${leads.length ? 'אין פניות בסטטוס הזה.' : 'עוד אין פניות. כשמישהו ימלא את הטופס באתר, הפנייה תופיע כאן.'}</p>`}
        </div>`;
    };
    draw();

    main.onclick = async e => {
      const f = e.target.closest('[data-filter]');
      if (f) { leadFilter = f.dataset.filter; draw(); return; }
      const del = e.target.closest('[data-del]');
      if (del && confirm('למחוק את הפנייה?')) {
        try { await api.deleteLead(del.dataset.del); leads = leads.filter(l => l.id !== del.dataset.del); draw(); toast('הפנייה נמחקה'); }
        catch { toast('המחיקה נכשלה', true); }
        return;
      }
      if (e.target.closest('[data-csv]')) downloadCsv(leads);
    };
    main.onchange = async e => {
      const s = e.target.closest('[data-status]');
      if (!s) return;
      try {
        await api.updateLead(s.dataset.status, { status: s.value });
        const lead = leads.find(l => l.id === s.dataset.status);
        if (lead) lead.status = s.value;
        draw();
        toast('הסטטוס עודכן');
      } catch { toast('העדכון נכשל', true); }
    };
  }

  function downloadCsv(leads) {
    const cols = [['created_at', 'תאריך'], ['name', 'שם'], ['phone', 'טלפון'], ['service', 'שירות'], ['message', 'הודעה'], ['status', 'סטטוס']];
    const cell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [cols.map(c => cell(c[1])).join(','), ...leads.map(l => cols.map(([k]) => cell(k === 'created_at' ? new Date(l[k]).toLocaleString('he-IL') : l[k])).join(','))];
    const blob = new Blob(['﻿' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `פניות-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ---------- טקסטים ----------
  const isSetting = k => k.startsWith('contact.') || k.startsWith('seo.') || k.startsWith('theme.') || k.startsWith('brand.');

  function fieldHtml(f) {
    const value = f.key in dirty ? (dirty[f.key] ?? S.defaults[f.key]) : S.current(f.key);
    const long = f.type === 'long' || f.type === 'list' || String(value).length > 70;
    const input = long
      ? `<textarea data-key="${esc(f.key)}" rows="${f.type === 'list' ? 3 : 2}">${esc(value)}</textarea>`
      : `<input data-key="${esc(f.key)}" value="${esc(value)}">`;
    const changed = S.current(f.key) !== S.defaults[f.key];
    return `<label class="adm-field"><span>${esc(f.label)}${changed ? ' <i class="adm-dot" title="שונה מהמקור"></i>' : ''}</span>
      <div class="adm-field__row">${input}<button type="button" class="adm-reset" data-reset="${esc(f.key)}" title="חזרה לטקסט המקורי" aria-label="חזרה לטקסט המקורי">↺</button></div></label>`;
  }

  function bindFields(main) {
    main.oninput = e => {
      const el = e.target.closest('[data-key]');
      if (el) markDirty(el.dataset.key, el.value);
    };
    main.onclick = e => {
      const r = e.target.closest('[data-reset]');
      if (!r) return;
      const key = r.dataset.reset;
      const el = main.querySelector(`[data-key="${CSS.escape(key)}"]`);
      if (el) el.value = S.defaults[key] ?? '';
      markDirty(key, null);
    };
  }

  function viewTexts(main) {
    const groups = new Map();
    fields().filter(f => f.type !== 'image' && !isSetting(f.key)).forEach(f => {
      if (!groups.has(f.section)) groups.set(f.section, []);
      groups.get(f.section).push(f);
    });
    main.innerHTML = `
      <div class="adm-head"><div><h2>טקסטים</h2><p>כל טקסט באתר. משנים, רואים את השינוי באתר מאחור, ושומרים.</p></div></div>
      ${[...groups].map(([section, list], i) => `
        <details class="adm-card adm-group" ${i === 0 ? 'open' : ''}>
          <summary><b>${esc(section)}</b><span>${list.length} שדות</span></summary>
          <div class="adm-group__body">${list.map(fieldHtml).join('')}</div>
        </details>`).join('')}`;
    bindFields(main);
  }

  // ---------- לוגו ותמונות ----------
  function viewImages(main) {
    const list = fields().filter(f => f.type === 'image');
    const tips = { 'brand.logo': 'עדיף קובץ PNG עם רקע שקוף, ברוחב של 400 פיקסלים לפחות.', 'hero.image': 'תמונה ריבועית, ברוחב של 1200 פיקסלים לפחות.' };
    main.innerHTML = `
      <div class="adm-head"><div><h2>לוגו ותמונות</h2><p>מחליפים בלחיצה, והאתר מתעדכן מיד.</p></div></div>
      <div class="adm-images">
        ${list.map(f => {
          const src = S.current(f.key);
          return `<div class="adm-card adm-image">
            <div class="adm-image__preview ${f.key === 'brand.logo' ? 'adm-image__preview--logo' : ''}">${src ? `<img src="${esc(src)}" alt="">` : '<span>עוד אין תמונה</span>'}</div>
            <b>${esc(f.label)}</b>
            <p>${esc(tips[f.key] || '')}</p>
            <div class="adm-image__actions">
              <label class="adm-btn adm-btn--yellow adm-btn--sm">העלאת תמונה<input type="file" accept="image/*" data-upload="${esc(f.key)}" hidden></label>
              <button class="adm-link" data-img-reset="${esc(f.key)}">חזרה למקור</button>
            </div>
          </div>`;
        }).join('')}
      </div>`;

    main.onchange = async e => {
      const input = e.target.closest('[data-upload]');
      if (!input || !input.files[0]) return;
      const file = input.files[0];
      if (!file.type.startsWith('image/')) { toast('זה לא קובץ תמונה', true); return; }
      if (file.size > 8 * 1024 * 1024) { toast('התמונה גדולה מ-8MB. נסו תמונה קטנה יותר.', true); return; }
      toast('מעלה...');
      try {
        const url = await api.uploadImage(input.dataset.upload, file);
        await api.saveContent({ [input.dataset.upload]: url });
        S.preview(input.dataset.upload, url);
        viewImages(main);
        toast('התמונה הוחלפה');
      } catch (err) { toast(err.message || 'ההעלאה נכשלה', true); }
    };
    main.onclick = async e => {
      const r = e.target.closest('[data-img-reset]');
      if (!r) return;
      try {
        await api.saveContent({ [r.dataset.imgReset]: null });
        S.preview(r.dataset.imgReset, null);
        viewImages(main);
        toast('חזרנו לתמונה המקורית');
      } catch { toast('לא הצלחנו לשמור', true); }
    };
  }

  // ---------- פרטי קשר וצבעים ----------
  function viewSettings(main) {
    const all = fields();
    const pick = keys => keys.map(k => all.find(f => f.key === k)).filter(Boolean);
    const contact = pick(['brand.name', 'brand.tagline', 'contact.phone', 'contact.whatsapp', 'contact.wa_message']);
    const seo = pick(['seo.title', 'seo.description']);
    const colors = [['theme.ink', 'צבע כהה (רקעים וכותרות)'], ['theme.blue', 'צבע משני'], ['theme.yellow', 'צבע הדגשה (כפתורים)'], ['theme.teal', 'צבע הדגשה משני']];
    main.innerHTML = `
      <div class="adm-head"><div><h2>פרטי קשר וצבעים</h2><p>הטלפון והוואצאפ מתעדכנים בכל הכפתורים באתר.</p></div></div>
      <section class="adm-card adm-group adm-group--flat"><h3>פרטי העסק</h3>${contact.map(fieldHtml).join('')}</section>
      <section class="adm-card adm-group adm-group--flat"><h3>גוגל ושיתוף</h3>${seo.map(fieldHtml).join('')}</section>
      <section class="adm-card adm-group adm-group--flat"><h3>צבעים</h3>
        <div class="adm-colors">
          ${colors.map(([k, label]) => `<label class="adm-color"><input type="color" data-key="${k}" value="${esc(S.current(k) || '#000000')}"><span>${label}</span><button type="button" class="adm-reset" data-reset="${k}" title="חזרה לצבע המקורי" aria-label="חזרה לצבע המקורי">↺</button></label>`).join('')}
        </div>
      </section>`;
    bindFields(main);
  }

  // ---------- הפעלה ----------
  if (!S.LIVE) {
    seedDemo();
    renderApp();
    return;
  }
  root.innerHTML = '<div class="adm-login"><p class="adm-empty">טוען...</p></div>';
  try {
    await loadScript(SUPABASE_JS);
    sb = window.supabase.createClient(S.CFG.supabaseUrl, S.CFG.supabaseKey);
  } catch {
    root.innerHTML = '<div class="adm-login"><p class="adm-empty">לא הצלחנו להתחבר. בדקו את החיבור לאינטרנט ונסו שוב.</p></div>';
    return;
  }
  const { data } = await sb.auth.getSession();
  if (data.session) renderApp(); else renderLogin();
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session && !root.querySelector('.adm-top')) renderApp();
  });
})();
