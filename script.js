function getRandomTree() {
    const tree = trees[Math.floor(Math.random() * trees.length)];

    document.getElementById("tree-img").src = tree.img;
    document.getElementById("tree-img").alt = tree.note || "Random tree photo";
    document.getElementById("tree-note").textContent = tree.note;
    document.getElementById("tree-credit").textContent =
        "- " + tree.photographer;
}

window.onload = getRandomTree;