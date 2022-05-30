import { makeElementTag, makeIconTag } from '../../shared/makeHtmlTag.js';

const goToLink = () => {
    const notionDiv = document.getElementById("notion_div");
    if (notionDiv) {
        notionDiv.remove();
        window.open("about:blank").location.href = "https://sj-openlink.notion.site/2-14505a22aa784143aab9eba1986ab7ac";
    }
    localStorage.setItem("notionVisited", true);
}

export const notionButton = () => {
    const notionDiv = makeElementTag({
        element: "div",
        id: "notion_div",
    });
    const bellIcon = makeIconTag({
        iconName: "fas fa-bell"
    });
    const exclamationIcon = makeIconTag({
        iconName: "fas fa-exclamation"
    });

    notionDiv.append(bellIcon, exclamationIcon);
    notionDiv.addEventListener("click", goToLink);
    return notionDiv;
}

window.addEventListener("DOMContentLoaded", () => {
    const notionDiv = document.getElementById("notion_div");
    const isClicked = localStorage.getItem("notionVisited");
    if (isClicked) {
        notionDiv.remove();
    }
});

const notion = notionButton();
document.body.appendChild(notion);
