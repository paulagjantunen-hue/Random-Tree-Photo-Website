const feed = document.getElementById("feed");

let page = 1;
let loading = false;

const depthScenes = [];

let fog, rain, lightning, audio;

const environment = {
  depth: 0,
  wind: 0;
  time: 0;
};

/* LOAD SCENES */
async function addScene() {
  if (loading) return;
  
  loading = true;

  const batch = await fetchTreeBatch(page);
  page++;

  if (!batch) {
    loading = false;
    return;
  }

  for (const tree of batch) {
    const scene = document.createElement("section");
    
    scene.className = "scene";
    
    scene.innerHTML = `
      <img loading="lazy" src="${tree.img}" alt="Forest"/>
      <div class="caption">${randomPoem()}</div>
      <div class="credit">— ${tree.photographer}</div>
    `;

    feed.appendChild(scene);
    depthScenes.push(scene);

    if (depthScenes.length > 40) {
      const old = depthScenes.shift();
      old?.remove();
    }
    
    requestAnimationFrame(() => {
      scene.classList.add("visible");
    });
  }

  loading = false;
}

/* UPDATE WORLD */
function updateWorld() {
  const scrollY = window.scrollY;
  
  const maxScroll = 
    document.body.scrollHeight - window.innerHeight;

  environment.depth =
    maxScroll > 0 ? scrollY / maxScroll : 0;
  
  environment.time += 0.01;

  environment.wind =
    Math.sin(environment.time * 0.3) * 10;
  };

  /* fog */
  if (fog) {
    fog.style.opacity =
      0.15 + environment.depth * 0.3;
    
    fog.style.transform =
      `translateX(${environment.wind}px)`;
  }
  
  /* rain */
  if (rain) {
    rain.style.opacity =
      0.05 + environment.depth * 0.25;
  }
  
  /* lightning */
  if (lightning && Math.random() < 0.0008) {
    lightning.style.opacity = 0.15;

    setTimeout(() => {
      lightning.style.opacity = 0;
    }, 60);
  }

  requestAnimationFrame(updateWorld);
}

/* PARALLAX */
function updateParallax() {
  const scrollY = window.scrollY;

  depthScenes.forEach((scene, i) => {
    const speed = 0.01 + (i % 5) * 0.003;

    scene.style.transform =
      `translate3d(0, ${scrollY * speed}px, 0)`;
  });
}

/* INFINITE SCROLL */
window.addEventListener("scroll", () => {
  const nearBottom =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1500;

  if (nearBottom) addScene();
});

/* AUDIO */
function startAudio() {
  if (!audio) return;

  audio.volume = 0.35;
  audio.play().catch(() => {});
}

window.addEventListener(
  "pointerdown",
  startAudio,
  { once: true }
);

/* START */
  window.addEventListener("DOMContentLoaded", async () => {
    fog = document.querySelector(".fog-layer");
    rain = document.querySelector(".rain-layer");
    lightning = document.querySelector(".lightning");
    audio = document.getElementById("forest-audio");
    
    await addScene();

    updateWorld();
  });