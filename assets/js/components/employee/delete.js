import { makeDisabledState } from '../../shared/disabled.js';
import { timworxUrl } from '../../shared/requestUrl.js';
import { alarm, warning } from '../../shared/alert.js';
import { createAnnualLeaveButtonDisabled, resetHistoryAnnualLeaveSection } from '../annual-leave/utils.js';
import { employeeDetailComponent } from './read.js';
import { makeUpdateButton } from './utils.js';

export const deleteEmployee = (employeeId) => {
    const executeEvent = async () => {
        const data = await fetch(`${timworxUrl}/employee/${employeeId}/delete`, {
            method: "DELETE",
        });

        if (data.status === 200) {
            const allEmployeesSection = document.getElementById("all_employees_section");
            const allEmployees = Array.from(allEmployeesSection.children);
            allEmployees.forEach(employee => {
                const findSameEmployeeId = employee.dataset.employee_id;

                if (+findSameEmployeeId === +employeeId) {
                    employee.remove();
                    const employeeDetailScreen = document.getElementById("employee_detail_screen");
                    const selectedEmployee = document.getElementById("selected_employee");
                    const createAnnualLeaveNameParagraph = document.getElementById("create_annual_leave_name_paragraph");

                    employeeDetailScreen.remove();
                    selectedEmployee.textContent = "";
                    createAnnualLeaveNameParagraph.textContent = "";

                    const employeeTopScreen = document.getElementById("employee_top_screen");
                    const newEmployeeDetailScreen = employeeDetailComponent();
                    employeeTopScreen.prepend(newEmployeeDetailScreen);
                    makeUpdateButton({ employeeId, isDelete: true });
                    makeDisabledState(false);
                    resetHistoryAnnualLeaveSection();
                    createAnnualLeaveButtonDisabled(true);
                    const weeklyAnnualLeaveFinishDates = document.querySelectorAll("#weekly_annual_leave_finish_date");
                    weeklyAnnualLeaveFinishDates.forEach(date => {
                        if (+date.dataset.employee_id === +employeeId) date.remove();
                    });
                }
            });

            const weeklyAnnualLeaves = document.querySelectorAll("#weekly_annual_leave_finish_date");
            const weeklyAnnualLeavesArray = Array.from(weeklyAnnualLeaves);
            weeklyAnnualLeavesArray.forEach(annualLeave => {
                const findAnnualLeaveByEmployeeId = annualLeave.dataset.employee_id;
                if (employeeId === +findAnnualLeaveByEmployeeId) annualLeave.remove();
            });
        } else {
            alarm("임시적으로 삭제할 수 없는 직원입니다.")
        }
    };
    warning({ warningString: "정말 삭제하시겠습니까?", executeEvent });
};