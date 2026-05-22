let cache = [];
let index = 0;

async function ensureCache() {
    if (index < cache.length) return;

    const newBatch = await fetchTreeBatch();
    cache = cache.concat(newBatch);
}

async function showTree() {
    await ensureCache();

    const tree = cache[index++];
    const img = document.getElementById("tree-img");

    img.style.opacity = 0;

    setTimeout(() => {
        img.src = tree.img;

        document.getElementById("tree-note").textContent = randomPoem();
        document.getElementById("tree-credit").textContent =
            `- ${tree.photographer} (${tree.location})`;

        img.style.opacity = 1;
    }, 200);
}

// button + first load
document.getElementById("new-tree-btn").addEventListener("click", showTree);
window.addEventListener("DOMContentLoaded", showTree);