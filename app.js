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

  fog.computedStyleMap.opacity = opacity;
  fog.computedStyleMap.transform = `scale(${scale})`;
}

window.addEventListener("scroll", updateFog);
window.addEventListener("DOMContentLoaded", updateFog);

const depthScenes = [];

function registerDepthScene(scene) {
  depthScenes.push(scene);
}

function updateParallax() {
  const scrollY = window.scrollY;

  depthScenes.forEach((scene, index) => {
    const speed = 0.04 + (index % 5) * 0.015;

    const y = scrollY * speed;

    scene.style.transform =
        `translateY(${y}px)`;
  });
}

window.addEventListener("scroll", updateParallax);

const audio = document.getElementById("forest-audio");

async function startAudio() {
  try {
    await audio.play();

    // remove listeners after successful start
    window.removeEventListener("click", startAudio);
    window.removeEventListener("touchstart", startAudio);
  } catch (err) {
    console.log("Audio blocked until interaction.");
  }
}

window.addEventListener("click", startAudio);
window.addEventListener("touchstart", startAudio);

audio.volume = 0;

async function startAudio() {
  try {
    await audio.play();

    let volume = 0;

    const fade = setInterval(() => {
      volume += 0.02;

      if (volume >= 0.5) {
        volume = 0.5;
        clearInterval(fade);
      }

      audio.volume = volume;
    }, 100);

    window.removeEventListener("click", startAudio);
    window.removeEventListener("touchstart", startAudio);

  } catch (err) {
    console.log("Audio blocked until interaction.");
  }
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