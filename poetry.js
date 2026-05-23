const POEMS = [
    "The trees leaned together like old secrets.",
    "Rain stayed here long after the storm left.",
    "The forest does not ask who you were before entering.",
    "Every branch carried the weight of another season.",
    "The earth remembered something the sky had forgotten.",
    "Some paths only exist while you are walking them.",
    "The woods moved softly around the edge of thought."
];

function randomPoem() {
    return POEMS[Math.floor(Math.random() * POEMS.length)];
}