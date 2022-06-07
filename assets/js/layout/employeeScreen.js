import { createAnnualLeaveComponent } from '../components/annual-leave/create.js';
import { historyAnnualLeaveComponent } from '../components/annual-leave/read.js';
import { employeeDetailComponent } from '../components/employee/read.js';
import { makeElementTag } from '../shared/makeHtmlTag.js';

export const employeeScreenComponent = () => {
    const employeeScreen = makeElementTag({
        id: "employee_screen",
        element: "section"
    });

    const top = makeElementTag({
        id: "employee_top_screen",
        element: "section"
    });
    const bottom = makeElementTag({
        id: "employee_bottom_screen",
        element: "section"
    });

    const { historyAnnualLeaveHeader, historyAnnualLeaveSection } = historyAnnualLeaveComponent();
    const employeeDetailScreen = employeeDetailComponent();
    const createAnnualLeaveScreen = createAnnualLeaveComponent();
    top.append(employeeDetailScreen, createAnnualLeaveScreen);
    bottom.append(historyAnnualLeaveHeader, historyAnnualLeaveSection);
    employeeScreen.append(top, bottom);

    return employeeScreen;
}