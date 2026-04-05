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


/* =========================
   CARD STACK FIX (정상버전)
========================= */

window.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector(".section-card-stack");
  const items = document.querySelectorAll(".stack-item");
  const images = document.querySelectorAll(".stack-image img");

  function updateStack() {
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;

    let scroll = -rect.top;
    scroll = Math.max(0, Math.min(scroll, total));

    const progress = scroll / total;

    let index = Math.floor(progress * items.length);
    index = Math.max(0, Math.min(items.length - 1, index));

    items.forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });

    images.forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });
  }

  window.addEventListener("scroll", updateStack);
  updateStack(); // 🔥 초기 실행

});

/* =========================
   데이터 넘버
========================= */


const counters = document.querySelectorAll(".data-number");
const dataSection = document.querySelector(".section-data");

let counted = false;

const runCounter = () => {
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const suffix = counter.textContent.replace(/[0-9]/g, ""); // +, 억, 만, %

    let current = 0;
    const duration = 1200;
    const increment = target / (duration / 16);

    const update = () => {
      current += increment;

      if (current < target) {
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + suffix;
      }
    };

    update();
  });
};

const dataObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counted) {
      runCounter();
      counted = true;
    }
  });
}, {
  threshold: 0.4
});

if (dataSection) {
  dataObserver.observe(dataSection);
}

/* =========================
   모바일 햄버거 메뉴
========================= */

(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // 링크 클릭 시 메뉴 닫기
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* =========================
   문의 모달
========================= */

(() => {
  const overlay = document.getElementById('contactModal');
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!overlay) return;

  // 열기
  document.querySelectorAll('[data-modal="contact"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // 닫기
  const closeModal = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });

  // 폼 제출
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 유효성 검사
    const inputs = form.querySelectorAll('[required]');
    let valid = true;
    inputs.forEach(input => {
      input.classList.remove('error');
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      }
      if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.classList.add('error');
        valid = false;
      }
    });

    if (!valid) return;

    // Google Sheets로 전송
    const submitBtn = form.querySelector('.form-submit');
    submitBtn.textContent = '전송 중...';
    submitBtn.disabled = true;

    fetch('https://script.google.com/macros/s/AKfycbwrx5tCXNzcRl5yylGEN8vjuWsyOt8FSPMXWsD0EfZuHiu7d-x1AqArsA-bhkb6Yg6j/exec', {
      method: 'POST',
      body: JSON.stringify({
        name: form.querySelector('#form-name').value,
        email: form.querySelector('#form-email').value,
        company: form.querySelector('#form-company').value,
        type: form.querySelector('#form-type').value,
        message: form.querySelector('#form-message').value
      })
    })
    .then(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    })
    .catch(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    })
    .finally(() => {
      submitBtn.textContent = '문의 보내기';
      submitBtn.disabled = false;
    });
  });

  // 모달 닫힐 때 폼 리셋
  const observer = new MutationObserver(() => {
    if (!overlay.classList.contains('active')) {
      setTimeout(() => {
        form.reset();
        form.style.display = '';
        success.style.display = 'none';
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      }, 300);
    }
  });
  observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
})();
