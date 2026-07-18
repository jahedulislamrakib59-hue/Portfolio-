/* ================================================================
   MOHAMMAD JAHEDUL ISLAM RAKIB — PORTFOLIO SCRIPT
   ----------------------------------------------------------------
   Sections:
   1. Theme toggle (light / dark)
   2. Mobile navigation
   3. Scroll progress bar + header state
   4. Reveal-on-scroll animations
   5. Skill bar fill animation
   6. Hero "typed" preamble
   7. Gallery lightbox
   8. Contact form (front-end only — see note below)
   9. Back-to-top button
   10. Footer year
   ================================================================ */
(function () {
  "use strict";

  var root = document.documentElement;

  /* --------------------------------------------------------------
     1. THEME TOGGLE
     Note: theme choice is kept in memory only for this page view
     (no localStorage), and falls back to the visitor's OS preference
     on load. This keeps the site self-contained and dependency-free.
     -------------------------------------------------------------- */
  var themeToggle = document.getElementById("themeToggle");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");

  function setTheme(mode) {
    root.setAttribute("data-theme", mode);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
      themeToggle.setAttribute(
        "aria-label",
        mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* --------------------------------------------------------------
     2. MOBILE NAVIGATION
     -------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --------------------------------------------------------------
     3. SCROLL PROGRESS BAR
     -------------------------------------------------------------- */
  var scrollBar = document.getElementById("scrollBar");

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollBar) scrollBar.style.width = pct + "%";

    var backToTop = document.getElementById("backToTop");
    if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 500);
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* --------------------------------------------------------------
     4. REVEAL-ON-SCROLL
     -------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealTargets.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* --------------------------------------------------------------
     5. SKILL BAR FILL ANIMATION
     Reads the data-level attribute (0-100) and animates the fill
     once the bar scrolls into view.
     -------------------------------------------------------------- */
  var skillBars = document.querySelectorAll(".skill-bar");

  skillBars.forEach(function (bar) {
    var level = bar.getAttribute("data-level") || "0";
    bar.style.setProperty("--target-width", level + "%");
  });

  if ("IntersectionObserver" in window && skillBars.length) {
    var skillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillBars.forEach(function (bar) {
      skillObserver.observe(bar);
    });
  } else {
    skillBars.forEach(function (bar) {
      bar.classList.add("in-view");
    });
  }

  /* --------------------------------------------------------------
     6. HERO TYPED PREAMBLE
     Cycles through a short list of legal-document-style openings.
     -------------------------------------------------------------- */
  var typedEl = document.getElementById("typedPreamble");
  var phrases = [
    "IN THE MATTER OF —",
    "RE: A LEGAL EDUCATION —",
    "ARTICLE — SELF —"
  ];

  if (typedEl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 55);
    }
    tick();
  }

  /* --------------------------------------------------------------
     7. GALLERY LIGHTBOX
     -------------------------------------------------------------- */
  var galleryItems = document.querySelectorAll(".gallery-item");
  var lightbox = document.getElementById("lightbox");
  var lightboxFrame = document.getElementById("lightboxFrame");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(item) {
    if (!lightbox) return;
    var caption = item.getAttribute("data-caption") || "";
    lightboxCaption.textContent = caption;
    lightboxFrame.className = "lightbox-frame";
    lightboxFrame.style.background = getComputedStyle(item).background;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      openLightbox(item);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* --------------------------------------------------------------
     8. CONTACT FORM
     This is a static, front-end-only site with no backend, so the
     form cannot actually send email on its own. It validates input
     and then hands off to the visitor's email client via a mailto
     link. EDIT ME: replace 'your.email@example.com' below (and in
     index.html) with your real address, or connect this form to a
     service such as Formspree if you'd like it to submit silently.
     -------------------------------------------------------------- */
  var contactForm = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("cf-name").value.trim();
      var email = document.getElementById("cf-email").value.trim();
      var message = document.getElementById("cf-message").value.trim();

      if (!name || !email || !message) {
        formNote.textContent = "Please fill in every field before sending.";
        return;
      }

      var subject = encodeURIComponent("Portfolio contact from " + name);
      var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
      window.location.href =
        "mailto:your.email@example.com?subject=" + subject + "&body=" + body;

      formNote.textContent = "Opening your email app to send this message…";
      contactForm.reset();
    });
  }

  /* --------------------------------------------------------------
     9. BACK TO TOP
     -------------------------------------------------------------- */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* --------------------------------------------------------------
     10. FOOTER YEAR
     -------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
