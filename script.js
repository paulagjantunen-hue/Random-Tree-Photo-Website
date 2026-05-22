function getRandomTree() {
    const treeList = Array.isArray(trees) ? trees : [];
    const fallbackTree = {
        img: "images/tree1.jpg",
        note: "A quiet tree waits for you to discover it.",
        photographer: "Unknown"
    };

    const tree = treeList.length > 0
        ? treeList[Math.floor(Math.random() * treeList.length)]
        : fallbackTree;

    const treeImg = document.getElementById("tree-img");
    const treeNote = document.getElementById("tree-note");
    const treeCredit = document.getElementById("tree-credit");

    treeImg.src = tree.img;
    treeImg.alt = tree.note || "Random tree photo";
    treeNote.textContent = tree.note || "A tree stands in quiet beauty.";
    treeCredit.textContent = `- ${tree.photographer || "Unknown"}`;
}

function initRandomTreeSite() {
    document.getElementById("new-tree-btn").addEventListener("click", getRandomTree);
    getRandomTree();
}

document.addEventListener("DOMContentLoaded", initRandomTreeSite);