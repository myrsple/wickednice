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

  // --- Language Switcher ---
  (function () {
    var path = window.location.pathname;
    var isCs = /\/cs(\/|\/[^/]*)?$/.test(path);
    var page = path.split('/').pop();
    if (!page || !page.includes('.')) page = '';

    // First visit: auto-detect Czech browser
    if (!localStorage.getItem('wn-lang')) {
      var browserLang = (navigator.language || '').toLowerCase();
      localStorage.setItem('wn-lang', browserLang.startsWith('cs') ? 'cs' : 'en');
      if (browserLang.startsWith('cs') && !isCs) {
        window.location.replace('cs/' + page);
        return;
      }
    }

    // Ensure correct active state without animation (handles cached HTML)
    var allBtns = document.querySelectorAll('.lang-btn');
    allBtns.forEach(function (btn) {
      btn.style.transition = 'none';
      var isCzBtn = btn.textContent.trim() === 'CZ';
      btn.classList.toggle('lang-btn--active', isCzBtn === isCs);
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        allBtns.forEach(function (btn) { btn.style.transition = ''; });
      });
    });

    // Clicking any lang button toggles to the other language
    var navigating = false;
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (navigating) return;
        navigating = true;

        // Animate the toggle
        document.querySelectorAll('.lang-btn').forEach(function (b) {
          b.classList.toggle('lang-btn--active');
        });

        // Save scroll position and open accordions
        var langState = { scrollY: window.scrollY, active: [] };
        document.querySelectorAll('.service-item.active, .proj-item.active').forEach(function (el) {
          var key = el.getAttribute('data-service') || el.getAttribute('data-project');
          if (key) langState.active.push(key);
        });
        sessionStorage.setItem('wn-lang-state', JSON.stringify(langState));

        // Navigate after the CSS transition completes
        setTimeout(function () {
          if (isCs) {
            localStorage.setItem('wn-lang', 'en');
            window.location.href = '../' + page;
          } else {
            localStorage.setItem('wn-lang', 'cs');
            window.location.href = 'cs/' + page;
          }
        }, 200);
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
          window.scrollTo({ top: headerTop, behavior: 'smooth' });
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
        window.scrollTo({ top: headerTop, behavior: 'smooth' });

        item.classList.remove('active');
      });
    }
  });

  // --- Momentum Scroll (desktop only) ---
  if (!('ontouchstart' in window) && window.innerWidth > 768) {
    document.documentElement.style.scrollBehavior = 'auto';
    let velocity = 0;
    let remainder = 0;
    let animating = false;
    const resistance = 0.4;
    const decel = 0.7;
    const accel = 0.88;

    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      var targetV = e.deltaY * resistance;
      velocity = velocity + (targetV - velocity) * accel;
      if (!animating) {
        animating = true;
        remainder = 0;
        requestAnimationFrame(momentumStep);
      }
    }, { passive: false });

    function momentumStep() {
      var absV = Math.abs(velocity);
      if (absV < 1.5) {
        velocity = 0;
        animating = false;
        return;
      }
      var drop = absV < 2 ? absV * 0.5 : decel;
      velocity += velocity > 0 ? -drop : drop;

      remainder += velocity;
      var px = Math.trunc(remainder);
      if (px !== 0) {
        window.scrollBy(0, px);
        remainder -= px;
      }
      requestAnimationFrame(momentumStep);
    }
  }

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
