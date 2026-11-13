// תוכן שניתן לעריכה, טופס פניות, וטעינה של אזור הניהול.
// כל טקסט באתר שמסומן ב-data-edit, כל תמונה שמסומנת ב-data-edit-img וכל תגית meta שמסומנת ב-data-edit-meta
// אפשר לשנות מאזור הניהול. התוכן המקורי כתוב בדף עצמו, כך שהאתר עובד גם בלי חיבור.
(function () {
  const CFG = window.SITE_CONFIG || {};
  const LIVE = Boolean(CFG.supabaseUrl && CFG.supabaseKey);
  const STORE = { content: 'lazy-site-content', leads: 'lazy-site-leads', seeded: 'lazy-site-seeded' };
  const THEME_VARS = { 'theme.ink': '--ink', 'theme.blue': '--blue', 'theme.yellow': '--yellow', 'theme.teal': '--teal' };

  const readJSON = (key, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
  };
  const writeJSON = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  };

  // טלפונים: "050-123-4567" הופך ל-972501234567
  const digits = s => String(s || '').replace(/\D/g, '');
  const intl = s => {
    let d = digits(s);
    if (d.startsWith('972')) return d;
    if (d.startsWith('0')) d = d.slice(1);
    return '972' + d;
  };

  const defaults = {};
  const state = {};
  const sel = (attr, key) => document.querySelectorAll(`[${attr}="${CSS.escape(key)}"]`);
  const inAdmin = el => Boolean(el.closest('.adm'));

  // שומרים את התוכן המקורי של הדף, לפני כל שינוי
  function collectDefaults() {
    document.querySelectorAll('[data-edit]').forEach(el => {
      const k = el.dataset.edit;
      if (k in defaults || inAdmin(el)) return;
      defaults[k] = el.dataset.type === 'list'
        ? [...el.children].map(li => li.textContent.trim()).join(', ')
        : el.textContent.trim();
    });
    document.querySelectorAll('[data-edit-meta]').forEach(el => {
      defaults[el.dataset.editMeta] = el.getAttribute('content') || '';
    });
    document.querySelectorAll('[data-edit-img]').forEach(el => {
      const k = el.dataset.editImg;
      if (!(k in defaults)) defaults[k] = el.getAttribute('src') || '';
    });
    const css = getComputedStyle(document.documentElement);
    for (const [k, v] of Object.entries(THEME_VARS)) defaults[k] = css.getPropertyValue(v).trim();
  }

  const current = k => (k in state ? state[k] : defaults[k]);
  const safeImage = v => v === '' || /^(https:\/\/|data:image\/|assets\/)/.test(v);

  // מחילים שינויים על הדף
  function apply(map) {
    for (const [k, raw] of Object.entries(map || {})) {
      const v = raw ?? defaults[k] ?? '';
      if (k in THEME_VARS) {
        if (/^#[0-9a-f]{3,8}$/i.test(v)) document.documentElement.style.setProperty(THEME_VARS[k], v);
        continue;
      }
      sel('data-edit', k).forEach(el => {
        if (inAdmin(el)) return;
        if (el.dataset.type === 'list') {
          el.replaceChildren(...String(v).split(',').map(s => s.trim()).filter(Boolean).map(t => {
            const li = document.createElement('li');
            li.textContent = t;
            return li;
          }));
        } else {
          el.textContent = v;
        }
      });
      sel('data-edit-meta', k).forEach(el => el.setAttribute('content', v));
      sel('data-edit-img', k).forEach(el => {
        if (!safeImage(v)) return;
        if (v) { el.src = v; el.hidden = false; } else { el.removeAttribute('src'); el.hidden = el.classList.contains('logo__img'); }
        const logo = el.closest('.logo');
        if (logo && el.classList.contains('logo__img')) logo.classList.toggle('logo--has-img', Boolean(v));
      });
    }
    // קישורי טלפון ווואצאפ נבנים מהמספרים שבתוכן
    const phone = current('contact.phone');
    const wa = current('contact.whatsapp') || phone;
    const msg = current('contact.wa_message');
    document.querySelectorAll('[data-edit-tel]').forEach(a => { a.href = 'tel:+' + intl(phone); });
    const mail = String(current('contact.email') || '').trim();
    document.querySelectorAll('[data-edit-mail]').forEach(a => { if (/^[^\s@<>"]+@[^\s@<>"]+$/.test(mail)) a.href = 'mailto:' + mail; });
    document.querySelectorAll('[data-edit-wa]').forEach(a => {
      a.href = 'https://wa.me/' + intl(wa) + (msg ? '?text=' + encodeURIComponent(msg) : '');
    });
  }

  // שינוי זמני לתצוגה (מאזור הניהול), לפני שמירה
  function preview(key, value) {
    if (value === null) delete state[key]; else state[key] = value;
    apply({ [key]: value });
  }

  // ---------- שמירה: Supabase או מצב הדגמה ----------
  const headers = () => ({ apikey: CFG.supabaseKey, 'Content-Type': 'application/json' });

  async function loadContent() {
    if (!LIVE) return readJSON(STORE.content, {});
    const res = await fetch(`${CFG.supabaseUrl}/rest/v1/site_content?select=key,value`, { headers: headers() });
    if (!res.ok) throw new Error('content ' + res.status);
    const rows = await res.json();
    return Object.fromEntries(rows.map(r => [r.key, r.value]));
  }

  async function addLead(lead) {
    if (!LIVE) {
      const leads = readJSON(STORE.leads, []);
      leads.unshift({ id: String(Date.now()), created_at: new Date().toISOString(), status: 'חדש', ...lead });
      if (!writeJSON(STORE.leads, leads)) throw new Error('storage');
      return;
    }
    const res = await fetch(`${CFG.supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify(lead)
    });
    if (!res.ok) throw new Error('lead ' + res.status);
  }

  // ---------- טופס הפניות ----------
  function setupForm() {
    const form = document.getElementById('lead-form');
    if (!form) return;
    const field = n => form.querySelector(`[name="${n}"]`);
    const msg = form.querySelector('.lead__msg');
    const button = form.querySelector('.lead__submit');
    const say = (text, bad) => { msg.textContent = text; msg.classList.toggle('lead__msg--bad', Boolean(bad)); };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (field('company').value) return; // מלכודת לרובוטים
      const name = field('name').value.trim();
      const phone = field('phone').value.trim();
      if (!name) { say('איך קוראים לך?', true); field('name').focus(); return; }
      if (digits(phone).length < 9) { say('חסר מספר טלפון תקין', true); field('phone').focus(); return; }
      const lead = {
        name: name.slice(0, 80),
        phone: phone.slice(0, 20),
        service: field('service').value.slice(0, 60) || null,
        message: field('message').value.trim().slice(0, 1000) || null
      };
      button.disabled = true;
      say('שולח...');
      try {
        await addLead(lead);
        form.querySelectorAll('.lead__field, .lead__submit, .lead__msg').forEach(el => { el.hidden = true; });
        form.querySelector('.lead__done').hidden = false;
      } catch {
        button.disabled = false;
        say('משהו השתבש. אפשר להתקשר או לשלוח וואצאפ, ונחזור אליכם.', true);
      }
    });
  }

  // ---------- טעינה ----------
  async function init() {
    collectDefaults();
    try { Object.assign(state, await loadContent()); } catch { /* נשארים עם התוכן המקורי */ }
    apply(state);
    setupForm();
    // באתר חי שעוד לא מחובר לענן, פנייה לא תגיע לבעל האתר. לכן מסתירים את הטופס עד החיבור, ונשארים עם וואצאפ, טלפון ומייל.
    const host = location.hostname;
    const local = !host || host === 'localhost' || host === '127.0.0.1';
    if (!LIVE && !local) document.documentElement.classList.add('no-form');

    if (new URLSearchParams(location.search).has('admin')) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'admin/admin.css';
      document.head.append(css);
      const js = document.createElement('script');
      js.src = 'admin/admin.js';
      document.body.append(js);
    }
  }

  window.LazySite = {
    CFG, LIVE, STORE, THEME_VARS, defaults, state, current, apply, preview, intl, digits,
    demo: {
      getContent: () => readJSON(STORE.content, {}),
      setContent: c => writeJSON(STORE.content, c),
      getLeads: () => readJSON(STORE.leads, []),
      setLeads: l => writeJSON(STORE.leads, l),
      isSeeded: () => readJSON(STORE.seeded, false),
      markSeeded: () => writeJSON(STORE.seeded, true)
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
