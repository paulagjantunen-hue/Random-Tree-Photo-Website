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
    scene.className = "scene";

    const captionText = randomPoem().trim();

    scene.innerHTML = `
      <img src="${tree.img}" alt="Forest scene"/>
      <div class="caption">${captionText}</div>
      <div class="credit">
        — ${tree.photographer}
      </div>
    `;

    feed.appendChild(scene);

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