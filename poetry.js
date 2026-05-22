const POETRY_LINES = [
    "The forest writes slowly, and never repeats itself.",
    "A tree is a memory learning how to stand still.",
    "Some silence has roots deeper than language.",
    "The wind edits everything it touches.",
    "Every leaf is a sentence the sky forgot to finish.",
    "Time does not pass here. It grows."
];

function randomPoem() {
    return POETRY_LINES[Math.floor(Math.random() * POETRY_LINES.length)];
}