// =========================================
// WICKED NICE — Interactive Behaviors
// =========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Restore state after language switch ---
  (function () {
    var saved = sessionStorage.getItem('wn-lang-state');
    if (!saved) return;
    sessionStorage.removeItem('wn-lang-state');
    try {
      var state = JSON.parse(saved);

      // Open accordions without animation
      state.active.forEach(function (key) {
        var item = document.querySelector('[data-service="' + key + '"], [data-project="' + key + '"]');
        if (!item) return;
        item.classList.add('active');
        var content = item.querySelector('.service-content, .proj-detail');
        if (content) content.style.transition = 'none';
        var closeBtn = item.querySelector('.proj-close');
        if (closeBtn) { closeBtn.style.opacity = '1'; closeBtn.style.pointerEvents = 'auto'; }
      });

      // Restore scroll position
      window.scrollTo(0, state.scrollY);
      requestAnimationFrame(function () {
        window.scrollTo(0, state.scrollY);
        // Re-enable transitions
        requestAnimationFrame(function () {
          document.querySelectorAll('.service-content, .proj-detail').forEach(function (el) {
            el.style.transition = '';
          });
        });
      });
    } catch (e) {}
  })();

  // --- Service Accordion ---
  document.querySelectorAll('.services-list').forEach(list => {
    const items = list.querySelectorAll('.service-item');
    items.forEach(item => {
      const header = item.querySelector('.service-header');
      header.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');

        // Close all within this list
        items.forEach(si => si.classList.remove('active'));

        // Open clicked (unless it was already open)
        if (!wasActive) {
          item.classList.add('active');
        }
      });
    });
  });

  // --- Smooth Scroll for Nav Links ---
  document.querySelectorAll('.menu-link[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const menuHeight = document.querySelector('.menu').offsetHeight;
        const labels = target.querySelectorAll('.services-label, .who-label, .gallery-label, .proj-list-label');
        const label = Array.from(labels).find(l => l.offsetParent !== null || getComputedStyle(l).display !== 'none');
        const scrollTarget = label || target;
        const targetTop = scrollTarget.getBoundingClientRect().top + window.scrollY - menuHeight - 10;
        window.scrollTo({ top: targetTop, behavior: 'instant' });
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
          window.scrollTo({ top: targetTop, behavior: 'instant' });
        }
      });
    });

    // Close on page link click (non-hash links)
    mobileNav.querySelectorAll('.mobile-nav-link:not([href^="#"])').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // --- Language Switcher (teaser – bounces back to EN) ---
  (function () {
    var allBtns = document.querySelectorAll('.lang-btn');

    // Ensure EN is always active on load
    allBtns.forEach(function (btn) {
      btn.style.transition = 'none';
      var isEn = btn.textContent.trim() === 'EN';
      btn.classList.toggle('lang-btn--active', isEn);
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        allBtns.forEach(function (btn) { btn.style.transition = ''; });
      });
    });

    // Click CZ: toggle to CZ briefly, then bounce back to EN
    var bouncing = false;
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (bouncing) return;
        var isEn = btn.textContent.trim() === 'EN';
        if (isEn) return; // already on EN, do nothing

        bouncing = true;
        allBtns.forEach(function (b) { b.classList.toggle('lang-btn--active'); });

        setTimeout(function () {
          allBtns.forEach(function (b) { b.classList.toggle('lang-btn--active'); });
          bouncing = false;
        }, 300);
      });
    });
  })();

  // --- Active Menu Highlight on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const menuLinks = document.querySelectorAll('.menu-link[href^="#"]');

  const observerOptions = {
    rootMargin: '-5% 0px -80% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        menuLinks.forEach(link => {
          link.classList.toggle('menu-link--current', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // When scrolled to the very bottom, activate the last section's nav link
  // (only matters on desktop where .menu-nav is visible)
  window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        const id = lastSection.getAttribute('id');
        menuLinks.forEach(link => {
          link.classList.toggle('menu-link--current', link.getAttribute('href') === `#${id}`);
        });
      }
    }
  }, { passive: true });

  // --- Marquee Strips ---
  document.querySelectorAll('.monogram-strip').forEach(strip => {
    const inner = strip.querySelector('.monogram-strip-inner');
    const monoSet = inner.querySelector('.mono-set');

    const baseSpeed = 90;
    const hoverSpeed = 600;
    let currentSpeed = baseSpeed;
    let targetSpeed = baseSpeed;
    let offset = 0;
    let lastTime = null;

    if (!strip.classList.contains('star-strip')) {
      strip.addEventListener('mouseenter', () => { targetSpeed = hoverSpeed; });
      strip.addEventListener('mouseleave', () => { targetSpeed = baseSpeed; });
    }

    function marqueeLoop(timestamp) {
      if (lastTime === null) lastTime = timestamp;
      const delta = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      currentSpeed += (targetSpeed - currentSpeed) * Math.min(delta * 5, 1);

      offset -= currentSpeed * delta;
      const setWidth = monoSet.offsetWidth;
      if (offset <= -setWidth) offset += setWidth;

      inner.style.transform = `translate3d(${offset}px, 0, 0)`;
      requestAnimationFrame(marqueeLoop);
    }

    requestAnimationFrame(marqueeLoop);
  });

  // --- Star Tile Rotation on Hover ---
  document.querySelectorAll('.star-strip').forEach(strip => {
    const sets = strip.querySelectorAll('.mono-set');

    function spinTile(tile) {
      if (!tile || tile.dataset.spinning) return;

      const parentSet = tile.closest('.mono-set');
      const index = Array.from(parentSet.children).indexOf(tile);
      const twins = Array.from(sets).map(s => s.children[index]);

      twins.forEach(t => { t.dataset.spinning = '1'; });
      const start = performance.now();

      function frame(now) {
        const t = Math.min((now - start) / 3000, 1);
        const rot = `rotate(${t * 360}deg)`;
        twins.forEach(tw => { tw.style.transform = rot; });
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          twins.forEach(tw => { tw.style.transform = ''; delete tw.dataset.spinning; });
        }
      }

      requestAnimationFrame(frame);
    }

    let pointerX = null;
    let pointerY = null;

    strip.addEventListener('pointermove', (e) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      spinTile(e.target.closest('.mono-tile'));
    });

    strip.addEventListener('pointerleave', () => {
      pointerX = null;
      pointerY = null;
    });

    function pollCursor() {
      if (pointerX !== null) {
        const el = document.elementFromPoint(pointerX, pointerY);
        if (el) spinTile(el.closest('.mono-tile'));
      }
      requestAnimationFrame(pollCursor);
    }

    requestAnimationFrame(pollCursor);
  });

  // --- Projects Page Accordion ---
  const projItems = document.querySelectorAll('.proj-item');

  projItems.forEach(item => {
    const header = item.querySelector('.proj-header');
    const closeBtn = item.querySelector('.proj-close');

    const detail = item.querySelector('.proj-detail');

    // Show close button after accordion opens
    if (detail && closeBtn) {
      detail.addEventListener('transitionend', () => {
        if (item.classList.contains('active')) {
          closeBtn.style.opacity = '1';
          closeBtn.style.pointerEvents = 'auto';
        }
      });
    }

    function openProject() {
      const wasActive = item.classList.contains('active');
      const hadOtherOpen = !wasActive && document.querySelector('.proj-item.active');

      // Close all and hide close buttons
      projItems.forEach(pi => {
        pi.classList.remove('active');
        const btn = pi.querySelector('.proj-close');
        if (btn) { btn.style.opacity = '0'; btn.style.pointerEvents = 'none'; }
      });

      // Toggle clicked
      if (!wasActive) {
        item.classList.add('active');

        // Pin the header to a stable viewport position while layout shifts
        const menuHeight = document.querySelector('.menu').offsetHeight;
        const targetY = menuHeight + 10;
        const start = performance.now();

        function pinScroll() {
          const diff = item.getBoundingClientRect().top - targetY;
          if (Math.abs(diff) > 1) {
            window.scrollBy(0, diff);
          }
          if (performance.now() - start < 600) {
            requestAnimationFrame(pinScroll);
          }
        }

        if (hadOtherOpen) {
          requestAnimationFrame(pinScroll);
        } else {
          // First open – smooth scroll to header
          const headerTop = item.getBoundingClientRect().top + window.scrollY - targetY;
          window.scrollTo({ top: headerTop, behavior: 'instant' });
        }
      }
    }

    if (header) {
      header.addEventListener('click', openProject);
    }

    const thumbs = item.querySelector('.proj-thumbs');
    if (thumbs) {
      thumbs.style.cursor = 'pointer';
      thumbs.addEventListener('click', openProject);
      thumbs.addEventListener('mouseenter', () => item.classList.add('thumbs-hover'));
      thumbs.addEventListener('mouseleave', () => item.classList.remove('thumbs-hover'));
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeBtn.style.opacity = '0';
        closeBtn.style.pointerEvents = 'none';

        // Scroll to the project header as it closes
        const menuHeight = document.querySelector('.menu').offsetHeight;
        const headerTop = item.getBoundingClientRect().top + window.scrollY - menuHeight - 10;
        window.scrollTo({ top: headerTop, behavior: 'instant' });

        item.classList.remove('active');
      });
    }
  });



  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (lightbox && lightboxImg) {
    let currentImages = [];
    let currentIndex = 0;

    // Click gallery images to open
    document.querySelectorAll('.proj-detail-img img').forEach(img => {
      img.addEventListener('click', () => {
        const projItem = img.closest('.proj-item');
        currentImages = Array.from(projItem.querySelectorAll('.proj-detail-img img'));
        currentIndex = currentImages.indexOf(img);
        showImage();
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    function showImage() {
      lightboxImg.src = currentImages[currentIndex].src;
    }

    function navigate(dir) {
      currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
      showImage();
    }

    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  // --- Open Project Accordion from URL Hash ---
  (function () {
    var hash = window.location.hash.slice(1);
    if (!hash) return;
    var item = document.querySelector('.proj-item#' + CSS.escape(hash));
    if (!item) return;

    // Close any open project
    document.querySelectorAll('.proj-item.active').forEach(function (pi) {
      pi.classList.remove('active');
      var btn = pi.querySelector('.proj-close');
      if (btn) { btn.style.opacity = '0'; btn.style.pointerEvents = 'none'; }
    });

    // Open the target project
    item.classList.add('active');

    // Scroll to it after layout settles
    requestAnimationFrame(function () {
      var menuHeight = document.querySelector('.menu').offsetHeight;
      var top = item.getBoundingClientRect().top + window.scrollY - menuHeight - 10;
      window.scrollTo({ top: top, behavior: 'instant' });
    });
  })();

  // --- Contact Form (Formspree AJAX) ---
  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('.contact-submit');
      var originalText = btn.textContent;

      btn.disabled = true;
      btn.textContent = 'Sending...';

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          btn.textContent = 'Sent!';
          setTimeout(function () {
            contactForm.reset();
            btn.textContent = originalText;
            btn.disabled = false;
          }, 2000);
        } else {
          btn.textContent = 'Try again';
          setTimeout(function () {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 2000);
        }
      }).catch(function () {
        btn.textContent = 'Try again';
        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      });
    });
  }

});
