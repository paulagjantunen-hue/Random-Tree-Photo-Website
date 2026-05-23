const feed = document.getElementById("feed");

let loading = false;
let page = 1;

for (const tree of batch) {
  const scene = document.createElement("section");
  scene.className = "scene";

  const captionText = randomPoem().trim(); // actually execute function

  scene.innerHTML = `
    <img src="${tree.img}" alt="Forest scene"/>
    <div class="caption">${captionText}</div>
    <div class="credit">
      - ${tree.photographer}
    </div>
  `;

  feed.appendChild(scene);

  requestAnimationFrame(() => {
    scene.classList.add("visible");
  });
}

window.addEventListener("scroll", async () => {
  const nearBottom =
    window.innerHeight + window.scrollY
    >= document.body.offsetHeight - 1200;
  
  if (nearBottom) {
    await addScene();
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  await addScene();
});