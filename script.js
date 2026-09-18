/**
 * Autoškola Ladislav Mikuš (Rýmařov)
 * Production static script (ES2020)
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Next Theory Date Calculation
     ========================================================================== */
  function getISOWeekNumber(d) {
    // Target Thursday in current week decides the ISO year
    const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNr = target.getUTCDay() || 7; // 1 = Mon, ..., 7 = Sun
    target.setUTCDate(target.getUTCDate() + 4 - dayNr);
    const isoYear = target.getUTCFullYear();

    // Thursday of week 1 is the Thursday of the week containing Jan 4
    const jan4 = new Date(Date.UTC(isoYear, 0, 4));
    const jan4DayNr = jan4.getUTCDay() || 7;
    const thuWeek1 = new Date(Date.UTC(isoYear, 0, 4 + 4 - jan4DayNr));

    return 1 + Math.round((target.getTime() - thuWeek1.getTime()) / (7 * 24 * 60 * 60 * 1000));
  }

  function getNextTheoryDate(now = new Date()) {
    const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 4 = Thu
    let isTodayEligible = false;

    if (dayOfWeek === 4) {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      if (hours < 15 || (hours === 15 && minutes < 30)) {
        isTodayEligible = true;
      }
    }

    if (!isTodayEligible) {
      const daysUntilThursday = ((4 - dayOfWeek + 7) % 7) || 7;
      candidate.setDate(candidate.getDate() + daysUntilThursday);
    }

    // Must be an odd ISO week
    while (getISOWeekNumber(candidate) % 2 === 0) {
      candidate.setDate(candidate.getDate() + 7);
    }

    return candidate;
  }

  function renderNextTheoryDate() {
    const timeEl = document.getElementById('nextTheoryTime');
    if (!timeEl) return;

    const targetDate = getNextTheoryDate();
    const formatter = new Intl.DateTimeFormat('cs-CZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
    });

    let formattedDate = formatter.format(targetDate).replace(',', '').trim();
    if (!formattedDate.endsWith('.')) {
      formattedDate += '.';
    }

    const displayText = `${formattedDate} od 15:30`;
    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dd = String(targetDate.getDate()).padStart(2, '0');
    const isoString = `${yyyy}-${mm}-${dd}T15:30`;

    timeEl.textContent = displayText;
    timeEl.setAttribute('datetime', isoString);
  }

  renderNextTheoryDate();

  /* ==========================================================================
     2. Statement Paragraph Scroll Word-Fill
     ========================================================================== */
  const statementParagraph = document.getElementById('statementParagraph');
  if (statementParagraph) {
    const rawText = statementParagraph.textContent.trim();
    const words = rawText.split(/[ \t\n\r]+/).filter(Boolean);
    statementParagraph.innerHTML = '';

    const wordSpans = words.map((word, index) => {
      const span = document.createElement('span');
      span.className = 'statement-word';
      span.textContent = word;
      statementParagraph.appendChild(span);
      if (index < words.length - 1) {
        statementParagraph.appendChild(document.createTextNode(' '));
      }
      return span;
    });

    let ticking = false;
    function updateWordFill() {
      ticking = false;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        wordSpans.forEach((span) => {
          span.style.color = 'var(--ink)';
        });
        return;
      }

      const rect = statementParagraph.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = 0.90 * vh;
      const end = 0.65 * vh - rect.height;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      const n = wordSpans.length;

      for (let i = 0; i < n; i++) {
        const wordStart = i / n;
        const wordEnd = (i + 1) / n;

        if (progress >= wordEnd) {
          wordSpans[i].style.color = 'var(--ink)';
        } else if (progress <= wordStart) {
          wordSpans[i].style.color = 'var(--ink-3)';
        } else {
          const t = (progress - wordStart) / (wordEnd - wordStart);
          // Interpolate between ink-3 (#b7bccd -> 183, 188, 205) and ink (#0b1332 -> 11, 19, 50)
          const r = Math.round(183 + (11 - 183) * t);
          const g = Math.round(188 + (19 - 188) * t);
          const b = Math.round(205 + (50 - 205) * t);
          wordSpans[i].style.color = `rgb(${r}, ${g}, ${b})`;
        }
      }
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateWordFill);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateWordFill);
        ticking = true;
      }
    }, { passive: true });

    updateWordFill();
  }

  /* ==========================================================================
     3. Header Scroll Effect & Section Highlight
     ========================================================================== */
  const siteHeader = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (window.scrollY > 8) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  const navLinks = document.querySelectorAll('.site-nav__link');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  /* ==========================================================================
     4. Mobile Navigation Menu
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');

  function openMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    siteNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on link click
    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    }, { passive: true });
  }

  /* ==========================================================================
     5. Hero Video & Autoplay / Pause Controls
     ========================================================================== */
  const heroVideo = document.getElementById('heroVideo');
  const videoToggle = document.getElementById('heroVideoToggle');

  if (heroVideo && videoToggle) {
    const iconPause = videoToggle.querySelector('.icon-pause');
    const iconPlay = videoToggle.querySelector('.icon-play');

    function updateToggleUI(isPaused) {
      if (isPaused) {
        videoToggle.setAttribute('aria-label', 'Přehrát video');
        if (iconPause) iconPause.style.display = 'none';
        if (iconPlay) iconPlay.style.display = 'block';
      } else {
        videoToggle.setAttribute('aria-label', 'Pozastavit video');
        if (iconPause) iconPause.style.display = 'block';
        if (iconPlay) iconPlay.style.display = 'none';
      }
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktopWidth = window.matchMedia('(min-width: 900px)').matches;
    const isSaveData = Boolean(navigator.connection && navigator.connection.saveData);

    const canAutoplay = isDesktopWidth && !prefersReducedMotion && !isSaveData;

    if (canAutoplay) {
      heroVideo.play().then(() => {
        videoToggle.style.display = 'inline-flex';
        updateToggleUI(false);
      }).catch(() => {
        // Autoplay policy prevented playback
        videoToggle.style.display = 'none';
      });
    }

    videoToggle.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play().then(() => {
          updateToggleUI(false);
        }).catch(() => {});
      } else {
        heroVideo.pause();
        updateToggleUI(true);
      }
    });
  }

  /* ==========================================================================
     6. Course Buttons (Prefill Select & Scroll)
     ========================================================================== */
  const courseButtons = document.querySelectorAll('[data-course]');
  const courseSelect = document.getElementById('course');
  const nameInput = document.getElementById('name');
  const kontaktSection = document.getElementById('kontakt');

  courseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const courseVal = btn.getAttribute('data-course');
      if (courseSelect && courseVal) {
        courseSelect.value = courseVal;
      }
      if (kontaktSection) {
        kontaktSection.scrollIntoView({ behavior: 'smooth' });
      }
      if (nameInput) {
        nameInput.focus({ preventScroll: true });
      }
    });
  });

  /* ==========================================================================
     7. Form Validation & Mailto Submit
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const nameField = document.getElementById('field-name');
  const emailField = document.getElementById('field-email');
  const emailInput = document.getElementById('email');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const formStatus = document.getElementById('formStatus');

  const alertIconSvg = `
    <svg class="icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  `;

  function setFieldError(field, input, errorEl, message) {
    field.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorEl.id);
    errorEl.innerHTML = `${alertIconSvg}<span>${message}</span>`;
  }

  function clearFieldError(field, input, errorEl) {
    field.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    errorEl.innerHTML = '';
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      clearFieldError(nameField, nameInput, nameError);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      clearFieldError(emailField, emailInput, emailError);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      let firstInvalidInput = null;

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';

      // Validate Name
      if (!nameVal) {
        setFieldError(nameField, nameInput, nameError, 'Napište prosím jméno.');
        hasError = true;
        firstInvalidInput = firstInvalidInput || nameInput;
      } else {
        clearFieldError(nameField, nameInput, nameError);
      }

      // Validate Email
      if (!emailVal) {
        setFieldError(emailField, emailInput, emailError, 'Napište prosím e-mail.');
        hasError = true;
        firstInvalidInput = firstInvalidInput || emailInput;
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailVal)) {
          setFieldError(emailField, emailInput, emailError, 'Tenhle e-mail nevypadá správně (chybí @ nebo doména).');
          hasError = true;
          firstInvalidInput = firstInvalidInput || emailInput;
        } else {
          clearFieldError(emailField, emailInput, emailError);
        }
      }

      if (hasError) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // Collect data and build mailto
      const phoneVal = document.getElementById('phone')?.value.trim() || '';
      const messageVal = document.getElementById('message')?.value.trim() || '';
      const selectedOption = courseSelect && courseSelect.selectedIndex >= 0 ? courseSelect.options[courseSelect.selectedIndex] : null;
      const courseText = (courseSelect && courseSelect.value && selectedOption) ? selectedOption.text : '';

      let body = `Jméno: ${nameVal}\n`;
      if (phoneVal) body += `Telefon: ${phoneVal}\n`;
      body += `E-mail: ${emailVal}\n`;
      if (courseText) body += `Zájem o: ${courseText}\n`;
      if (messageVal) body += `Zpráva:\n${messageVal}\n`;

      const subject = `Přihláška/dotaz z webu – ${nameVal}`;
      const mailtoUrl = `mailto:ladislav.mikus@seznam.cz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;

      // Show status message
      if (formStatus) {
        formStatus.hidden = false;
        formStatus.innerHTML = `Otevřeli jsme váš e-mailový program. Pokud se nic nestalo, napište na <a href="mailto:autoskolarymarov@gmail.com" class="text-link">autoskolarymarov@gmail.com</a> nebo zavolejte <a href="tel:+420604305733" class="text-link">604 305 733</a>.`;
      }
    });
  }

  /* ==========================================================================
     8. Mobile Callbar Show/Hide
     ========================================================================== */
  const callbar = document.getElementById('callbar');
  const heroSection = document.getElementById('uvod');

  if (callbar && heroSection && kontaktSection) {
    let heroPast = false;
    let kontaktVisible = false;

    function updateCallbar() {
      if (heroPast && !kontaktVisible) {
        callbar.classList.add('is-visible');
      } else {
        callbar.classList.remove('is-visible');
      }
    }

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Appears when hero bottom leaves viewport
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          heroPast = true;
        } else if (entry.isIntersecting) {
          heroPast = false;
        }
        updateCallbar();
      });
    }, { threshold: 0 });

    heroObserver.observe(heroSection);

    const kontaktObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Hidden when #kontakt is in view
        kontaktVisible = entry.isIntersecting;
        updateCallbar();
      });
    }, { threshold: 0.05 });

    kontaktObserver.observe(kontaktSection);
  }
});
