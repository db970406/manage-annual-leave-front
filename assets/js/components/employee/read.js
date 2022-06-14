import { makeElementTag, makeIconTag } from '../../shared/makeHtmlTag.js';
import { timworxUrl } from '../../shared/requestUrl.js';
import { searchEmployeeComponent } from './search.js';
import { makeEmployee } from './utils.js';

export const employeeDetailComponent = () => {
    const employeeDetailScreen = makeElementTag({
        element: "section",
        id: "employee_detail_screen"
    });

    const employeeDetailHeader = makeElementTag({
        element: "header",
        id: "employee_detail_header",
    })
    const employeeDetailSection = makeElementTag({
        element: "section",
        id: "employee_detail_section"
    });

    const nameParagraph = makeElementTag({
        element: "p",
        id: "employee_detail_name",
    });
    nameParagraph.dataset.paragraph = "name";

    const positionParagraph = makeElementTag({
        element: "p",
        id: "employee_detail_position",
    });
    positionParagraph.dataset.paragraph = "position";

    const emailParagraph = makeElementTag({
        element: "p",
        id: "employee_detail_email",
    });
    emailParagraph.dataset.paragraph = "email";

    const phoneNumberParagraph = makeElementTag({
        element: "p",
        id: "employee_detail_phone_number",
    });
    phoneNumberParagraph.dataset.paragraph = "phone_number";

    const joinDateParagraph = makeElementTag({
        element: "p",
        id: "employee_detail_join_date",
    });
    joinDateParagraph.dataset.paragraph = "join_date";

    const departmentParagraph = makeElementTag({
        element: "p",
        id: "employee_detail_department",
    });
    departmentParagraph.dataset.paragraph = "department";

    const annualLeaveParagraph = makeElementTag({
        element: "p",
        id: "employee_detail_annual_leave",
    });
    annualLeaveParagraph.dataset.paragraph = "annual_leave";

    const selectedEmployee = makeElementTag({
        element: "h2",
        id: "selected_employee",
    });

    const employeeUpdateModeButton = makeElementTag({
        element: "button",
        id: "employee_update_mode_button",
    });
    const updateEmployeeIcon = makeIconTag({
        iconName: "fas fa-eraser"
    });
    employeeUpdateModeButton.appendChild(updateEmployeeIcon);

    employeeUpdateModeButton.disabled = true;

    employeeDetailHeader.append(
        selectedEmployee,
        employeeUpdateModeButton
    );
    employeeDetailSection.append(
        nameParagraph,
        positionParagraph,
        emailParagraph,
        phoneNumberParagraph,
        joinDateParagraph,
        departmentParagraph,
        annualLeaveParagraph
    );

    employeeDetailScreen.append(employeeDetailHeader, employeeDetailSection);

    return employeeDetailScreen;
}

const searchMode = () => {
    const allEmployeesHeader = document.getElementById("all_employees_header");
    Array.from(allEmployeesHeader.children).forEach(item => item.remove());

    const searchComponent = searchEmployeeComponent();

    allEmployeesHeader.appendChild(searchComponent);
}

export const allEmployeesBarComponent = async () => {
    // employees list zone
    const allEmployeesBar = makeElementTag({
        element: "div",
        id: "all_employees_bar"
    });
    const allEmployeesHeader = makeElementTag({
        element: "header",
        id: "all_employees_header",
    });
    const allEmployeesHeaderName = makeElementTag({
        element: "h2",
        id: "all_employees_header_name",
        textContent: "직원 목록"
    });
    const allEmployeesSection = makeElementTag({
        element: "section",
        id: "all_employees_section",
    });
    const searchModeButton = makeElementTag({
        element: "button",
        id: "search_mode_button"
    });
    const searchModeIcon = makeIconTag({
        iconName: "fas fa-search"
    });
    searchModeButton.appendChild(searchModeIcon);

    searchModeButton.addEventListener("click", searchMode);
    allEmployeesHeader.append(allEmployeesHeaderName, searchModeButton);
    allEmployeesBar.prepend(allEmployeesHeader, allEmployeesSection);
    return allEmployeesBar;
};

export const getEmployeesData = async () => {
    const data = await fetch(`${timworxUrl}/employee/all`);
    // 데이터를 정제해서 listBar에 넣은 다음 listBar를 return
    if (data.status === 200) {
        const { employeesData } = await data.json();
        const resetButton = document.getElementById("reset_button");
        if (resetButton) {
            resetButton.remove();
        }
        const allEmployeesSection = document.getElementById("all_employees_section");
        allEmployeesSection.remove();

        const allEmployeesBar = document.getElementById("all_employees_bar");
        const newAllEmployeesSection = makeElementTag({
            element: "section",
            id: "all_employees_section",
        });
        allEmployeesBar.appendChild(newAllEmployeesSection);

        employeesData.forEach((employee) => {
            makeEmployee({
                id: employee.id,
                employeeName: employee.employee_name
            });
        });
    };
}