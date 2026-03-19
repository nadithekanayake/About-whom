lucide.createIcons();

// Cursor
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
  if (!dot || !outline) return;

  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";

  outline.animate(
    {
      left: e.clientX + "px",
      top: e.clientY + "px"
    },
    { duration: 500, fill: "forwards" }
  );
});

// Typewriter
const roles = ["Photographer", "Arduino Enthusiast", "Graphic Designer", "Editor"];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;

function type() {
  const typingEl = document.querySelector(".typing");
  if (!typingEl) return;

  const current = roles[roleIdx];

  if (!isDeleting) {
    typingEl.textContent = current.substring(0, charIdx++);
  } else {
    typingEl.textContent = current.substring(0, charIdx--);
  }

  if (!isDeleting && charIdx === current.length + 1) {
    isDeleting = true;
    setTimeout(type, 2000);
    return;
  }

  if (isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    setTimeout(type, 500);
    return;
  }

  setTimeout(type, isDeleting ? 50 : 100);
}

// Age
function updateAge(dob) {
  const birth = new Date(dob);
  const now = new Date();

  let y = now.getFullYear() - birth.getFullYear();
  let m = now.getMonth() - birth.getMonth();
  let d = now.getDate() - birth.getDate();

  if (d < 0) {
    m--;
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }

  if (m < 0) {
    y--;
    m += 12;
  }

  const ageEl = document.getElementById("exact-age");
  if (ageEl) {
    ageEl.textContent = `${y}Y : ${m}M : ${d}D`;
  }
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  nav.classList.toggle("scrolled", window.scrollY > 80);
});

// Section reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.1 }
);

document.addEventListener("DOMContentLoaded", () => {
  type();
  updateAge("2009-07-09");

  document.querySelectorAll(".section").forEach((s) => observer.observe(s));

  const toggle = document.getElementById("themeToggle");
  const icon = toggle?.querySelector("i");

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
    if (icon) icon.setAttribute("data-lucide", "sun");
  } else {
    if (icon) icon.setAttribute("data-lucide", "moon");
  }

  lucide.createIcons();

  const applyTheme = () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");

    if (icon) {
      icon.setAttribute("data-lucide", isLight ? "sun" : "moon");
      lucide.createIcons();
    }
  };

  if (toggle) {
    toggle.addEventListener("click", applyTheme);
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        applyTheme();
      }
    });
  }
});

// Scrollbar auto-hide
let scrollTimeout;

window.addEventListener("scroll", () => {
  document.body.classList.add("scrolling");
  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    document.body.classList.remove("scrolling");
  }, 700);
});