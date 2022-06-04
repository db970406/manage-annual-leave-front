import { weeklyAnnualLeaveComponent, getWeeklyAnnualLeaveData } from '../../components/annual-leave/read.js';
import { allEmployeesBarComponent, getEmployeesData } from '../../components/employee/read.js';
import { employeeScreenComponent } from '../../layout/employeeScreen.js';
import { trafficLightButtonsComponent } from './trafficRightButtons.js';
import { makeElementTag } from '../../shared/makeHtmlTag.js';
import { controllMessage } from '../../shared/webSocket.js';
import { darkModeComponent } from '../../shared/darkMode.js';

class GlassDashboard extends HTMLElement {
    async connectedCallback() {
        const dashboardHeader = makeElementTag({
            id: "controll_header",
            element: "header",
        });

        const trafficLightButtons = trafficLightButtonsComponent();
        const controllMessageButton = controllMessage();
        const darkModeControllerButton = darkModeComponent();
        dashboardHeader.append(trafficLightButtons, darkModeControllerButton, controllMessageButton);

        const dashboardMain = makeElementTag({
            id: "dashboard_main",
            element: "section"
        });
        const pannelEmployee = makeElementTag({
            id: "pannel_employee",
            element: "main",
            className: "glass"
        });
        const pannelWeeklyAnnualLeave = makeElementTag({
            id: "pannel_weekly_annual_leave",
            element: "aside",
            className: "glass"
        });

        const allEmployeesBar = await allEmployeesBarComponent();
        const employeeScreen = employeeScreenComponent();
        const weeklyAnnualLeaveBar = await weeklyAnnualLeaveComponent();

        dashboardMain.append(allEmployeesBar, employeeScreen);
        pannelEmployee.append(dashboardHeader, dashboardMain);
        pannelWeeklyAnnualLeave.appendChild(weeklyAnnualLeaveBar);

        this.append(pannelEmployee, pannelWeeklyAnnualLeave);

        // 최초 데이터 요청부(컴포넌트 HTML뼈대 조립이 끝난 후에 데이터를 페칭하는 것이 로직 상 안꼬여서 이렇게 함)
        getWeeklyAnnualLeaveData();
        getEmployeesData();
    }
};

customElements.define("glass-dashboard", GlassDashboard);