import { makeCategoryTag, makeElementTag, makeIconTag, makeInputTag } from '../../shared/makeHtmlTag.js';
import { checkHalfLeave, clearDemical } from '../../shared/utils.js';
import { alarm } from '../../shared/alert.js';
import { deleteEmployee } from '../employee/delete.js';
import { showEmployeeDetailBySelect } from '../employee/utils.js';
import { createAnnualLeave } from './create.js';
import { deleteAnnualLeave } from './delete.js';
import { updateAnnualLeaveMode } from './update.js';

export const colorChangeByLeftAnnualLeave = () => {
    const employeeDetailAnnualLeave = document.getElementById("employee_detail_annual_leave");
    const leftAnnualLeave = +employeeDetailAnnualLeave.textContent.slice(0, -1);
    if (leftAnnualLeave > 10) {
        employeeDetailAnnualLeave.className = "many";
    } else if (leftAnnualLeave > 5) {
        employeeDetailAnnualLeave.className = "normal";
    } else {
        employeeDetailAnnualLeave.className = "few";
    }
}

export const initializeCreateAnnualLeaveForm = () => {
    const createAnnualLeaveHeaderName = document.getElementById("create_annual_leave_header_name");
    createAnnualLeaveHeaderName.textContent = "연차 신청";
    const backToCreateAnnualLeaveButton = document.getElementById("back_to_create_annual_leave_button");
    if (backToCreateAnnualLeaveButton) backToCreateAnnualLeaveButton.remove();

    const annualLeaveControllBox = document.getElementById("annual_leave_controll_box");
    while (annualLeaveControllBox.childElementCount > 0) {
        annualLeaveControllBox.removeChild(annualLeaveControllBox.firstChild);
    }

    const totalUsedAnnualLeave = document.getElementById("total_used_annual_leave_paragraph");
    totalUsedAnnualLeave.textContent = "";

    const createAnnualLeaveStartDateInput = document.getElementById("create_annual_leave_start_date_input");
    const createAnnualLeaveFinishDateInput = document.getElementById("create_annual_leave_finish_date_input");
    const halfLeaveParagraph = document.getElementById("half_leave_paragraph");
    if (halfLeaveParagraph) halfLeaveParagraph.remove();

    createAnnualLeaveStartDateInput.value = "";
    createAnnualLeaveFinishDateInput.value = "";
    createAnnualLeaveFinishDateInput.min = "";
    createAnnualLeaveFinishDateInput.max = "";

    const createAnnualLeaveButton = makeElementTag({
        element: "button",
        textContent: "신청",
        id: "create_annual_leave_button",
        className: "ani_button green_button"
    });

    createAnnualLeaveButton.addEventListener("click", createAnnualLeave);

    annualLeaveControllBox.appendChild(createAnnualLeaveButton);
    createAnnualLeaveButtonDisabled(true);
}

const makeHalfLeave = (event) => {
    const isChecking = event.target.checked;
    const totalUsedAnnualLeaveParagraph = document.getElementById("total_used_annual_leave_paragraph");
    totalUsedAnnualLeaveParagraph.textContent = isChecking ? "반차" : "1일";
}

export const countAnnualLeaveHowLong = () => {
    const startDateInput = document.getElementById("create_annual_leave_start_date_input");
    const finishDateInput = document.getElementById("create_annual_leave_finish_date_input");
    const totalUsedAnnualLeave = document.getElementById("total_used_annual_leave_paragraph");

    const startDateInputValue = startDateInput.value;
    const finishDateInputValue = finishDateInput.value;

    const startDate = new Date(startDateInputValue);
    const finishDate = new Date(finishDateInputValue);
    if (finishDateInputValue) {
        if (startDate > finishDate) {
            alarm("시작일은 종료일을 초과할 수 없습니다.");
            startDateInput.value = "";
            totalUsedAnnualLeave.textContent = "";
            return;
        }
    }

    createAnnualLeaveButtonDisabled(startDateInputValue && finishDateInputValue ? false : true);

    const setDate = finishDate.setDate(finishDate.getDate()) - startDate.setDate(startDate.getDate());
    const countDate = new Date(setDate).getDate();
    isNaN(countDate) ? null : totalUsedAnnualLeave.textContent = `${countDate}일`;

    if (countDate === 1) {
        const totalUsedAnnualLeaveBox = document.getElementById("total_used_annual_leave_box");

        const halfLeaveParagraph = makeCategoryTag({
            boxId: "half_leave_paragraph",
            category: "반차여부",
        });
        const radioCheck = makeInputTag({
            type: "checkbox",
            id: "half_leave_checkbox"
        });

        radioCheck.addEventListener("input", makeHalfLeave);

        halfLeaveParagraph.appendChild(radioCheck);
        totalUsedAnnualLeaveBox.appendChild(halfLeaveParagraph);
    } else {
        const halfLeaveParagraph = document.getElementById("half_leave_paragraph");
        if (halfLeaveParagraph) halfLeaveParagraph.remove();
    }

    // 한 번에 신청할 수 있는 날을 최대 5일로 제한
    if (startDateInputValue) {
        const after5days = new Date(startDate.setDate(startDate.getDate() + 4)).toISOString().substring(0, 10);
        finishDateInput.min = startDateInputValue;
        finishDateInput.max = after5days;
    }
};

export const makeNewWeeklyAnnualLeave = ({ annual_leave_id, employee_id, start_date, finish_date, how_long, employee_name }) => {
    const weeklyAnnualLeaveStartDate = document.querySelectorAll("#weekly_annual_leave_start_date");
    const weeklyAnnualLeaveStartDateArray = Array.from(weeklyAnnualLeaveStartDate);
    const findSameStartDate = weeklyAnnualLeaveStartDateArray.find(startDate => startDate.textContent === start_date);
    if (findSameStartDate) {
        const article = findSameStartDate.parentNode;
        const weeklyAnnualLeaveFinishDate = makeElementTag({
            element: "p",
            id: "weekly_annual_leave_finish_date",
            textContent: `~ ${finish_date.substring(5)}(${checkHalfLeave(clearDemical(how_long))}) ${employee_name}`
        });
        weeklyAnnualLeaveFinishDate.dataset.employee_id = employee_id;
        weeklyAnnualLeaveFinishDate.dataset.annual_leave_id = annual_leave_id;
        article.appendChild(weeklyAnnualLeaveFinishDate);
    }
}
let startDateCategory = {};
export const setWeeklyAnnualLeaveObj = ({ annual_leave_id, employee_id, start_date, finish_date, how_long, employee_name }) => {
    const findStartDate = startDateCategory[start_date];
    if (!findStartDate) {
        startDateCategory[start_date] = [];
        startDateCategory[start_date].push(`~ ${finish_date}(${checkHalfLeave(clearDemical(how_long))}) ${employee_name}/${annual_leave_id}/${employee_id}`);
    } else {
        startDateCategory[start_date].push(`~ ${finish_date}(${checkHalfLeave(clearDemical(how_long))}) ${employee_name}/${annual_leave_id}/${employee_id}`);
    }
}
export const addStartDateCategory = (startDate) => {
    const weeklyAnnualLeaveSection = document.getElementById("weekly_annual_leave_section");
    const weeklyAnnualLeaveStartDates = document.querySelectorAll("#weekly_annual_leave_start_date");
    const weeklyAnnualLeaveStartDatesArray = Array.from(weeklyAnnualLeaveStartDates);
    const isExistStartDate = weeklyAnnualLeaveStartDatesArray.find(date => date.textContent === startDate);
    if (!isExistStartDate) {
        const weeklyAnnualLeaveArticle = makeElementTag({
            element: "article",
            id: "weekly_annual_leave"
        });
        const weeklyAnnualLeaveStartDate = makeElementTag({
            element: "h3",
            id: "weekly_annual_leave_start_date",
            textContent: startDate
        });
        weeklyAnnualLeaveArticle.appendChild(weeklyAnnualLeaveStartDate);
        weeklyAnnualLeaveSection.prepend(weeklyAnnualLeaveArticle);
    }
}

export const addFinishDateInArticle = ({ startDate, finishDate, howLong, employeeId, annualLeaveId, employeeName }) => {
    const weeklyAnnualLeaveStartDates = document.querySelectorAll("#weekly_annual_leave_start_date");
    const weeklyAnnualLeaveStartDatesArray = Array.from(weeklyAnnualLeaveStartDates);
    const findMatchedStartDate = weeklyAnnualLeaveStartDatesArray.find(date => date.textContent === startDate);
    const weeklyAnnualLeaveFinishDate = makeElementTag({
        element: "p",
        id: "weekly_annual_leave_finish_date",
        textContent: `~ ${finishDate.substring(5)}(${checkHalfLeave(clearDemical(howLong))}) ${employeeName}`
    });
    weeklyAnnualLeaveFinishDate.dataset.annual_leave_id = annualLeaveId;
    weeklyAnnualLeaveFinishDate.dataset.employee_id = employeeId;
    deleteByDragAndDrop("annualLeave", weeklyAnnualLeaveFinishDate);

    weeklyAnnualLeaveFinishDate.addEventListener("click", () => {
        showEmployeeDetailBySelect(employeeId);
        updateAnnualLeaveMode({
            annual_leave_id: annualLeaveId,
            start_date: startDate,
            finish_date: finishDate,
            how_long: howLong
        });
    });
    findMatchedStartDate.parentElement.appendChild(weeklyAnnualLeaveFinishDate);
}

export const initializeWeeklyAnnualLeave = () => {
    Object.keys(startDateCategory).forEach(startDate => {
        addStartDateCategory(startDate);

        startDateCategory[startDate].forEach(finishDateInfo => {
            const splitFinishDate = finishDateInfo.split("/");
            addFinishDateInArticle({
                annualLeaveId: splitFinishDate[1],
                employeeId: splitFinishDate[2],
                employeeName: splitFinishDate[0].substring(16),
                startDate,
                finishDate: splitFinishDate[0].substring(2, 12),
                howLong: splitFinishDate[0].substring(13, 14)
            })
        });
    });
}

export const removeWeeklyAnnualLeave = (annualLeaveId) => {
    const weeklyAnnualLeaveSection = document.querySelectorAll("#weekly_annual_leave_finish_date");
    const weeklyAnnualLeaves = Array.from(weeklyAnnualLeaveSection);
    const findUpdatedAnnualLeave = weeklyAnnualLeaves.find(history => +history.dataset.annual_leave_id === +annualLeaveId);
    if (findUpdatedAnnualLeave) findUpdatedAnnualLeave.remove();
}

export const removeAnnualLeaveInHistory = (annualLeaveId) => {
    const historyAnnualLeaveSection = document.getElementById("history_annual_leave_section");
    const annualLeaveHistories = Array.from(historyAnnualLeaveSection.children);
    const findAnnualLeaveInHistory = annualLeaveHistories.find((history) => +history.dataset.annual_leave_id === +annualLeaveId);
    if (findAnnualLeaveInHistory) findAnnualLeaveInHistory.remove();
}

export const makeNewAnnualLeaveHistory = ({ annual_leave_id, start_date, finish_date, how_long }) => {
    const createAnnualLeaveNameParagraph = document.getElementById("create_annual_leave_name_paragraph");

    const historyArticle = makeElementTag({
        element: "article",
        id: "history_annual_leave"
    });
    historyArticle.dataset.annual_leave_id = annual_leave_id;
    historyArticle.dataset.employee_id = createAnnualLeaveNameParagraph.dataset.employee_id;

    const startDateParagraph = makeElementTag({
        element: "p",
        id: "history_annual_leave_start_date",
        textContent: start_date
    });
    const finishDateParagraph = makeElementTag({
        element: "p",
        id: "history_annual_leave_finish_date",
        textContent: finish_date
    });
    const howLongParagraph = makeElementTag({
        element: "p",
        id: "history_annual_leave_how_long",
        textContent: checkHalfLeave(clearDemical(how_long))
    });
    historyArticle.append(startDateParagraph, finishDateParagraph, howLongParagraph);

    const nowDate = new Date();
    const annualLeaveStartDate = new Date(start_date);
    if (nowDate > annualLeaveStartDate) {
        historyArticle.classList.add("expired");
        historyArticle.classList.add("disabled");
    } else {
        historyArticle.addEventListener("click", () => updateAnnualLeaveMode({ annual_leave_id, start_date, finish_date, how_long }));
        deleteByDragAndDrop("annualLeave", historyArticle);
    }
    const historyAnnualLeaveSection = document.getElementById("history_annual_leave_section");
    historyAnnualLeaveSection.prepend(historyArticle);
};

export const carculateAnnualLeave = ({ kindOfCarculate, targetId }) => {
    const employeeDetailAnnualLeave = document.getElementById("employee_detail_annual_leave");
    const totalUsedAnnualLeaveParagraph = document.getElementById("total_used_annual_leave_paragraph");

    const beforeValue = +employeeDetailAnnualLeave.textContent.slice(0, -1);
    const totalUsed = +totalUsedAnnualLeaveParagraph.textContent.slice(0, -1) || 0.5;
    const howLong = findAnnualLeaveHowLongInHistory(+targetId);
    const ifCreated = beforeValue - totalUsed;
    const ifDeleted = beforeValue + howLong;
    const ifUpdated = ifDeleted - totalUsed;

    let annualLeave = null;
    if (kindOfCarculate === "create") annualLeave = ifCreated;
    else if (kindOfCarculate === "delete") annualLeave = ifDeleted;
    else if (kindOfCarculate === "update") annualLeave = ifUpdated;

    const leftAnnualLeave = clearDemical(annualLeave);
    employeeDetailAnnualLeave.textContent = `${isNaN(leftAnnualLeave) ? 0 : leftAnnualLeave}일`;
}

export const resetHistoryAnnualLeaveSection = () => {
    let historyAnnualLeaveSection = document.getElementById("history_annual_leave_section");
    if (historyAnnualLeaveSection.childElementCount > 0) {
        const employeeBottomScreen = document.getElementById("employee_bottom_screen");
        historyAnnualLeaveSection.remove();
        historyAnnualLeaveSection = makeElementTag({
            element: "section",
            id: "history_annual_leave_section"
        });
        employeeBottomScreen.appendChild(historyAnnualLeaveSection);
    }
}

export const createAnnualLeaveButtonDisabled = (disabled) => {
    const createAnnualLeaveButton = document.getElementById("create_annual_leave_button");
    if (createAnnualLeaveButton) createAnnualLeaveButton.disabled = disabled;
}

export const findAnnualLeaveHowLongInHistory = (targetId) => {
    const historyAnnualLeaveSection = document.getElementById("history_annual_leave_section");

    const annualLeaveHistories = Array.from(historyAnnualLeaveSection.children);
    const targetAnnualLeaveHistory = annualLeaveHistories.find(annualLeaveHistory => +annualLeaveHistory.dataset.annual_leave_id === +targetId);
    const targetHowLongParagraph = targetAnnualLeaveHistory ? targetAnnualLeaveHistory.querySelector("#history_annual_leave_how_long") : undefined;

    const howLong = targetHowLongParagraph ? +targetHowLongParagraph.textContent.slice(0, -1) || 0.5 : undefined;
    return howLong;
}

export const getDateFormat = (milliSecond, plusDate) => {
    const year = milliSecond.getFullYear();
    const month = String(milliSecond.getMonth() + 1).padStart(2, "0");
    const date = String(milliSecond.getDate() + plusDate).padStart(2, "0");

    return `${year}-${month}-${date}`;
}

export const checkMatchedDuration = ({ startDate, finishDate, totalUsedAnnualLeave }) => {
    const startDateFormat = new Date(startDate);
    const finishDateFormat = new Date(finishDate);

    const dateGapToMilliSec = finishDateFormat.setDate(finishDateFormat.getDate()) - startDateFormat.setDate(startDateFormat.getDate());
    const getDateGap = new Date(dateGapToMilliSec).getDate();
    if (getDateGap !== +totalUsedAnnualLeave && getDateGap !== 1) {
        alarm("기간과 총일수가 일치하지 않습니다.");
        return false;
    }
    return true;
}


export const deleteByDragAndDrop = (deleteWhat, targetElement) => {
    targetElement.draggable = true;
    targetElement.addEventListener("dragstart", (e) => {
        const { target } = e;
        const { annual_leave_id: annualLeaveId, employee_id: employeeId } = target.dataset;
        const howLong = target.textContent.substring(8, 9);

        e.dataTransfer.setDragImage(target, 0, 0);

        const glassDashboard = document.getElementById("glass_dashboard");
        const dropSpace = makeElementTag({
            element: "div",
            id: "drop_space",
            className: "in"
        });
        const deleteZone = makeElementTag({
            element: "div",
            id: "delete_zone"
        });
        const deleteIcon = makeIconTag({
            iconName: "fas fa-trash-alt"
        });

        deleteZone.appendChild(deleteIcon);
        dropSpace.addEventListener("dragover", (event) => {
            event.preventDefault();
            const dropSpace = document.getElementById("drop_space");
            dropSpace.classList.add("hovered");
        });
        dropSpace.addEventListener("dragleave", (event) => {
            event.preventDefault();
            const dropSpace = document.getElementById("drop_space");
            dropSpace.classList.remove("hovered");
        });
        dropSpace.addEventListener("drop", (event) => {
            event.preventDefault();
            if (deleteWhat === "employee") {
                deleteEmployee(employeeId);
            } else if (deleteWhat === "annualLeave") {
                deleteAnnualLeave({
                    annualLeaveId,
                    employeeId,
                    howLong: isNaN(howLong) ? 0.5 : +howLong
                });
            }
        })
        dropSpace.appendChild(deleteZone);
        glassDashboard.appendChild(dropSpace);
    })
    targetElement.addEventListener("drag", () => { })
    targetElement.addEventListener("dragend", () => {
        const dropSpace = document.getElementById("drop_space");
        dropSpace.remove();
    });
}

