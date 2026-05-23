const feed = document.getElementById("feed");

let page = 1;
let loading = false;

const depthScenes = [];

const fog = document.querySelector(".fog-layer");
const fog2 = document.querySelector(".fog-layer-2");
const rain = document.querySelector(".rain-layer");
const audio = document.getElementById("forest-audio");

/* SCENES */
async function addScene() {
  if (loading) return;
  loading = true;

  const batch = await fetchTreeBatch(page);
  page++;

  if (!batch || batch.length === 0) {
    loading = false;
    return;
  }

  for (const tree of batch) {
    const scene = document.createElement("section");
    scene.className = "scene";

    const captionText = randomPoem().trim();

    scene.innerHTML = `
      <img src="${tree.img}" alt="Forest scene"/>
      <div class="caption">${captionText}</div>
      <div class="credit">— ${tree.photographer}</div>
    `;

    feed.appendChild(scene);
    depthScenes.push(scene);

    requestAnimationFrame(() => {
      scene.classList.add("visible");
    });
  }

  loading = false;
}

/* PARALLAX */
function updateParallax() {
  const scrollY = window.scrollY;

  depthScenes.forEach((scene, i) => {
    const speed = 0.04 + (i % 5) * 0.015;
    const y = scrollY * speed;

    scene.style.setProperty("--parallaxY", `${y}px`);
  });
}

/* FOG */
function updateFog() {
  const scrollY = window.scrollY;
  const max = document.body.scrollHeight - window.innerHeight;
  const p = max > 0 ? scrollY / max : 0;

  fog.style.opacity = 0.4 + p * 0.5;
  fog.style.transform = `scale(${1.1 + p * 0.3})`;

  fog2.style.opacity = 0.2 + p * 0.3;
  fog2.style.transform = `scale(${1.3 + p * 0.4})`;
}

/* RAIN */
function updateRain() {
  const scrollY = window.scrollY;
  const max = document.body.scrollHeight - window.innerHeight;
  const p = max > 0 ? scrollY / max : 0;

  rain.style.opacity = 0.15 + p * 0.6;
}

/* AUDIO (gesture-safe) */
function startAudio() {
  audio.volume = 0.4;
  audio.play().catch(() => {});

  window.removeEventListener("click", startAudio);
}

/* MAIN LOOP (ONE SYSTEM ONLY) */
function updateAll() {
  requestAnimationFrame(() => {
    updateParallax();
    updateFog();
    updateRain();
  });

  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1200;

  if (nearBottom) addScene();
}

/* EVENTS (ONLY ONCE) */
window.addEventListener("scroll", updateAll);
window.addEventListener("DOMContentLoaded", () => {
  addScene();
  updateAll();
});

window.addEventListener("click", startAudio);