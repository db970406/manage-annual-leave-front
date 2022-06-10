import { makeCategoryTag, makeElementTag, makeInputTag } from '../../shared/makeHtmlTag.js';
import { timworxUrl } from '../../shared/requestUrl.js';
import { alarm } from '../../shared/warnings.js';
import { checkMultipleOfPointFive } from '../employee/utils.js';
import { addFinishDateInArticle, addStartDateCategory, checkMatchedDuration, getDateFormat, makeNewWeeklyAnnualLeave, setWeeklyAnnualLeaveObj } from './utils.js';
import { carculateAnnualLeave, colorChangeByLeftAnnualLeave, countAnnualLeaveHowLong, initializeCreateAnnualLeaveForm, makeNewAnnualLeaveHistory } from './utils.js';

export const createAnnualLeave = async () => {
    // 연차 신청 폼에 있는 요소들의 textContent or value를 추출해서 createDataObj에 등록
    const vacationer = document.getElementById("create_annual_leave_name_paragraph");
    const startDateInput = document.getElementById("create_annual_leave_start_date_input");
    const finishDateInput = document.getElementById("create_annual_leave_finish_date_input");
    const totalUsedAnnualLeaveParagraph = document.getElementById("total_used_annual_leave_paragraph");

    const startDate = startDateInput.value;
    const finishDate = finishDateInput.value;

    const totalUsedAnnualLeave = +totalUsedAnnualLeaveParagraph.textContent.slice(0, -1) || 0.5;
    const isItMultipleOfPointFive = checkMultipleOfPointFive(totalUsedAnnualLeave);
    if (!isItMultipleOfPointFive) return;

    const isItOverRequest = checkMatchedDuration({ startDate, finishDate, totalUsedAnnualLeave });
    if (!isItOverRequest) return;

    const createDataObj = {
        employeeId: vacationer.dataset.employee_id,
        startDate,
        finishDate,
        howLong: totalUsedAnnualLeave
    };

    const employeeDetailAnnualLeaveParagraph = document.getElementById("employee_detail_annual_leave");
    const leftAnnualLeave = +employeeDetailAnnualLeaveParagraph.textContent.slice(0, -1);
    if (createDataObj.howLong > leftAnnualLeave) {
        alarm("남아 있는 연차를 확인해주세요.");
        return;
    }

    // createDataObj에 담긴 데이터들을 body에 싣어 익스프레스 서버에 요청을 보냄
    const data = await fetch(`${timworxUrl}/annual-leave/create`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ ...createDataObj })
    });

    // 서버에서 성공적으로 데이터를 생성하고 201 상태코드를 반환하면 일어나는 로직
    if (data.status === 201) {
        const startDate = new Date(startDateInput.value);
        const nowDate = new Date();

        const { annualLeaveData } = await data.json();

        const getMilliSecGap = startDate.setDate(startDate.getDate()) - nowDate.setDate(nowDate.getDate());
        const getDateGap = new Date(getMilliSecGap).getDate();

        // 오늘로부터 7일 내의 연차라면 주간 연차리스트에 추가한다.
        if (getDateGap <= 7) {
            addStartDateCategory(annualLeaveData.start_date);
            addFinishDateInArticle({
                annualLeaveId: annualLeaveData.annual_leave_id,
                employeeId: annualLeaveData.employee_id,
                startDate: annualLeaveData.start_date,
                finishDate: annualLeaveData.finish_date,
                howLong: annualLeaveData.how_long,
                employeeName: vacationer.textContent.split(" ")[0]
            });
        };

        carculateAnnualLeave({
            kindOfCarculate: "create"
        });
        colorChangeByLeftAnnualLeave();
        makeNewAnnualLeaveHistory({ ...annualLeaveData });
        initializeCreateAnnualLeaveForm();
    }
}

export const createAnnualLeaveComponent = () => {
    const createAnnualLeaveScreen = makeElementTag({
        element: "section",
        id: "create_annual_leave"
    });
    const createAnnualLeaveHeader = makeElementTag({
        element: "header",
        id: "create_annual_leave_header"
    });
    const createAnnualLeaveHeaderName = makeElementTag({
        element: "h2",
        id: "create_annual_leave_header_name",
        textContent: "연차 신청"
    });

    const createAnnualLeaveSection = makeElementTag({
        element: "section",
        id: "create_annual_leave_section"
    });

    const createAnnualLeaveForm = makeElementTag({
        element: "div",
        id: "create_annual_leave_form"
    });

    const nameBox = makeCategoryTag({
        boxId: "create_annual_leave_name_box",
        category: "이름",
        contentId: "create_annual_leave_name_paragraph",
    });

    const dateBox = makeCategoryTag({
        boxId: "create_annual_leave_date_box",
        category: "날짜"
    });

    const today = new Date();
    // 연차 신청 가능 날짜 범위를 오늘 기준 다음날 ~ 올해의 마지막 날로 제한한다.
    const tomorrow = getDateFormat(today, 1);
    const lastDateOfYear = `${today.getFullYear()}-12-31`;
    const startDateInput = makeInputTag({
        placeholder: "시작일",
        id: "create_annual_leave_start_date_input",
        type: "date",
        required: true
    });
    startDateInput.min = tomorrow;
    startDateInput.max = lastDateOfYear;

    const finishDateInput = makeInputTag({
        placeholder: "종료일",
        id: "create_annual_leave_finish_date_input",
        type: "date",
        required: true
    });
    finishDateInput.min = tomorrow;
    finishDateInput.max = lastDateOfYear;

    const totalUsedAnnualLeaveBox = makeCategoryTag({
        boxId: "total_used_annual_leave_box",
        category: "총일수",
        contentId: "total_used_annual_leave_paragraph"
    });

    const createButton = makeElementTag({
        element: "button",
        id: "create_annual_leave_button",
        textContent: "신청",
        className: "ani_button green_button"
    });

    startDateInput.addEventListener("input", countAnnualLeaveHowLong);
    finishDateInput.addEventListener("input", countAnnualLeaveHowLong);
    dateBox.append(startDateInput, finishDateInput);

    const controllBox = makeElementTag({
        element: "div",
        id: "annual_leave_controll_box"
    });
    controllBox.append(createButton);
    createAnnualLeaveForm.append(nameBox, dateBox, totalUsedAnnualLeaveBox, controllBox);
    createAnnualLeaveHeader.appendChild(createAnnualLeaveHeaderName);
    createAnnualLeaveSection.classList.add("disabled");
    createAnnualLeaveSection.appendChild(createAnnualLeaveForm);
    createButton.addEventListener("click", createAnnualLeave);
    createAnnualLeaveScreen.append(createAnnualLeaveHeader, createAnnualLeaveSection);
    return createAnnualLeaveScreen;
}