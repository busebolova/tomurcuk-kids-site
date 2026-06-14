const header = document.getElementById('header');
const preloader = document.getElementById('preloader');

const hidePreloader = () => {
  if (preloader) preloader.classList.add('hidden');
};

const waitForHeroImage = () => new Promise((resolve) => {
  if (document.body.dataset.page !== 'home') {
    resolve();
    return;
  }
  const image = new Image();
  image.onload = () => {
    if (image.decode) image.decode().catch(() => {}).finally(resolve);
    else resolve();
  };
  image.onerror = resolve;
  image.src = 'assets/tomurcuk-hero.png';
});

window.addEventListener('load', () => {
  Promise.all([
    waitForHeroImage(),
    new Promise((resolve) => setTimeout(resolve, 520))
  ]).then(hidePreloader);
});
setTimeout(hidePreloader, 2600);

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 24);
  document.body.classList.toggle('page-scrolled', window.scrollY > 520);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.bottom-nav a').forEach((link) => {
  const target = link.getAttribute('href');
  if (target && target.endsWith('.html')) {
    const page = location.pathname.split('/').pop() || 'index.html';
    if (target === page) link.classList.add('active');
  }
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}
