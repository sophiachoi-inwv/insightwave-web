const header = document.getElementById('siteHeader');
const hero = document.getElementById('hero');
const introSection = document.querySelector('.section-intro');

window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
});

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
    threshold: 0.16
  }
);

if (hero) heroObserver.observe(hero);

if (introSection) {
  const introObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          introSection.classList.add('in-view');
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  introObserver.observe(introSection);
}

const revealTargets = document.querySelectorAll('.reveal-item');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -10% 0px"
  }
);

revealTargets.forEach((item) => revealObserver.observe(item));


const cards = document.querySelectorAll(".card-item");
const section = document.querySelector(".section-card-stack");

if (cards.length && section) {

  // 👉 초기 상태 (첫 카드 강제 활성화)
  cards[0].classList.add("active");

  window.addEventListener("scroll", () => {
    const rect = section.getBoundingClientRect();

    // 👉 화면 안에 들어왔을 때만 실행
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {

      const progress = Math.min(
        1,
        Math.max(0, -rect.top / (section.offsetHeight - window.innerHeight))
      );

      const index = Math.min(
        cards.length - 1,
        Math.floor(progress * cards.length)
      );

      cards.forEach((card, i) => {
        if (i === index) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      });

    }
  });
}
