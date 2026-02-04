lucide.createIcons();

// Cursor
const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");
window.addEventListener("mousemove", (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    outline.animate({ left: e.clientX + "px", top: e.clientY + "px" }, { duration: 500, fill: "forwards" });
});

// Typewriter
const roles = ["Photographer", "Arduino Enthusiast", "Graphic Designer", "Editor"];
let roleIdx = 0, charIdx = 0, isDeleting = false;
function type() {
    const current = roles[roleIdx];
    document.querySelector(".typing").textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
    if (!isDeleting && charIdx === current.length + 1) { isDeleting = true; setTimeout(type, 2000); }
    else if (isDeleting && charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 500); }
    else { setTimeout(type, isDeleting ? 50 : 100); }
}

// Age
function updateAge(dob) {
    const birth = new Date(dob);
    const now = new Date();
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    document.getElementById("exact-age").textContent = `${y}Y : ${m}M : ${d}D`;
}

window.addEventListener("scroll", () => { document.getElementById("mainNav").classList.toggle("scrolled", window.scrollY > 80); });
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("show"));
}, { threshold: 0.1 });

document.addEventListener("DOMContentLoaded", () => {
    type();
    updateAge("2009-07-09");
    document.querySelectorAll(".section").forEach(s => observer.observe(s));
});
/* ================= SCROLLBAR AUTO-HIDE ================= */

let scrollTimeout;

window.addEventListener("scroll", () => {
  document.body.classList.add("scrolling");

  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    document.body.classList.remove("scrolling");
  }, 700); // hide after stop scrolling
});