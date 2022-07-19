import { makeElementTag, makeIconTag, makeInputTag } from '../../shared/makeHtmlTag.js';
import { showEmployeeDetailBySearch } from './utils.js';

export const searchEmployeeComponent = () => {
    const searchEmployeeBox = makeElementTag({
        id: "search_employee_box",
        element: "form",
    });
    const searchInput = makeInputTag({
        id: "search_employee_input",
        placeholder: "이름"
    });
    searchInput.autocomplete = "off";
    const searchIcon = makeIconTag({
        iconName: "fas fa-search"
    });

    searchEmployeeBox.append(searchIcon, searchInput);
    searchEmployeeBox.addEventListener("submit", showEmployeeDetailBySearch);
    return searchEmployeeBox;
}