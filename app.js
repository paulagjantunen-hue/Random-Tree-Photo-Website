const feed = document.getElementById("feed");

let loading = false;
let page = 1;

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
    scene.className = "scene depth-layer";

    const captionText = randomPoem().trim();

    scene.innerHTML = `
      <img src="${tree.img}" alt="Forest scene"/>
      <div class="caption">${captionText}</div>
      <div class="credit">
        — ${tree.photographer}
      </div>
    `;

    feed.appendChild(scene);

    registerDepthScene(scene);

    requestAnimationFrame(() => {
      scene.classList.add("visible");
    });
  }

  loading = false;
}

window.addEventListener("scroll", async () => {
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1200;

  if (nearBottom) {
    await addScene();
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  await addScene();
});

const fog = document.querySelector(".fog-layer");

function updateFog() {
  const scrollY = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;

  const progress = docHeight > 0 ? scrollY / docHeight : 0;

  //    deeper = denser fog
  const opacity = 0.3 + progress * 0.5;

  //    slightly zoom for depth illusion
  const scale = 1.1 + progress * 0.3;

  fog.style.opacity = opacity;
  fog.style.transform = `scale(${scale})`;
}

window.addEventListener("scroll", updateFog);
window.addEventListener("DOMContentLoaded", updateFog);

const fog2 = document.querySelector(".fog-layer-2");

function updateFog2() {
  const scrollY = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;

  const progress = docHeight > 0 ? scrollY / docHeight : 0;

  fog2.style.opacity = 0.2 + progress * 0.3;
  fog2.style.transform = `scale(${1.2 + progress * 0.4})`;
}

window.addEventListener("scroll", updateFog2);
window.addEventListener("DOMContentLoaded", updateFog2);

const depthScenes = [];

function registerDepthScene(scene) {
  depthScenes.push(scene);
}

function updateParallax() {
  const scrollY = window.scrollY;

  depthScenes.forEach((scene, index) => {
    const speed = 0.04 + (index % 5) * 0.015;
    const y = scrollY * speed;

    scene.style.setProperty("--parallaxY", `${y}px`);
    window.addEventListener("scroll", () => {
      requestAnimationFrame(updateParallax);
    });
  });
}

window.addEventListener("scroll", updateParallax);

const audio = new Audio("forest.mp3");

function startAudio() {
    audio.volume = 0.4;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {});
    }

    window.removeEventListener("click", startAudio);
    window.removeEventListener("touchstart", startAudio);
}

const rain = document.querySelector(".rain-layer");

function updateRain() {
  const scrollY = window.scrollY;
  const maxScroll =
    document.body.scrollHeight - window.innerHeight;

  const depth = maxScroll > 0
    ? scrollY / maxScroll
    : 0;

  // deeper into forest = heavier rain
  rain.style.opacity = 0.2 + depth * 0.6;
}

window.addEventListener("scroll", updateRain);
window.addEventListener("DOMContentLoaded", updateRain);

window.addEventListener("scroll", startAudio);
window.addEventListener("touchstart", startAudio);