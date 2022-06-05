import { makeElementTag, makeIconTag } from './makeHtmlTag.js';

const darkModeController = () => {
    const isDarkMode = localStorage.getItem("DarkMode");

    if (isDarkMode) {
        localStorage.removeItem("DarkMode");
        document.body.classList.remove("dark");
    } else {
        localStorage.setItem("DarkMode", true);
        document.body.classList.add("dark");
    }
}

export const darkModeComponent = () => {
    const darkModeControllerBox = makeElementTag({
        element: "div",
        id: "dark_mode_controller"
    });
    const darkModeControllerButton = makeElementTag({
        element: "button",
        id: "dark_mode_controller_button"
    });
    const darkModeControllerSlider = makeElementTag({
        element: "div",
        id: "dark_mode_controller_slider"
    });

    const darkModeIcon = makeIconTag({
        iconName: "fas fa-moon"
    });

    const lightModeIcon = makeIconTag({
        iconName: "fas fa-sun"
    });
    darkModeControllerSlider.append(darkModeIcon, lightModeIcon);
    darkModeControllerBox.append(darkModeControllerButton, darkModeControllerSlider);

    const isDarkMode = localStorage.getItem("DarkMode");
    if (isDarkMode) {
        localStorage.setItem("DarkMode", true);
        document.body.classList.add("dark");
    } else {
        localStorage.removeItem("DarkMode");
        document.body.classList.remove("dark");
    }
    darkModeControllerBox.addEventListener("click", darkModeController);

    return darkModeControllerBox;
}

const spaceMode = localStorage.getItem("spaceMode");
if (!spaceMode) {
    window.addEventListener("DOMContentLoaded", darkModeComponent);
}