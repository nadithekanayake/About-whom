// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initAll();
});

function initAll() {
  initTheme();       // theme first so no flash
  initCursor();
  initStarCanvas();
  initTypewriter();
  initAge();
  initNavbar();
  initScrollProgress();
  initReveal();
  initStatCounters();
  initScrollbar();
  initCardTilt();
  initParallaxOrbs();
}

// ─── Custom Cursor ─────────────────────────────────────────────────────────────
function initCursor() {
  const isTouchDevice = () =>
    window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

  if (isTouchDevice()) {
    document.body.style.cursor = "auto";
    document.querySelectorAll("*").forEach((el) => (el.style.cursor = ""));
    return;
  }

  const dot     = document.getElementById("cursorDot");
  const outline = document.getElementById("cursorOutline");
  if (!dot || !outline) return;

  let mx = 0, my = 0;
  let ox = 0, oy = 0;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  });

  // Spring-physics trailing outline
  (function animateOutline() {
    ox += (mx - ox) * 0.12;
    oy += (my - oy) * 0.12;
    outline.style.left = ox + "px";
    outline.style.top  = oy + "px";
    requestAnimationFrame(animateOutline);
  })();

  // Hover states on interactive elements
  const interactiveSelector = "a, button, [role=button], .hover-glow, .social-btn";
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      dot.classList.add("cursor-hover");
      outline.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      dot.classList.remove("cursor-hover");
      outline.classList.remove("cursor-hover");
    });
  });

  // Fade cursor when mouse leaves viewport
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    outline.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    outline.style.opacity = "1";
  });
}

// ─── Star Canvas ───────────────────────────────────────────────────────────────
function initStarCanvas() {
  const canvas = document.getElementById("starCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const COUNT = 140;
  let stars   = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  for (let i = 0; i < COUNT; i++) {
    stars.push(createStar());
  }

  function createStar(atBottom = false) {
    return {
      x:     Math.random() * window.innerWidth,
      y:     atBottom ? window.innerHeight + 5 : Math.random() * window.innerHeight,
      r:     Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.55 + 0.1,
      speed: Math.random() * 0.25 + 0.04,
      drift: (Math.random() - 0.5) * 0.12,
      twinkle: Math.random() * Math.PI * 2, // phase offset
    };
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.body.classList.contains("light");
    frame++;

    stars.forEach((s) => {
      // Gentle twinkle
      const tw = Math.sin(frame * 0.02 + s.twinkle) * 0.15;
      const a  = Math.max(0, s.alpha + tw);

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = isLight
        ? `rgba(30,100,200,${a * 0.35})`
        : `rgba(210,225,255,${a})`;
      ctx.fill();

      s.y -= s.speed;
      s.x += s.drift;

      if (s.y < -5) {
        Object.assign(s, createStar(true));
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ─── Typewriter ────────────────────────────────────────────────────────────────
function initTypewriter() {
  const roles = [
    "Photographer 📷",
    "Arduino Engineer ⚡",
    "Graphic Designer 🎨",
    "ICT Editor 🏵️",
    "Visual Storyteller 🎞️",
  ];
  let roleIdx    = 0;
  let charIdx    = 0;
  let isDeleting = false;

  const el = document.querySelector(".typing");
  if (!el) return;

  function type() {
    const current = roles[roleIdx];
    el.textContent = current.substring(0, charIdx + (isDeleting ? 0 : 0));

    if (!isDeleting) {
      el.textContent = current.substring(0, ++charIdx);
    } else {
      el.textContent = current.substring(0, --charIdx);
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      return setTimeout(type, 2400);
    }
    if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      return setTimeout(type, 500);
    }

    setTimeout(type, isDeleting ? 40 : 88);
  }
  type();
}

// ─── Live Age ──────────────────────────────────────────────────────────────────
function initAge() {
  const DOB = new Date("2009-07-09T00:00:00");

  function computeAge() {
    const now = new Date();
    let y = now.getFullYear() - DOB.getFullYear();
    let m = now.getMonth()    - DOB.getMonth();
    let d = now.getDate()     - DOB.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { y, m, d };
  }

  function update() {
    const el = document.getElementById("exact-age");
    if (!el) return;
    const { y, m, d } = computeAge();
    el.innerHTML = `<span>${y}</span>Y &nbsp;<span>${m}</span>M &nbsp;<span>${d}</span>D`;
  }

  update();
  setInterval(update, 1000);
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
}

// ─── Scroll progress bar ───────────────────────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((scrolled / maxScroll) * 100).toFixed(2) + "%";
  }, { passive: true });
}

// ─── Staggered section reveal ──────────────────────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");

        // Stagger all cards inside the section
        entry.target
          .querySelectorAll(".info-card, .skill-card, .project-card")
          .forEach((card) => {
            const delay = card.style.getPropertyValue("--delay") || "0ms";
            card.style.transitionDelay = delay;
            card.classList.add("card-show");
          });
      });
    },
    { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".section").forEach((s) => observer.observe(s));
}

// ─── Theme toggle ──────────────────────────────────────────────────────────────
function initTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const icon = toggle.querySelector("i");

  // Apply saved theme immediately (no flash)
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
    setIcon("sun");
  } else {
    setIcon("moon");
  }
  lucide.createIcons();

  function setIcon(name) {
    if (icon) icon.setAttribute("data-lucide", name);
  }

  function applyTheme() {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    setIcon(isLight ? "sun" : "moon");
    lucide.createIcons();
  }

  toggle.addEventListener("click", applyTheme);
  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); applyTheme(); }
  });
}

// ─── Scrollbar auto-hide ───────────────────────────────────────────────────────
function initScrollbar() {
  let t;
  window.addEventListener("scroll", () => {
    document.body.classList.add("scrolling");
    clearTimeout(t);
    t = setTimeout(() => document.body.classList.remove("scrolling"), 700);
  }, { passive: true });
}

// ─── Animated stat counters ────────────────────────────────────────────────────
function initStatCounters() {
  const stats = document.querySelectorAll(".stat-num[data-target]");
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1200;
      const start  = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach((el) => observer.observe(el));
}

// ─── Subtle card tilt on hover ─────────────────────────────────────────────────
function initCardTilt() {
  const isTouchDevice = () =>
    window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  if (isTouchDevice()) return;

  const cards = document.querySelectorAll(".hover-glow");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -5;
      const tiltY = dx *  5;
      card.style.transform = `translateY(-10px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ─── Parallax orbs on mouse move ──────────────────────────────────────────────
function initParallaxOrbs() {
  const isTouchDevice = () =>
    window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  if (isTouchDevice()) return;

  const orbs = [
    { el: document.querySelector(".orb-1"), factor: 0.018 },
    { el: document.querySelector(".orb-2"), factor: -0.024 },
    { el: document.querySelector(".orb-3"), factor: 0.012 },
  ].filter((o) => o.el);

  let tx = 0, ty = 0;
  let cx = 0, cy = 0;

  window.addEventListener("mousemove", (e) => {
    tx = (e.clientX - window.innerWidth  / 2);
    ty = (e.clientY - window.innerHeight / 2);
  }, { passive: true });

  (function animateOrbs() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    orbs.forEach(({ el, factor }) => {
      el.style.transform = `translate(${cx * factor}px, ${cy * factor}px)`;
    });
    requestAnimationFrame(animateOrbs);
  })();
}
