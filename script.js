function getRandomTree() {
    const tree = trees[(Math.random() * trees.length)];

    document.getElementById("tree-img").src = tree.img;
    document.getElementById("tree-note").textContext = tree.note;
    document.getElementById("tree-credit").textContext =
        "- " + tree.photographer;
}

window.onload = getRandomTree;