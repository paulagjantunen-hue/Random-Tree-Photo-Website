const feed = document.getElementById("feed");

let page = 1;
let loading = false;
const scenes = [];

let fog, rain, lightning, audio;

const env = {
  depth: 0,
  wind: 0,
  time: 0
};

/* ---------------- LOAD SCENES ---------------- */
async function addScene() {
  if (loading) return;
  loading = true;

  try {
    const batch = await fetchTreeBatch(page);
    page++;

    if (!batch?.length) {
      loading = false;
      return;
    }

    for (const tree of batch) {
      const el = document.createElement("section");
      el.className = "scene";

      el.innerHTML = `
        <img src="${tree.img}" loading="lazy" onerror="this.style.opacity=0.3"/>
        <div class="caption">${randomPoem?.() || "The forest is silent."}</div>
        <div class="credit">— ${tree.photographer || "Unknown"}</div>
      `;

      feed.appendChild(el);
      scenes.push(el);

      requestAnimationFrame(() => el.classList.add("visible"));
    }
  } catch (e) {
    console.error("Scene load failed:", e); 
  }

  loading = false;
}

/* ---------------- WORLD ---------------- */
function update() {
  const scroll = window.scrollY;
  const max = document.body.scrollHeight - innerHeight;

  env.depth = max ? scroll / max : 0;
  env.time += 0.01;
  env.wind = Math.sin(env.time * 0.4) * 20;

  if (fog) {
    fog.style.opacity = 0.4 + env.depth * 0.5;
    fog.style.transform = `translateX(${env.wind}px)`;
  }

  if (rain) {
    rain.style.opacity = 0.2 + env.depth * 0.6;
    rain.style.setProperty("--rainAngle", `${env.wind * 0.2}deg`);
  }

  if (lightning && Math.random() < 0.002) {
    lightning.style.opacity = 0.4;
    setTimeout(() => lightning.style.opacity = 0, 80);
  }

  requestAnimationFrame(update);
}

/* ---------------- PARALLAX ---------------- */
function parallax() {
  const y = window.scrollY;

  scenes.forEach((s, i) => {
    const speed = 0.03 + (i % 5) * 0.01;
    s.style.setProperty("--y", `${y * speed}px`);
  });
}

/* ---------------- AUDIO ---------------- */

function startAudio() {
  if (!audio) {
    console.warn("Audio element missing");
    return;
  }

  audio.volume = 0.35;

  const p = audio.play();

  if (p) {
    p.catch(err => {
      console.warn("Audio blocked or failed:", err);
    });
  }
}

window.addEventListener("click", startAudio, { once: true });
/* ---------------- SCROLL ---------------- */
let canLoad = true;

const scroll = window.scrollY;
if (window.innerHeight + scroll > document.body.scrollHeight - 1200)

window.addEventListener("scroll", () => {
  if (!canLoad) return;

  if (window.innerHeight + scrollY > document.body.scrollHeight - 1200) {
    canLoad = false;

    addScene().then(() => {
      setTimeout(() => canLoad = true, 500);
    });
  }
});

/* ---------------- INIT ---------------- */
window.addEventListener("DOMContentLoaded", () => {
  fog = document.querySelector(".fog-layer");
  rain = document.querySelector(".rain-layer");
  lightning = document.querySelector(".lightning");
  audio = document.getElementById("forest-audio");

  addScene();
  update();
  setInterval(parallax, 1000 / 60);
  window.addEventListener("pointerdown", startAudio, { once: true });
} );