/* ============================================================
   Tomurcuk Kids — Main Site JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Page Loader ---
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }

  // --- Mobile Menu ---
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Header Background on Scroll ---
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      header.classList.add('header-bg');
    } else {
      header.classList.remove('header-bg');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally unobserve after reveal for performance
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // --- Contact Form ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Gönderiliyor...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        childAge: formData.get('childAge'),
        program: formData.get('program'),
        message: formData.get('message'),
      };

      try {
        // For now, just simulate success and redirect to WhatsApp
        // In production, send to your backend
        const whatsappMsg = encodeURIComponent(
          `Merhaba, Tomurcuk Kids ile ilgili bilgi almak istiyorum.\n\n` +
          `Adım: ${data.name}\n` +
          `Telefon: ${data.phone}\n` +
          (data.childAge ? `Çocuk Yaşı: ${data.childAge}\n` : '') +
          (data.program ? `Program: ${data.program}\n` : '') +
          (data.message ? `Mesaj: ${data.message}` : '')
        );

        // Show success feedback
        submitBtn.innerHTML = '✓ Yönlendiriliyor...';

        // Redirect to WhatsApp after brief delay
        setTimeout(() => {
          window.open(`https://wa.me/905062684601?text=${whatsappMsg}`, '_blank');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 800);

      } catch (err) {
        submitBtn.innerHTML = 'Bir hata oluştu';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  }

  // --- Counter Animation ---
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, 20);
  }

  // Animate stats when they come into view
  const heroStats = document.querySelectorAll('.hero-stat h3');
  if (heroStats.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targets = [16, 6, 5];
          heroStats.forEach((el, i) => {
            if (targets[i]) animateCounter(el, targets[i]);
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    heroStats.forEach(el => statsObserver.observe(el));
  }
});