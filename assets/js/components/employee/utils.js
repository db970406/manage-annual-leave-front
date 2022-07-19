import { makeElementTag, makeIconTag } from '../../shared/makeHtmlTag.js';
import { alarm } from '../../shared/alert.js';
import { deleteByDragAndDrop } from '../annual-leave/utils.js';
import { updateEmployeeMode } from './update.js';

export const getPositionById = (id) => {
    const positions = [null, "대표", "이사", "수석", "책임", "주임", "사원", "인턴"];
    return positions[id];
};

export const getPositionId = (position) => {
    const positionIds = [null, "대표", "이사", "수석", "책임", "주임", "사원", "인턴"];
    return positionIds.findIndex((item) => item === position);
}

export const getDepartmentById = (id) => {
    const departments = [null, "경영지원", "공공R&D", "마켓인텔리전스", "백엔드", "프론트엔드", "3D모델링", "경량시뮬", "PM"];
    return departments[id];
};

export const getDepartmentId = (department) => {
    const departmentIds = [null, "경영지원", "공공R&D", "마켓인텔리전스", "백엔드", "프론트엔드", "3D모델링", "경량시뮬", "PM"];
    return departmentIds.findIndex((item) => item === department);
}

export const makeEmployee = ({ id, employeeName }) => {
    const allEmployeesSection = document.getElementById("all_employees_section");
    const nameArticle = makeElementTag({
        element: "article",
        id: "employees_name"
    });
    nameArticle.dataset.employee_id = id;
    nameArticle.textContent = employeeName;
    nameArticle.addEventListener("click", () => showEmployeeDetailBySelect(id));
    deleteByDragAndDrop("employee", nameArticle);
    allEmployeesSection.appendChild(nameArticle);
}

export const makeUpdateButton = ({ employeeId, isDelete }) => {
    const employeeUpdateModeButton = document.getElementById("employee_update_mode_button");
    if (employeeUpdateModeButton) employeeUpdateModeButton.remove();

    const employeeDetailHeader = document.getElementById("employee_detail_header");
    const employeeUpdateButtonBox = document.getElementById("employee_update_traffic_light_buttons_box");
    const selectedEmployee = document.getElementById("selected_employee");

    if (employeeUpdateButtonBox) employeeUpdateButtonBox.remove();
    const newEmployeeUpdateModeButton = makeElementTag({
        element: "button",
        id: "employee_update_mode_button",
    });
    const updateIcon = makeIconTag({
        iconName: "fas fa-eraser"
    });
    newEmployeeUpdateModeButton.addEventListener("click", () => updateEmployeeMode(employeeId));
    newEmployeeUpdateModeButton.appendChild(updateIcon);
    newEmployeeUpdateModeButton.disabled = isDelete ? true : false;
    employeeDetailHeader.append(selectedEmployee, newEmployeeUpdateModeButton);
}

export const checkMultipleOfPointFive = (number) => {
    if (number % 0.5 !== 0) {
        alarm("연차는 0.5 단위로 사용/부여할 수 있습니다.");
        return false;
    }
    return true;
}


export const showEmployeeDetailBySelect = async (id) => {
    initializeCreateAnnualLeaveForm();
    const data = await fetch(`${timworxUrl}/employee/${id}`);
    if (data.status === 200) {
        const { employeeData, annualLeaveHistoriesData } = await data.json();

        insertDataInEmployeeDetail({ ...employeeData });
        resetHistoryAnnualLeaveSection();
        annualLeaveHistoriesData.forEach(annualLeaveHistory => makeNewAnnualLeaveHistory({ ...annualLeaveHistory }));
        createAnnualLeaveButtonDisabled(true);
    }
}


export const showEmployeeDetailBySearch = async (event) => {
    event.preventDefault();
    initializeCreateAnnualLeaveForm();
    const searchInput = document.getElementById("search_employee_input");
    const data = await fetch(`${timworxUrl}/employee/search`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ name: searchInput.value })
    });

    if (data.status === 200) {
        const { employeesData, annualLeaveHistoriesData } = await data.json();

        if (employeesData.length > 1) {
            const allEmployeesSection = document.getElementById("all_employees_section");
            allEmployeesSection.remove();

            const allEmployeesBar = document.getElementById("all_employees_bar");
            const newAllEmployeesSection = makeElementTag({
                element: "section",
                id: "all_employees_section",
            });
            allEmployeesBar.appendChild(newAllEmployeesSection);
            employeesData.forEach(employee => makeEmployee({ id: employee.id, employeeName: employee.employee_name }));

            const resetButton = document.getElementById("reset_button");
            if (!resetButton) {

                // button element로 주면 자동으로 form을 제출해서 버그가 나므로 div로 준 것
                const newResetButton = makeElementTag({
                    element: "button",
                    id: "reset_button"
                });
                const resetIcon = makeIconTag({
                    iconName: "fas fa-times"
                });
                newResetButton.appendChild(resetIcon);
                newResetButton.addEventListener("click", getEmployeesData);

                // 키코드 세팅으로
                document.addEventListener("keydown", (event) => {
                    if (event.keyCode == 27) getEmployeesData();
                })
                const allEmployeesHeader = document.getElementById("all_employees_header");
                allEmployeesHeader.appendChild(newResetButton);
            }
            searchInput.value = "";
        } else {
            createAnnualLeaveButtonDisabled(false);
            insertDataInEmployeeDetail({
                ...employeesData,
                join_date: employeesData.join_date
            });
            resetHistoryAnnualLeaveSection();

            annualLeaveHistoriesData.forEach(annualLeave => makeNewAnnualLeaveHistory({ ...annualLeave }));
            searchInput.value = "";
        }
    } else {
        alarm("존재하지 않는 직원입니다.", searchInput);
    }
};

const insertDataInEmployeeDetail = ({ id, employee_name, position_id, email, phone_number, join_date, department_id, annual_leave }) => {
    const employeeDetailName = document.getElementById("employee_detail_name");
    const employeeDetailPosition = document.getElementById("employee_detail_position");
    const employeeDetailEmail = document.getElementById("employee_detail_email");
    const employeeDetailPhoneNumber = document.getElementById("employee_detail_phone_number");
    const employeeDetailJoinDate = document.getElementById("employee_detail_join_date");
    const employeeDetailDepartment = document.getElementById("employee_detail_department");
    const employeeDetailAnnualLeave = document.getElementById("employee_detail_annual_leave");
    const selectedEmployee = document.getElementById("selected_employee");

    employeeDetailName.textContent = employee_name;
    employeeDetailPosition.textContent = getPositionById(position_id);
    employeeDetailEmail.textContent = email;
    employeeDetailPhoneNumber.textContent = phone_number;
    employeeDetailJoinDate.textContent = join_date;
    employeeDetailDepartment.textContent = getDepartmentById(department_id);
    employeeDetailAnnualLeave.textContent = `${clearDemical(annual_leave)}일`;
    colorChangeByLeftAnnualLeave();
    selectedEmployee.textContent = `${employee_name} ${getPositionById(position_id)}`;

    // 직원 수정, 삭제 버튼 활성화
    const employeeUpdateModeButton = document.getElementById("employee_update_mode_button");
    employeeUpdateModeButton.disabled = false;
    employeeUpdateModeButton.addEventListener("click", () => updateEmployeeMode(id));

    // 연차 요청 폼에 이름 자동으로 삽입
    const vacationer = document.getElementById("create_annual_leave_name_paragraph");
    vacationer.dataset.employee_id = id;
    vacationer.textContent = `${employee_name} ${getPositionById(position_id)}`;

    const createAnnualLeaveSection = document.getElementById("create_annual_leave_section");
    createAnnualLeaveSection.classList.remove("disabled");
}

