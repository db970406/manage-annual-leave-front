import { makeDisabledState } from '../../shared/disabled.js';
import { makeElementTag, makeIconTag, makeInputTag, makeSelectTag } from '../../shared/makeHtmlTag.js';
import { timworxUrl } from '../../shared/requestUrl.js';
import { trimmedNumberFormat } from '../../shared/utils.js';
import { alarm, checkEmployeeValidation, warning } from '../../shared/alert.js';
import { colorChangeByLeftAnnualLeave } from '../annual-leave/utils.js';
import { checkMultipleOfPointFive, makeUpdateButton } from './utils.js';

export const updateEmployee = (employeeId) => {
    const executeEvent = async () => {
        const employeeDetailSection = document.getElementById("employee_detail_section");
        const updateEmployeeInfo = Array.from(employeeDetailSection.children);
        const employeeData = {
            email: null,
            name: null,
            phone_number: null,
            annual_leave: null,
            join_date: null,
            department: null,
            position: null
        };
        updateEmployeeInfo.forEach(employeeInfo => {
            if (!employeeInfo.name) return;
            employeeData[employeeInfo.name] = employeeInfo.value;
        });

        const isItMultipleOfPointFive = checkMultipleOfPointFive(employeeData.annual_leave);
        if (!isItMultipleOfPointFive) return;


        const isValid = checkEmployeeValidation({ ...employeeData });
        if (!isValid) return;

        const data = await fetch(`${timworxUrl}/employee/${employeeId}/update`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ ...employeeData })
        })

        if (data.status === 200) {
            const employeeDetailSection = document.getElementById("employee_detail_section");
            const employeeDetailSectionArray = Array.from(employeeDetailSection.children);
            const employeeDetailHeaderName = document.getElementById("selected_employee");
            const exitEmployeeUpdateModeButton = document.getElementById("exit_employee_update_mode");
            const createAnnualLeaveNameParagraph = document.getElementById("create_annual_leave_name_paragraph");

            makeUpdateButton({ employeeId, isDelete: false });

            exitEmployeeUpdateModeButton.remove();
            employeeDetailHeaderName.textContent = `${employeeData.name} ${employeeData.position}`;

            employeeDetailSectionArray.forEach(employeeInfo => {
                const nameOfTag = employeeInfo.name;
                if (!nameOfTag) return;
                if (nameOfTag === "annual_leave") {
                    const annualLeaveParagraph = makeElementTag({
                        element: "p",
                        id: employeeInfo.id,
                        textContent: `${trimmedNumberFormat(employeeData[nameOfTag])}일`
                    });
                    annualLeaveParagraph.dataset.paragraph = nameOfTag;
                    employeeInfo.replaceWith(annualLeaveParagraph);
                }
                const paragraph = makeElementTag({
                    element: "p",
                    id: employeeInfo.id,
                    textContent: employeeData[nameOfTag]
                });
                paragraph.dataset.paragraph = nameOfTag;
                employeeInfo.replaceWith(paragraph);
            });
            colorChangeByLeftAnnualLeave();

            const allEmployeesSection = document.getElementById("all_employees_section");
            const allEmployees = Array.from(allEmployeesSection.children);
            const updatedEmployee = allEmployees.find(employee => +employee.dataset.employee_id === employeeId);
            updatedEmployee.textContent = employeeData.name;
            createAnnualLeaveNameParagraph.textContent = `${employeeData.name} ${employeeData.position}`;


            // 직원의 이름을 수정하면 주간 연차리스트에도 그 직원의 연차내역을 찾아 이름 수정
            const weeklyAnnualLeaveSection = document.getElementById("weekly_annual_leave_section");
            const weeklyAnnualLeave = Array.from(weeklyAnnualLeaveSection.children);
            weeklyAnnualLeave.forEach(annualLeave => {
                const findSameEmployeeId = annualLeave.dataset.employee_id;
                if (+findSameEmployeeId === employeeId) {
                    const weeklyAnnualLeaveFinishDate = annualLeave.querySelector("#weekly_annual_leave_finish_date");
                    const annualLeaveScheduleVacation = weeklyAnnualLeaveFinishDate.textContent.split(" ");
                    annualLeaveScheduleVacation[2] = employeeData.name;
                    weeklyAnnualLeaveFinishDate.textContent = annualLeaveScheduleVacation.join(" ");
                }
            });
            makeDisabledState(false);
        } else {
            alarm("이미 존재하는 이메일입니다.");
        }
    }
    warning({ warningString: "정말 수정하시겠습니까?", executeEvent });
}

export const exitUpdateEmployeeMode = (employeeId) => {
    const employeeDetailHeader = document.getElementById("employee_detail_header");
    const employeeDetailSection = document.getElementById("employee_detail_section");
    const exitEmployeeUpdateModeButton = document.getElementById("exit_employee_update_mode");
    const employeeUpdateButtonBox = document.getElementById("employee_update_traffic_light_buttons_box");
    makeDisabledState(false);
    exitEmployeeUpdateModeButton.remove();
    employeeUpdateButtonBox.remove();

    const allInvalidText = document.getElementById("invalid_text");
    if (allInvalidText) allInvalidText.remove()

    const employeeUpdateModeButton = makeElementTag({
        element: "button",
        id: "employee_update_mode_button",
    });
    const updateIcon = makeIconTag({
        iconName: "fas fa-eraser"
    });
    employeeUpdateModeButton.appendChild(updateIcon);
    employeeUpdateModeButton.addEventListener("click", () => updateEmployeeMode(employeeId));

    employeeDetailHeader.appendChild(employeeUpdateModeButton);

    const employeeDetailSectionChildren = Array.from(employeeDetailSection.children);
    employeeDetailSectionChildren.forEach(child => {
        if (child.name === "department") {
            const selectedDepartment = child.dataset.department;
            const makeParagraph = makeElementTag({
                element: "p",
                id: child.id,
                textContent: selectedDepartment
            });
            makeParagraph.dataset.paragraph = child.name;

            child.replaceWith(makeParagraph);
        } else if (child.name === "position") {
            const selectedPosition = child.dataset.position;

            const makeParagraph = makeElementTag({
                element: "p",
                id: child.id,
                textContent: selectedPosition
            });
            makeParagraph.dataset.paragraph = child.name;

            child.replaceWith(makeParagraph);
        } else if (child.name === "join_date") {
            const selectedJoinDate = child.dataset.join_date;

            const makeParagraph = makeElementTag({
                element: "p",
                id: child.id,
                textContent: selectedJoinDate
            });
            makeParagraph.dataset.paragraph = child.name;
            child.replaceWith(makeParagraph);

        } else if (child.name === "annual_leave") {
            const annualLeave = child.dataset.annual_leave;

            const makeParagraph = makeElementTag({
                element: "p",
                id: child.id,
                textContent: `${annualLeave}일`
            });
            makeParagraph.dataset.paragraph = child.name;
            child.replaceWith(makeParagraph);

        } else {
            const makeParagraph = makeElementTag({
                element: "p",
                id: child.id,
                textContent: child.dataset[child.name]
            });
            makeParagraph.dataset.paragraph = child.name;
            child.replaceWith(makeParagraph);
        }
    });

    colorChangeByLeftAnnualLeave();
}

export const updateEmployeeMode = (employeeId) => {
    const employeeDetailSection = document.getElementById("employee_detail_section");
    const employeeUpdateModeButton = document.getElementById("employee_update_mode_button");
    const employeeDetailHeader = document.getElementById("employee_detail_header");
    const employeeUpdateButtonBox = document.getElementById("employee_update_traffic_light_buttons_box");
    if (employeeUpdateButtonBox) employeeUpdateButtonBox.remove();

    makeDisabledState(true);

    if (employeeUpdateModeButton) employeeUpdateModeButton.remove();
    const updateButtonBox = makeElementTag({
        element: "div",
        id: "employee_update_traffic_light_buttons_box"
    });
    const updateEmployeeButton = makeElementTag({
        element: "button",
        id: "employee_update_button"
    });
    const updateEmployeeIcon = makeIconTag({
        iconName: "fas fa-check"
    });
    const exitEmployeeUpdateModeButton = makeElementTag({
        element: "button",
        id: "exit_employee_update_mode"
    });
    const exitUpdateEmployeeModeIcon = makeIconTag({
        iconName: "fas fa-arrow-left"
    });

    updateEmployeeButton.appendChild(updateEmployeeIcon);
    updateEmployeeButton.addEventListener("click", () => updateEmployee(employeeId));

    exitEmployeeUpdateModeButton.addEventListener("click", () => exitUpdateEmployeeMode(employeeId));
    document.addEventListener("keydown", (event) => {
        if (event.keyCode == 27) exitUpdateEmployeeMode(employeeId);
    });
    exitEmployeeUpdateModeButton.appendChild(exitUpdateEmployeeModeIcon);
    updateButtonBox.append(exitEmployeeUpdateModeButton, updateEmployeeButton);
    employeeDetailHeader.appendChild(updateButtonBox);

    const employeeDetailSectionChildren = Array.from(employeeDetailSection.children);
    employeeDetailSectionChildren.forEach(child => {
        const { paragraph: paragraphName } = child.dataset;
        if (!paragraphName) return;
        if (paragraphName === "department") {
            const beforeDepartment = document.getElementById("employee_detail_department").textContent;

            const selectDepartment = makeSelectTag({
                selectId: child.id,
                options: ["경영지원", "공공R&D", "마켓인텔리전스", "백엔드", "프론트엔드", "3D모델링", "경량시뮬", "PM"],
                name: paragraphName,
            });
            selectDepartment.dataset[paragraphName] = beforeDepartment;
            const options = Array.from(selectDepartment);
            const selectedOption = options.find(option => option.value === beforeDepartment);
            selectedOption.selected = true;

            child.replaceWith(selectDepartment);
        } else if (paragraphName === "position") {
            const beforePosition = document.getElementById("employee_detail_position").textContent;
            const selectPosition = makeSelectTag({
                selectId: child.id,
                options: ["이사", "수석", "책임", "주임", "사원", "인턴"],
                name: paragraphName
            });
            selectPosition.dataset[paragraphName] = beforePosition;

            const options = Array.from(selectPosition);
            const selectedOption = options.find(option => option.value === beforePosition);
            selectedOption.selected = true;

            child.replaceWith(selectPosition);
        } else if (paragraphName === "join_date") {
            const selectJoinDate = makeInputTag({
                id: child.id,
                type: "date",
                value: child.textContent,
                name: paragraphName,
                required: true
            });
            selectJoinDate.dataset[paragraphName] = child.textContent;
            child.replaceWith(selectJoinDate);
        } else if (paragraphName === "annual_leave") {
            const annualLeaveInput = makeInputTag({
                id: child.id,
                value: child.textContent.slice(0, -1),
                name: paragraphName
            });
            annualLeaveInput.min = 0;
            annualLeaveInput.max = 30;
            annualLeaveInput.step = 0.5;
            annualLeaveInput.dataset.annual_leave = child.textContent.slice(0, -1);
            child.replaceWith(annualLeaveInput);
        } else {
            const updateEmployeeInput = makeInputTag({
                id: child.id,
                value: child.textContent,
                name: paragraphName
            });
            updateEmployeeInput.dataset[paragraphName] = child.textContent;
            child.replaceWith(updateEmployeeInput);
        }
    });

};