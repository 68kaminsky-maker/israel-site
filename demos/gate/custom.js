// מסך "שער": כפתור פתיחה ידני לבעל העסק, וקישור אישי עם וואטסאפ לכל סוכן.
(function () {
  const CFG = window.APP_CONFIG || {};
  const pageUrl = () => new URL('open.html', location.href).href.replace(/[#?].*$/, '');
  const digits = s => String(s || '').replace(/\D/g, '');
  const intl = s => { let d = digits(s); if (d.startsWith('972')) return d; if (d.startsWith('0')) d = d.slice(1); return '972' + d; };
  const personalLink = a => pageUrl() + '#c=' + digits(a.code);
  const hoursText = a => (a.from && a.to) ? `${a.from}–${a.to}` : 'ללא הגבלת שעות';

  window.LazyApp.view('gate', (params, h) => {
    const agents = (h.rows.agents || []).filter(a => a.status === 'פעיל');
    const rows = agents.map(a => {
      const link = personalLink(a);
      const text = `היי ${a.name}, זה הקישור האישי שלך לפתיחת השער:\n${link}\n\nהקוד האישי שלך: ${digits(a.code)}\nחשוב: שמור את הקוד, תצטרך אותו בכל כניסה.\nפותחים את הקישור ולוחצים "פתח את השער".`;
      const wa = a.phone ? `https://wa.me/${intl(a.phone)}?text=${encodeURIComponent(text)}` : '';
      return `<div class="item" style="flex-wrap:wrap;gap:8px">
        <span class="item__av">${h.icon('users')}</span>
        <span class="item__main"><b>${h.esc(a.name)}</b><small class="ltr">${h.esc(a.code)} · ${h.esc(hoursText(a))}</small></span>
        ${wa ? `<a class="chip-btn" href="${wa}" target="_blank" rel="noopener">שלח בוואטסאפ</a>` : ''}
        <button class="chip-btn" type="button" data-copy="${h.esc(link)}">העתק קישור</button>
      </div>`;
    }).join('');

    return `${h.top('שער', CFG.gateEndpoint ? 'מחובר לשער האמיתי' : 'מצב הדגמה: השער לא מחובר עדיין')}
      <section class="card set">
        <h3>פתיחה ידנית</h3>
        <p>לחיצה אחת פותחת את השער, ורשומה נכנסת ליומן.</p>
        <button class="btn" id="gate-open" type="button" style="min-height:64px;font-size:1.25rem;width:100%">פתח את השער עכשיו</button>
      </section>
      <section class="card set" style="${h.settings.lockdown ? 'border:2px solid var(--c-red)' : ''}">
        <h3>נעילת חירום</h3>
        <p>${h.settings.lockdown ? 'כל הקודים של הסוכנים חסומים עכשיו. רק אתה יכול לפתוח את השער.' : 'לחיצה אחת חוסמת את כל הקודים של הסוכנים, אם קוד דלף או אם משהו נראה חשוד. אתה תמשיך לפתוח.'}</p>
        <button class="btn ${h.settings.lockdown ? 'btn--primary' : 'btn--ghost'}" type="button" data-lockdown="${h.settings.lockdown ? 'off' : 'on'}" style="width:100%">${h.settings.lockdown ? 'שחרר את הנעילה' : 'נעל את כל הקודים עכשיו'}</button>
      </section>
      <section class="card set">
        <h3>קישור אישי לכל סוכן</h3>
        <p>לכל סוכן קישור משלו, עם הקוד שלו בפנים. הוא לוחץ פעם אחת ו"פתח את השער", והטלפון זוכר אותו להבא.</p>
      </section>
      <div class="list">${rows || '<div class="empty">אין סוכנים פעילים. הוסף סוכן בלשונית "סוכנים".</div>'}</div>`;
  });

  document.addEventListener('click', async e => {
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      try { await navigator.clipboard.writeText(copy.dataset.copy); window.LazyApp.helpers.toast('הקישור הועתק'); }
      catch (err) { window.LazyApp.helpers.toast('לא הצלחתי להעתיק'); }
      return;
    }
    const lock = e.target.closest('[data-lockdown]');
    if (lock) {
      const h = window.LazyApp.helpers;
      const on = lock.dataset.lockdown === 'on';
      try { await h.saveSettings({ lockdown: on }); h.render(); h.toast(on ? 'כל הקודים ננעלו' : 'הנעילה שוחררה'); }
      catch (err) { h.toast('לא הצלחתי לשמור: ' + (err.message || err)); }
      return;
    }
    const btn = e.target.closest('#gate-open');
    if (!btn) return;
    const h = window.LazyApp.helpers;
    btn.disabled = true;
    try {
      if (CFG.gateEndpoint && CFG.supabaseUrl) {
        const jwt = await h.accessToken();
        const res = await fetch(CFG.gateEndpoint, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + (jwt || '') }, body: JSON.stringify({ manual: true }) });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || !out.ok) throw new Error(out.det || out.msg || 'השער לא ענה');
        await h.save('log', { agentName: 'ישראל', result: 'נפתח', when: new Date().toISOString(), note: 'פתיחה ידנית' });
        h.toast('השער נפתח');
      } else {
        await h.save('log', { agentName: 'ישראל', result: 'נפתח', when: new Date().toISOString(), note: 'פתיחה ידנית' });
        h.toast('הדגמה: השער נפתח על המסך');
      }
    } catch (err) {
      h.toast('לא הצלחתי לפתוח: ' + err.message);
    }
    btn.disabled = false;
  });
})();
