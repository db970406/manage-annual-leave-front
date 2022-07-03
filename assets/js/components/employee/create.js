import { makeElementTag, makeInputTag, makeSelectTag } from '../../shared/makeHtmlTag.js';
import { timworxUrl } from '../../shared/requestUrl.js';
import { alarm, checkEmployeeValidation } from '../../shared/alert.js';
import { makeEmployee } from './utils.js';

const createEmployee = async (event) => {
    event.preventDefault();
    const children = Array.from(event.target.children);

    let formData = {
        name: null,
        position: null,
        email: null,
        phone_number: null,
        join_date: null,
        department: null,
    };

    children.forEach(child => {
        if (!child.name) return;
        const nameofInput = child.name;
        formData[nameofInput] = child.value;
    });

    const isValid = checkEmployeeValidation({ ...formData });
    if (!isValid) return;

    const data = await fetch(`${timworxUrl}/employee/create`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            ...formData
        })
    });

    if (data.status === 201) {
        const { newEmployeeId } = await data.json();
        makeEmployee({
            id: newEmployeeId,
            employeeName: formData.name
        })

        const transparentBg = document.getElementById("transparent_bg");
        transparentBg.remove();
    } else {
        alarm("이미 존재하는 이메일입니다.");
    }
};

export const createEmployeeComponent = () => {
    const transparentBg = makeElementTag({
        element: "div",
        id: "transparent_bg"
    });

    const addForm = makeElementTag({
        element: "form",
        id: "create_employee_form",
        className: "glass"
    });

    const nameInput = makeInputTag({
        placeholder: "이름",
        id: "employee_input_name",
        name: "name"
    });

    const positionSelect = makeSelectTag({
        selectId: "employee_select_position",
        options: ["이사", "수석", "책임", "주임", "사원", "인턴"],
        name: "position"
    });

    const emailInput = makeInputTag({
        placeholder: "이메일",
        id: "employee_input_email",
        type: "email",
        name: "email"
    });

    const phoneNumberInput = makeInputTag({
        placeholder: "전화번호",
        id: "employee_input_phone_number",
        name: "phone_number",
    });

    const joinDateInput = makeInputTag({
        placeholder: "입사일",
        id: "employee_input_join_date",
        type: "date",
        name: "join_date",
        required: true
    });

    const departmentSelect = makeSelectTag({
        selectId: "employee_select_department",
        options: ["공공R&D", "백엔드", "프론트엔드", "3D모델링", "경량시뮬", "PM", "경영지원", "마켓인텔리전스"],
        name: "department"
    });

    const callCreateEmployeeComponentButton = makeElementTag({
        element: "button",
        id: "create_employee_button",
        textContent: "직원 추가",
        className: "ani_button green_button"
    });

    addForm.append(nameInput, positionSelect, emailInput, phoneNumberInput, joinDateInput, departmentSelect, callCreateEmployeeComponentButton);
    transparentBg.appendChild(addForm);
    document.body.appendChild(transparentBg);

    addForm.addEventListener("submit", createEmployee)
    transparentBg.addEventListener("click", (event) => {
        if (event.target.parentNode === document.body) transparentBg.remove();
    });
};