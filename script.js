// =========================================
// WICKED NICE — Interactive Behaviors
// =========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Service Accordion ---
  const serviceItems = document.querySelectorAll('.service-item');

  serviceItems.forEach(item => {
    const header = item.querySelector('.service-header');
    header.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');

      // Close all
      serviceItems.forEach(si => si.classList.remove('active'));

      // Open clicked (unless it was already open)
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

  // --- Hamburger Menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  const closeNav = () => {
    if (hamburger) hamburger.classList.remove('is-open');
    if (mobileNav) mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open');
      document.body.style.overflow = mobileNav.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close button inside panel
    const mobileNavClose = document.getElementById('mobileNavClose');
    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', closeNav);
    }

    // Close mobile nav on hash link click
    mobileNav.querySelectorAll('.mobile-nav-link[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        closeNav();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          const menuHeight = document.querySelector('.menu').offsetHeight;
          const targetTop = target.getBoundingClientRect().top + window.scrollY - menuHeight;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });

    // Close on page link click (non-hash links)
    mobileNav.querySelectorAll('.mobile-nav-link:not([href^="#"])').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // --- Language Toggle (all instances) ---
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Sync all lang buttons across menu and mobile nav
      const lang = btn.textContent.trim();
      langBtns.forEach(b => {
        b.classList.toggle('lang-btn--active', b.textContent.trim() === lang);
      });
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

  // --- Monogram Marquee ---
  const strip = document.querySelector('.monogram-strip');
  const inner = document.querySelector('.monogram-strip-inner');
  const monoSet = inner.querySelector('.mono-set');

  const baseSpeed = 90; // px per second
  const hoverSpeed = 600; // faster
  let currentSpeed = baseSpeed;
  let targetSpeed = baseSpeed;
  let offset = 0;
  let lastTime = null;

  strip.addEventListener('mouseenter', () => { targetSpeed = hoverSpeed; });
  strip.addEventListener('mouseleave', () => { targetSpeed = baseSpeed; });

  function marqueeLoop(timestamp) {
    if (lastTime === null) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // Smooth speed interpolation
    currentSpeed += (targetSpeed - currentSpeed) * Math.min(delta * 5, 1);

    offset -= currentSpeed * delta;
    const setWidth = monoSet.offsetWidth;
    if (offset <= -setWidth) offset += setWidth;

    inner.style.transform = `translate3d(${offset}px, 0, 0)`;
    requestAnimationFrame(marqueeLoop);
  }

  requestAnimationFrame(marqueeLoop);

  // --- Projects Page Accordion ---
  const projItems = document.querySelectorAll('.proj-item');

  projItems.forEach(item => {
    const header = item.querySelector('.proj-header');
    const closeBtn = item.querySelector('.proj-close');

    if (header) {
      header.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');

        // Close all
        projItems.forEach(pi => pi.classList.remove('active'));

        // Toggle clicked
        if (!wasActive) {
          item.classList.add('active');
          // Scroll to the project header
          const menuHeight = document.querySelector('.menu').offsetHeight;
          const headerTop = item.getBoundingClientRect().top + window.scrollY - menuHeight - 10;
          window.scrollTo({ top: headerTop, behavior: 'smooth' });
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        item.classList.remove('active');
      });
    }
  });

});
