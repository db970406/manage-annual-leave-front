
export const makeElementTag = ({ element, textContent, id, className, name }) => {
    const htmlTag = document.createElement(element);
    htmlTag.textContent = textContent;
    id ? htmlTag.id = id : undefined;
    className ? htmlTag.className = className : undefined;
    name ? htmlTag.name = name : undefined;

    return htmlTag;
}
export const makeCategoryTag = ({ boxId, category, categoryId, content, contentId }) => {
    const boxTag = document.createElement("div");
    boxTag.id = boxId;

    const categoryTag = document.createElement("span");
    categoryTag.textContent = category;
    categoryId ? categoryTag.id = categoryId : undefined;

    if (contentId) {
        const contentTag = document.createElement("p");
        contentTag.textContent = content;
        contentId ? contentTag.id = contentId : undefined;
        boxTag.append(categoryTag, contentTag);
    } else {
        boxTag.appendChild(categoryTag);
    }

    return boxTag;
}

export const makeInputTag = ({ id, placeholder, type = "text", name, value, required = false }) => {
    const inputTag = document.createElement("input");
    id ? inputTag.id = id : undefined;
    placeholder ? inputTag.placeholder = placeholder : undefined;
    type ? inputTag.type = type : undefined;
    name ? inputTag.name = name : undefined;
    value ? inputTag.value = value : undefined;
    required ? inputTag.required = required : undefined;
    return inputTag;
}

export const makeIconTag = ({ iconName }) => {
    const iconTag = document.createElement("i");
    iconTag.className = iconName;
    return iconTag;
}

export const makeSelectTag = ({ selectId, options, name }) => {
    const selectTag = document.createElement("select");
    selectTag.id = selectId;
    name ? selectTag.name = name : undefined;

    let optionTagArray = [];

    options.forEach(option => {
        const optionTag = document.createElement("option");
        optionTag.value = option;
        optionTag.textContent = option;
        optionTagArray.push(optionTag);
    });
    selectTag.append(...optionTagArray);
    return selectTag;
}