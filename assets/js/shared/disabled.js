export const makeDisabledState = (status) => {
    const allEmployeesSection = document.getElementById("all_employees_section");
    const historyAnnualLeaveSection = document.getElementById("history_annual_leave_section");
    const searchBox = document.getElementById("search_employee_box");
    const createAnnualLeaveForm = document.getElementById("create_annual_leave_form");
    const weeklyAnnualLeaveBar = document.getElementById("weekly_annual_leave_bar");

    if (status) {
        allEmployeesSection.classList.add("disabled");
        historyAnnualLeaveSection.classList.add("disabled");
        if (searchBox) searchBox.classList.add("disabled");
        createAnnualLeaveForm.classList.add("disabled");
        weeklyAnnualLeaveBar.classList.add("disabled");
    } else {
        allEmployeesSection.classList.remove("disabled");
        historyAnnualLeaveSection.classList.remove("disabled");
        if (searchBox) searchBox.classList.remove("disabled");
        createAnnualLeaveForm.classList.remove("disabled");
        weeklyAnnualLeaveBar.classList.remove("disabled");
    }
}