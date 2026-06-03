/* =============================================
   德职通官网 · JavaScript
   main.js
   ============================================= */

// ——— Navbar scroll effect ———
const navbar = document.getElementById('navbar');
const handleScroll = () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// ——— Mobile nav toggle ———
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ——— Product tabs ———
const tabBtns  = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');
  });
});

// ——— Partner tabs ———
const ptabBtns   = document.querySelectorAll('.ptab-btn');
const ptabPanels = document.querySelectorAll('.ptab-panel');
ptabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.ptab;
    ptabBtns.forEach(b => b.classList.remove('active'));
    ptabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('ptab-' + target).classList.add('active');
  });
});

// ——— FAQ accordion ———
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item   = q.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = q.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-q').forEach(oq => {
      oq.classList.remove('open');
      oq.closest('.faq-item').querySelector('.faq-a').classList.remove('show');
    });

    // Toggle clicked
    if (!isOpen) {
      q.classList.add('open');
      answer.classList.add('show');
    }
  });
});

// ——— Scroll reveal (IntersectionObserver) ———
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Add reveal class to section children
document.querySelectorAll([
  '.adv-card', '.wave-card', '.hl-card', '.career-card',
  '.pcard', '.gcard', '.st-item', '.guarantee-cards .gcard',
  '.conn-item', '.founder-card', '.vision-card'
].join(',')).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealObserver.observe(el);
});

// ——— Contact form ———
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;

    // 收集表单数据
    const formData = {
      name: form.querySelector('#name').value.trim(),
      phone: form.querySelector('#phone').value.trim(),
      interest: form.querySelector('#interest').value,
      message: form.querySelector('#message').value.trim(),
    };

    // 前端基本校验
    if (!formData.name || !formData.phone || !formData.message) {
      alert('请填写姓名、联系方式和留言内容');
      return;
    }

    // 加载状态
    btn.textContent = '⏳ 提交中...';
    btn.disabled = true;

    try {
      // TODO: 替换为腾讯云 SCF 的实际 HTTP 触发地址
      const SCF_URL = 'https://service-xxxxxxx.gz.apigw.tencentcs.com/release/dezhitong-contact';

      const res = await fetch(SCF_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        btn.textContent = '✓ 提交成功！';
        btn.style.background = 'linear-gradient(135deg, #4caf50, #388e3c)';
        btn.style.color = '#fff';
        form.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }, 5000);
      } else {
        alert(data.message || '提交失败，请稍后重试');
        btn.textContent = original;
        btn.disabled = false;
      }
    } catch (err) {
      console.error('提交失败:', err);
      alert('网络异常，请稍后重试或直接联系我们');
      btn.textContent = original;
      btn.disabled = false;
    }
  });
}

// ——— Smooth scroll for anchor links ———
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ——— Active nav link on scroll ———
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activateNav = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) {
      current = s.id;
    }
  });
  navAnchors.forEach(a => {
    a.style.fontWeight = a.getAttribute('href') === '#' + current ? '700' : '';
  });
};
window.addEventListener('scroll', activateNav, { passive: true });
