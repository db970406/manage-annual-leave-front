import { checkHalfLeave, clearDemical } from '../../shared/utils.js';
import { makeElementTag, makeIconTag } from '../../shared/makeHtmlTag.js';
import { alarm, warning } from '../../shared/alert.js';
import { colorChangeByLeftAnnualLeave, initializeCreateAnnualLeaveForm, makeNewAnnualLeaveHistory, removeAnnualLeaveInHistory, removeWeeklyAnnualLeave, carculateAnnualLeave, findAnnualLeaveHowLongInHistory, checkMatchedDuration, addFinishDateInArticle, addStartDateCategory } from './utils.js';
import { checkMultipleOfPointFive } from '../employee/utils.js';
import { timworxUrl } from '../../shared/requestUrl.js';

const updateAnnualLeave = (annualLeaveId) => {
    const executeEvent = async () => {
        const employeeNameParagraph = document.getElementById("create_annual_leave_name_paragraph");
        const employeeId = employeeNameParagraph.dataset.employee_id;
        const startDateInput = document.getElementById("create_annual_leave_start_date_input");
        const finishDateInput = document.getElementById("create_annual_leave_finish_date_input");
        const afterTotalUsedAnnualLeaveParagraph = document.getElementById("total_used_annual_leave_paragraph");

        const startDate = startDateInput.value;
        const finishDate = finishDateInput.value;

        const afterTotalUsedAnnualLeave = +afterTotalUsedAnnualLeaveParagraph.textContent.slice(0, -1) || 0.5;
        const isItMultipleOfPointFive = checkMultipleOfPointFive(afterTotalUsedAnnualLeave);
        if (!isItMultipleOfPointFive) return;

        const isItOverRequest = checkMatchedDuration({
            startDate,
            finishDate,
            totalUsedAnnualLeave: afterTotalUsedAnnualLeave
        });
        if (!isItOverRequest) return;

        const howLong = findAnnualLeaveHowLongInHistory(annualLeaveId);
        const employeeDetailAnnualLeaveParagraph = document.getElementById("employee_detail_annual_leave");
        const leftAnnualLeave = +employeeDetailAnnualLeaveParagraph.textContent.slice(0, -1) || 0.5;

        if (afterTotalUsedAnnualLeave > leftAnnualLeave + howLong) {
            alarm("?????? ?????? ????????? ??????????????????.");
            return;
        }

        const data = await fetch(`${timworxUrl}/annual-leave/${annualLeaveId}/update`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                employeeId: +employeeId,
                startDate,
                finishDate,
                beforeHowLong: howLong,
                afterHowLong: afterTotalUsedAnnualLeave
            })
        });

        if (data.status === 200) {
            carculateAnnualLeave({
                kindOfCarculate: "update",
                targetId: annualLeaveId
            });

            // ?????? ????????? ?????????????????? ????????? ????????????
            removeAnnualLeaveInHistory(annualLeaveId);
            // ?????? ???????????? append??????
            const newAnnualLeaveHistory = {
                employee_id: employeeId,
                annual_leave_id: annualLeaveId,
                start_date: startDate,
                finish_date: finishDate,
                how_long: afterTotalUsedAnnualLeave
            }
            makeNewAnnualLeaveHistory({ ...newAnnualLeaveHistory });

            // ?????? ????????? ?????? ?????? ??????????????? ????????? ????????? ???????????????
            removeWeeklyAnnualLeave(annualLeaveId);
            // ?????? ?????? ???????????? append??????

            const startDateFormat = new Date(startDate);
            const nowDate = new Date();
            const getMilliSecGap = startDateFormat.setDate(startDateFormat.getDate()) - nowDate.setDate(nowDate.getDate());
            const getDateGap = new Date(getMilliSecGap).getDate();

            // ??????????????? 7??? ?????? ???????????? ?????? ?????????????????? ????????????.
            if (getDateGap <= 7) {
                addStartDateCategory(newAnnualLeaveHistory.start_date);
                addFinishDateInArticle({
                    annualLeaveId: newAnnualLeaveHistory.annual_leave_id,
                    employeeId: newAnnualLeaveHistory.employee_id,
                    startDate: newAnnualLeaveHistory.start_date,
                    finishDate: newAnnualLeaveHistory.finish_date,
                    howLong: newAnnualLeaveHistory.how_long,
                    employeeName: employeeNameParagraph.textContent.split(" ")[0]
                });
            }
            colorChangeByLeftAnnualLeave();
            initializeCreateAnnualLeaveForm();
        }
    }
    warning({ warningString: "?????? ?????????????????????????", executeEvent });
}

export const updateAnnualLeaveMode = async ({ annual_leave_id, start_date, finish_date, how_long }) => {
    const createAnnualLeaveHeader = document.getElementById("create_annual_leave_header");
    const createAnnualLeaveHeaderName = document.getElementById("create_annual_leave_header_name");
    createAnnualLeaveHeaderName.textContent = "?????? ??????";

    const backToCreateAnnualLeaveButton = document.getElementById("back_to_create_annual_leave_button");
    if (!backToCreateAnnualLeaveButton) {
        const newBackToCreateAnnualLeaveButton = makeElementTag({
            element: "button",
            id: "back_to_create_annual_leave_button"
        });

        const backIcon = makeIconTag({
            iconName: "fas fa-arrow-left"
        });
        newBackToCreateAnnualLeaveButton.appendChild(backIcon);
        newBackToCreateAnnualLeaveButton.addEventListener("click", initializeCreateAnnualLeaveForm);
        document.addEventListener("keydown", (event) => {
            if (event.keyCode == 27) initializeCreateAnnualLeaveForm();
        })
        createAnnualLeaveHeader.appendChild(newBackToCreateAnnualLeaveButton);
    }

    const startDateInput = document.getElementById("create_annual_leave_start_date_input");
    const finishDateInput = document.getElementById("create_annual_leave_finish_date_input");
    const afterTotalUsedAnnualLeave = document.getElementById("total_used_annual_leave_paragraph");
    const createAnnualLeaveButton = document.getElementById("create_annual_leave_button");
    if (createAnnualLeaveButton) createAnnualLeaveButton.remove();

    const controllBox = document.getElementById("annual_leave_controll_box");

    startDateInput.value = start_date;
    finishDateInput.value = finish_date;
    afterTotalUsedAnnualLeave.textContent = checkHalfLeave(clearDemical(how_long));

    const isUpdateButtonExist = document.getElementById("update_annual_leave_button");
    if (!isUpdateButtonExist) {
        const updateAnnualLeaveButton = makeElementTag({
            element: "button",
            id: "update_annual_leave_button",
            textContent: "?????? ??????",
            className: "ani_button green_button"
        });

        updateAnnualLeaveButton.addEventListener("click", () => updateAnnualLeave(annual_leave_id));
        controllBox.appendChild(updateAnnualLeaveButton);
    };
}
