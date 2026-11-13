// הופעה עדינה של מקטעים בגלילה, פעם אחת בלבד.
// המחלקה js נוספת כבר בראש העמוד. בלי JavaScript, הכל מוצג כרגיל.
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }

  // סרטונים: הסרטון נטען רק בלחיצה על התמונה, ורק סרטון אחד מנגן בכל רגע.
  // בלי JavaScript, התמונה היא קישור רגיל לקובץ הסרטון.
  document.querySelectorAll('.vid__poster[data-video]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.vid__poster video').forEach(v => v.pause());
      const v = document.createElement('video');
      v.src = a.dataset.video;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.setAttribute('aria-label', a.getAttribute('aria-label') || 'סרטון');
      a.replaceChildren(v);
      a.classList.add('vid__poster--on');
      a.removeAttribute('href');
      v.focus({ preventScroll: true });
    });
  });
});
