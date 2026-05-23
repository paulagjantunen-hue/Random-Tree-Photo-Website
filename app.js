const feed = document.getElementById("feed");

let page = 1;
let loading = false;

const depthScenes = [];

let fog, fog2, rain, audio, lightning;

const environment = {
  depth: 0,
  wind: 0,
  windTarget: 0,
  time: 0
};

/* -------------------------
   SCENES
------------------------- */
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

    const captionText =
      typeof randomPoem === "function"
        ? randomPoem().trim()
        : "The forest is quiet.";

    scene.innerHTML = `
      <img src="${tree.img}" />
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

/* -------------------------
   ENVIRONMENT
------------------------- */
function updateEnvironment() {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  environment.depth = maxScroll > 0 ? scrollY / maxScroll : 0;

  environment.time += 0.01;

  environment.windTarget = Math.sin(environment.time * 0.4) * 25;

  environment.wind += (environment.windTarget - environment.wind) * 0.03;
}

/* -------------------------
   PARALLAX
------------------------- */
function updateParallax() {
  const scrollY = window.scrollY;

  depthScenes.forEach((scene, i) => {
    const speed = 0.04 + (i % 5) * 0.015;
    scene.style.setProperty("--parallaxY", `${scrollY * speed}px`);
  });
}

/* -------------------------
   FOG
------------------------- */
function updateFog() {
  if (!fog || !fog2) return;

  const p = environment.depth;
  const w = environment.wind;

  fog.style.opacity = 0.35 + p * 0.45;
  fog.style.transform = `
    translateX(${w * 0.6}px)
    translateY(${Math.sin(environment.time) * 4}px)
    scale(${1.05 + p * 0.35})
  `;

  fog2.style.opacity = 0.15 + p * 0.25;
  fog2.style.transform = `
    translateX(${w * -0.4}px)
    translateY(${Math.cos(environment.time * 0.8) * 6}px)
    scale(${1.2 + p * 0.45})
  `;
}

/* -------------------------
   RAIN
------------------------- */
function updateRain() {
  if (!rain) return;

  const p = environment.depth;
  const w = environment.wind;

  rain.style.opacity = 0.1 + p * 0.6;
  rain.style.setProperty("--rainAngle", `${12 + w * 0.25}deg`);
}

/* -------------------------
   LIGHTNING
------------------------- */
function randomLightning() {
  if (!lightning) return;

  if (Math.random() < 0.003) {
    lightning.style.opacity = 0.8;

    setTimeout(() => {
      lightning.style.opacity = 0;
    }, 60);
  }
}

/* -------------------------
   AUDIO
------------------------- */
function startAudio() {
  if (!audio) return;

  audio.volume = 0.4;
  audio.play().catch(() => {});
}

/* -------------------------
   LOOP
------------------------- */
function updateAll() {
  updateEnvironment();
  updateParallax();
  updateFog();
  updateRain();
  randomLightning();

  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1200;

  if (nearBottom) addScene();

  requestAnimationFrame(updateAll);
}

/* -------------------------
   INIT
------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  fog = document.querySelector(".fog-layer");
  fog2 = document.querySelector(".fog-layer-2");
  rain = document.querySelector(".rain-layer");
  audio = document.getElementById("forest-audio");
  lightning = document.querySelector(".lightning");

  addScene();
  updateAll();
});

window.addEventListener("pointerdown", startAudio, { once: true });