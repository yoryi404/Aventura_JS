import { showScene } from "./util.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-to-scene-2")
        .addEventListener("click", () => showScene("scene-2"));

    document.getElementById("btn-to-scene-3")
        .addEventListener("click", () => showScene("scene-3"));

    document.getElementById("btn-to-scene-1")
        .addEventListener("click", () => showScene("scene-1"));
});
