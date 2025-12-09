/* ====== BASIC READY FLOW ====== */
const app = document.getElementById("app");
const loader = document.getElementById("loader");
const soundBtn = document.getElementById("soundBtn");
const sound = document.getElementById("kecakSound");

/* show app after a tiny delay (feels cinematic) */
window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    app.classList.remove("hidden");
  }, 650);

  tryPlaySound();
});

/* ====== SOUND ====== */
function tryPlaySound() {
  if (!sound) return;
  sound.volume = 0.22;
  const p = sound.play();
  if (p && typeof p.then === "function") {
    p.catch(() => {
      soundBtn.classList.add("show");
    });
  }
}

soundBtn?.addEventListener("click", () => {
  soundBtn.classList.remove("show");
  sound.play().catch(() => {});
});

/* ====== PARTICLE EMBERS ====== */
const particles = document.getElementById("particles");
const pctx = particles.getContext("2d");

function sizeCanvas() {
  particles.width = window.innerWidth;
  particles.height = window.innerHeight;
}
window.addEventListener("resize", sizeCanvas);
sizeCanvas();

class Ember {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * particles.width;
    this.y = particles.height + Math.random() * 220;
    this.r = Math.random() * 3 + 1;
    this.v = Math.random() * 1.2 + 0.55;
    this.a = Math.random() * 0.42 + 0.22;
  }
  update() {
    this.y -= this.v;
    if (this.y < -20) this.reset();
  }
  draw() {
    pctx.fillStyle = rgba(255,80,0,${this.a});
    pctx.beginPath();
    pctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    pctx.fill();
  }
}

let embers = [];
function initEmbers() {
  embers = Array.from({ length: 170 }, () => new Ember());
}
function animateEmbers() {
  pctx.clearRect(0,0,particles.width,particles.height);
  embers.forEach(e => { e.update(); e.draw(); });
  requestAnimationFrame(animateEmbers);
}
initEmbers();
animateEmbers();

/* ====== CURSOR FIRE TRAIL ====== */
const trail = document.getElementById("cursorTrail");
const tctx = trail.getContext("2d");

function sizeTrail() {
  trail.width = window.innerWidth;
  trail.height = window.innerHeight;
}
window.addEventListener("resize", sizeTrail);
sizeTrail();

let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const drops = [];

function tickTrail() {
  tctx.fillStyle = "rgba(0,0,0,0.12)";
  tctx.fillRect(0, 0, trail.width, trail.height);

  drops.push({
    x: mouse.x,
    y: mouse.y,
    r: Math.random() * 3 + 2,
    a: 1
  });

  if (drops.length > 55) drops.shift();

  drops.forEach((d) => {
    d.a -= 0.03;
    tctx.fillStyle = rgba(255,80,0,${Math.max(0, d.a)});
    tctx.beginPath();
    tctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    tctx.fill();
  });

  requestAnimationFrame(tickTrail);
}
tickTrail();

/* ====== PARALLAX ====== */
const heroBg = document.querySelector("[data-parallax='true']");
if (heroBg) {
  window.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 14;
    const ny = (e.clientY / window.innerHeight - 0.5) * 10;
    heroBg.style.transform = translate(${nx}px, ${ny}px) scale(1.12);
  });
}

/* ====== REVEAL ====== */
const reveals = document.querySelectorAll(".reveal");
function onScroll() {
  const vh = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < vh - 120) {
      if (!el.classList.contains("show")) {
        el.classList.add("show");
        if (el.dataset.glitch !== undefined) {
          el.classList.add("glitch-active");
          setTimeout(() => el.classList.remove("glitch-active"), 900);
        }
      }
    }
  });
}
window.addEventListener("scroll", onScroll);
onScroll();