import { makeElementTag, makeIconTag } from '../../shared/makeHtmlTag.js';

class GlassCategories extends HTMLElement {
    connectedCallback() {
        const categoryIcon = {
            "인사": "fas fa-user-friends",
        }

        const dashboard = document.getElementById("glass_dashboard");

        // 패널 추가 대비
        ["인사"].forEach(categoryName => {
            const glassCategory = makeElementTag({
                id: "glass_category",
                element: "nav",
                className: "glass"
            });
            const glassParagraph = makeElementTag({
                element: "p",
                textContent: categoryName
            });
            const glassIcon = makeIconTag({
                iconName: categoryIcon[categoryName]
            });

            glassCategory.appendChild(glassIcon);
            glassCategory.appendChild(glassParagraph);

            glassCategory.addEventListener("click", () => {
                this.classList.add("slide-up");
                this.classList.remove("slide-down");
                dashboard.classList.add("slide-in-left");
                dashboard.classList.remove("slide-out-left");
            });
            this.appendChild(glassCategory);
        })
    }
}

customElements.define("glass-categories", GlassCategories);

