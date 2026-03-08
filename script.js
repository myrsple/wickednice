// =========================================
// WICKED NICE — Interactive Behaviors
// =========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Service Accordion ---
  const serviceItems = document.querySelectorAll('.service-item');

  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');

      // Deactivate all
      serviceItems.forEach(si => si.classList.remove('active'));

      // Toggle clicked
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Smooth Scroll for Nav Links ---
  document.querySelectorAll('.menu-link[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const menuHeight = document.querySelector('.menu').offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - menuHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  // --- Language Toggle ---
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('lang-btn--active'));
      btn.classList.add('lang-btn--active');
    });
  });

  // --- Active Menu Highlight on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const menuLinks = document.querySelectorAll('.menu-link[href^="#"]');

  const observerOptions = {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        menuLinks.forEach(link => {
          link.style.opacity = link.getAttribute('href') === `#${id}` ? '0.5' : '';
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

});
