// הופעה עדינה של מקטעים בגלילה, פעם אחת בלבד.
// המחלקה js נוספת כבר בראש העמוד. בלי JavaScript, הכל מוצג כרגיל.
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach(el => io.observe(el));
});
