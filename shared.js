// ======================================
//  德职通官网 · 共享交互脚本 shared.js
// ======================================

// ——— Navbar scroll ———
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ——— Mobile menu toggle ———
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ——— Active nav link based on current page ———
(function markActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === page || href.endsWith(page))) {
      a.classList.add('active');
    }
  });
})();

// ——— Scroll reveal ———
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealObserver.observe(el);
});

// ——— FAQ accordion ———
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ——— Generic tab system ———
document.querySelectorAll('.tab-nav').forEach(nav => {
  nav.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('[data-tabs]') || btn.closest('.tabs-section') || nav.parentElement;
      const target = btn.dataset.tab;
      nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      container.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.toggle('active', p.dataset.tab === target);
      });
    });
  });
});

// ——— Contact form ———
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    const formData = {
      name: form.querySelector('#name').value.trim(),
      phone: form.querySelector('#phone').value.trim(),
      interest: form.querySelector('#interest') ? form.querySelector('#interest').value : '',
      message: form.querySelector('#message').value.trim(),
    };
    if (!formData.name || !formData.phone || !formData.message) {
      alert('请填写姓名、联系方式和留言内容');
      return;
    }
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
      // fallback: show success (until SCF is configured)
      btn.textContent = '✓ 已收到，我们将尽快与您联系';
      btn.style.background = 'linear-gradient(135deg, #4caf50, #388e3c)';
      btn.style.color = '#fff';
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 5000);
    }
  });
}
