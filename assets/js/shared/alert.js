import { makeElementTag } from './makeHtmlTag.js';

const warningLayout = (warningString) => {
    const warningScreen = makeElementTag({
        element: "div",
        id: "warning_screen"
    });
    const warningBox = makeElementTag({
        element: "div",
        id: "warning_box",
        className: "glass"
    });
    const warningText = makeElementTag({
        element: "strong",
        id: "warning_text",
        textContent: warningString
    });
    const warningButtonsBox = makeElementTag({
        element: "div",
        id: "warning_buttons_box"
    });
    warningBox.append(warningText, warningButtonsBox);
    warningScreen.appendChild(warningBox);
    document.body.prepend(warningScreen);
}

export const warning = ({ warningString, executeEvent }) => {
    warningLayout(warningString);

    const executeButton = makeElementTag({
        element: "button",
        id: "execute_button",
        textContent: "실행",
        className: "ani_button red_button"
    });
    const stopButton = makeElementTag({
        element: "button",
        id: "stop_button",
        textContent: "취소",
        className: "ani_button green_button"
    });

    const warningScreen = document.getElementById("warning_screen");
    executeButton.addEventListener("click", () => {
        warningScreen.remove();
        executeEvent();
    });
    stopButton.addEventListener("click", () => {
        warningScreen.remove();
    });
    const warningButtonsBox = document.getElementById("warning_buttons_box");

    warningButtonsBox.append(executeButton, stopButton);
    executeButton.focus();
    document.addEventListener("keydown", (event) => {
        if (event.keyCode === 27) warningScreen.remove();
    })
}

const checkValidationText = {
    "name": "이름은 한글로 2~5글자입니다.",
    "email": "이메일 양식을 지켜주세요.",
    "phone_number": "전화번호 양식을 지켜주세요.",
    "join_date": "날짜 양식을 지켜주세요.",
    "position": "잘못된 직책입니다.",
    "department": "잘못된 부서입니다.",
    "annual_leave": "연차는 0 ~ 30일로 부여할 수 있습니다.",
}
export const checkEmployeeValidation = ({
    name,
    email,
    phone_number,
    join_date,
    position,
    department,
    annual_leave
}) => {
    let type = null;
    const isValidName = /^[가-힣]{2,5}$/.test(name);
    const isValidEmail = /^[A-Za-z0-9.\-_]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/.test(email);
    const isValidPhoneNumber = /^\d{2,3}\d{3,4}\d{4}$/.test(phone_number);
    const isValidDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(join_date);

    // update일 때는 상관없으나 create할 때는 annual_leave가 없어 isValidAnnualLeave가 false가 되어 에러가 뜨게 되는데 
    // 우선적으로 true를 할당하여 create에서는 이를 신경쓰지 않게 한다.
    // 만약 update라면 조건문을 거쳐 isValidAnnualLeave에 true/false를 재할당하게 될 것이다.
    let isValidAnnualLeave = true;

    if (annual_leave || annual_leave === "") {
        const annualLeave = annual_leave ? +annual_leave : undefined;
        isValidAnnualLeave = annualLeave >= 0 && annualLeave <= 30;
    }

    const positionArray = ["이사", "수석", "책임", "주임", "사원", "인턴"];
    const findPosition = positionArray.find(item => item === position);
    const departmentArray = ["공공R&D", "백엔드", "프론트엔드", "3D모델링", "경량시뮬", "PM", "경영지원", "마켓인텔리전스"];
    const findDepartment = departmentArray.find(item => item === department);
    if (!isValidName) type = "name";
    else if (!isValidEmail) type = "email";
    else if (!isValidPhoneNumber) type = "phone_number";
    else if (!isValidDate) type = "join_date";
    else if (!findPosition) type = "position";
    else if (!findDepartment) type = "department";
    else if (!isValidAnnualLeave) type = "annual_leave";

    if (!isValidName || !isValidEmail || !isValidPhoneNumber || !isValidDate || !findPosition || !findDepartment || !isValidAnnualLeave) {
        const createEmployeeForm = document.getElementById("create_employee_form");
        const updateEmployeeForm = document.getElementById("employee_detail_section");

        const formInfos = Array.from(createEmployeeForm ? createEmployeeForm.children : updateEmployeeForm.children);

        const isExistInvalidText = document.getElementById("invalid_text");
        if (isExistInvalidText) isExistInvalidText.remove();
        formInfos.forEach(info => {
            const findInValidElement = type === info.name;
            if (findInValidElement) {
                info.focus();
                const isExistInvalidText = document.getElementById("invalid_text");
                if (!isExistInvalidText) {
                    const invalidText = makeElementTag({
                        element: "p",
                        id: "invalid_text",
                        textContent: checkValidationText[type]
                    });
                    info.classList.add("invalid");
                    info.insertAdjacentElement("afterend", invalidText);
                }
            } else {
                const checkInValidText = info.nextElementSibling;
                if (checkInValidText) {
                    const isInValidText = checkInValidText.id === "invalid_text";
                    info.classList.remove("invalid");
                    if (isInValidText) checkInValidText.remove();
                }
            }
        });
        // 알람 문구가 없으면 유효성 검사 통과했다는 뜻
        return false;
    }
    const allInvalidText = document.querySelectorAll("#invalid_text");
    allInvalidText.forEach(text => text.remove());
    return true;
}

export const alarm = (alarmString, targetInput) => {
    warningLayout(alarmString);
    const okButton = makeElementTag({
        element: "button",
        id: "ok_button",
        textContent: "확인",
        className: "ani_button black_button"
    });
    const warningScreen = document.getElementById("warning_screen");
    const warningButtonsBox = document.getElementById("warning_buttons_box");

    okButton.addEventListener("click", () => {
        warningScreen.remove();
        if (targetInput) targetInput.focus();
    });
    warningButtonsBox.appendChild(okButton);
    okButton.focus();
}


