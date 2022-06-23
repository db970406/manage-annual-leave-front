import { darkModeComponent } from '../../shared/darkMode.js';
import { makeElementTag } from '../../shared/makeHtmlTag.js';

export const changeBackground = () => {
    const isSpaceMode = localStorage.getItem("spaceMode");
    const layout = document.getElementById("layout");
    const layers = Array.from(document.querySelectorAll("#layer"));

    if (isSpaceMode) {
        localStorage.removeItem("spaceMode");
        layout.parentElement.id = "normal_field";
        document.body.classList.remove("galaxy");

        layers.forEach(layer => layer.remove());
        const darkModeControllerButton = darkModeComponent();
        const trafficLightButtonsBox = document.getElementById("traffic_light_buttons_box");
        trafficLightButtonsBox.insertAdjacentElement('afterend', darkModeControllerButton);
    } else {
        localStorage.setItem("spaceMode", true);
        layout.parentElement.id = "star_field";
        document.body.classList.add("galaxy");

        [1, 2, 3].forEach(_ => {
            const star = makeElementTag({
                element: "div",
                id: "layer"
            });
            layout.parentElement.appendChild(star);
        });
        const darkModeControllerBox = document.getElementById("dark_mode_controller");
        if (darkModeControllerBox) darkModeControllerBox.remove();
    }
}


const initialBgState = () => {
    const isSpaceMode = localStorage.getItem("spaceMode");
    if (isSpaceMode) {
        layout.parentElement.id = "star_field";
        document.body.classList.add("galaxy");
        [1, 2, 3].forEach(_ => {
            const star = makeElementTag({
                element: "div",
                id: "layer"
            });
            layout.parentElement.appendChild(star);
        });
        const darkModeControllerBox = document.getElementById("dark_mode_controller");
        if (darkModeControllerBox) darkModeControllerBox.remove();
    } else {
        layout.parentElement.id = "normal_field";
        document.body.classList.remove("galaxy");
        const layers = Array.from(document.querySelectorAll("#layer"));
        layers.forEach(layer => layer.remove());
    }
}
window.addEventListener("DOMContentLoaded", initialBgState);