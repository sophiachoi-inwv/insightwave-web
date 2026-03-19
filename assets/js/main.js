const header = document.getElementById('siteHeader');
const hero = document.getElementById('hero');
const revealItems = document.querySelectorAll('.reveal-item');

// header shrink
window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// body tone switch
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.body.classList.remove('light-surface');
      } else {
        document.body.classList.add('light-surface');
      }
    });
  },
  {
    threshold: 0.18
  }
);

if (hero) heroObserver.observe(hero);

// reveal animation
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  {
    threshold: 0.16
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

/* 추가된 부분 */
document.querySelector('.section-intro')?.classList.add('in-view');

document
  .querySelectorAll(
    '.build-card, .split-media, .split-content, .banner-panel, .team-panel, .team-side, .proof-card, .cta-panel'
  )
  .forEach((el) => revealObserver.observe(el));
