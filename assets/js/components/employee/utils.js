import { showEmployeeDetailBySelect } from '../../shared/insertData.js';
import { makeElementTag, makeIconTag } from '../../shared/makeHtmlTag.js';
import { alarm } from '../../shared/warnings.js';
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