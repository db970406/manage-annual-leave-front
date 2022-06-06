import { createEmployeeComponent } from '../../components/employee/create.js';
import { changeBackground } from './changeBg.js';
import { makeElementTag, makeIconTag } from '../../shared/makeHtmlTag.js';

export const trafficLightButtonsComponent = () => {
    const trafficLightButtonsBox = makeElementTag({
        id: "traffic_light_buttons_box",
        element: "div"
    });
    const exitButton = makeElementTag({
        id: "exit_button",
        element: "button"
    });
    const syncButton = makeElementTag({
        id: "sync_button",
        element: "button"
    });
    const callAddEmployeeButton = makeElementTag({
        id: "add_button",
        element: "button"
    });
    const exitIcon = makeIconTag({
        iconName: "fas fa-times"
    });
    const syncIcon = makeIconTag({
        iconName: "fas fa-sync"
    });
    const addIcon = makeIconTag({
        iconName: "fas fa-user-plus"
    });
    exitButton.appendChild(exitIcon);
    syncButton.appendChild(syncIcon);
    callAddEmployeeButton.appendChild(addIcon);

    const categories = document.getElementById("glass_categories");
    const dashboard = document.getElementById("glass_dashboard");

    exitButton.addEventListener("click", () => {
        dashboard.classList.add("slide-out-left");
        dashboard.classList.remove("slide-in-left");
        categories.classList.add("slide-down");
        categories.classList.remove("slide-up");
    });
    syncButton.addEventListener("click", changeBackground);
    callAddEmployeeButton.addEventListener("click", createEmployeeComponent);

    trafficLightButtonsBox.append(exitButton, syncButton, callAddEmployeeButton);

    return trafficLightButtonsBox;
}