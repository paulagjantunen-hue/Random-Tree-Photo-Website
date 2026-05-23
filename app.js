const feed = document.getElementById("feed");

let page = 1;
let loading = false;

const depthScenes = [];

const fog = document.querySelector(".fog-layer");
const fog2 = document.querySelector(".fog-layer-2");
const rain = document.querySelector(".rain-layer");
const audio = document.getElementById("forest-audio");

/* ----------------------------------
   ENVIRONMENT STATE
---------------------------------- */
const environment = {
  depth: 0,
  wind: 0,
  windTarget: 0,
  time: 0
};

/* ----------------------------------
   SCENES
---------------------------------- */
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

/* ----------------------------------
   PARALLAX
---------------------------------- */
function updateParallax() {
  const scrollY = window.scrollY;

  depthScenes.forEach((scene, i) => {
    const speed = 0.04 + (i % 5) * 0.015;
    const y = scrollY * speed;

    scene.style.setProperty("--parallaxY", `${y}px`);
  });
}

/* ----------------------------------
   ENVIRONMENT
---------------------------------- */
function updateEnvironment() {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  environment.depth = maxScroll > 0
    ? scrollY / maxScroll
    : 0;

  environment.time += 0.002;

  // slowly changing wind target
  environment.windTarget = Math.sin(environment.time * 0.4) * 25;

  // smooth wind interpolation
  environment.wind +=
    (environment.windTarget - environment.wind) * 0.02;
}

/* ----------------------------------
   FOG
---------------------------------- */
function updateFog() {
  const p = environment.depth;
  const wind = environment.wind;

  fog.style.opacity = 0.35 + p * 0.45;

  fog.style.transform = `
    translateX(${wind * 0.6}px)
    translateY(${Math.sin(environment.time) * 4}px)
    scale(${1.05 + p * 0.35})
  `;

  fog2.style.opacity = 0.15 + p * 0.25;

  fog2.style.transform = `
    translateX(${wind * -0.4}px)
    translateY(${Math.cos(environment.time * 0.8) * 6}px)
    scale(${1.2 + p * 0.45})
  `;
}

/* ----------------------------------
   RAIN
---------------------------------- */
function updateRain() {
  const p = environment.depth;
  const wind = environment.wind;

  rain.style.opacity = 0.1 + p * 0.6;

  rain.style.setProperty(
    "--rainAngle",
    `${12 + wind * 0.25}deg`
  );
}

/* ----------------------------------
   AUDIO
---------------------------------- */
function startAudio() {
  audio.volume = 0.4;

  audio.play().catch(() => {});

  window.removeEventListener("click", startAudio);
}

/* ----------------------------------
   MAIN LOOP
---------------------------------- */
function updateAll() {
  updateEnvironment();
  updateParallax();
  updateFog();
  updateRain();

  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1200;

  if (nearBottom) {
    addScene();
  }

  requestAnimationFrame(updateAll);
}

/* ----------------------------------
   STARTUP
---------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  addScene();
  updateAll();
});

window.addEventListener("click", startAudio);