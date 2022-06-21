import { makeElementTag } from '../../shared/makeHtmlTag.js';
import { timworxUrl } from '../../shared/requestUrl.js';
import { initializeWeeklyAnnualLeave, setWeeklyAnnualLeaveObj } from './utils.js';


// 히스토리의 데이터는 개별 employee의 데이터를 가져오면서 삽입될 것이다.
export const historyAnnualLeaveComponent = () => {
    const historyAnnualLeaveHeader = makeElementTag({
        element: "header",
        id: "history_annual_leave_header"
    });
    const startDateCategory = makeElementTag({
        element: "div",
        id: "start_date_category",
        textContent: "시작일"
    });
    const finishDateCategory = makeElementTag({
        element: "div",
        id: "finish_date_category",
        textContent: "종료일"
    });
    const howLongCategory = makeElementTag({
        element: "div",
        id: "how_long_category",
        textContent: "사용일"
    });

    historyAnnualLeaveHeader.append(startDateCategory, finishDateCategory, howLongCategory);
    const historyAnnualLeaveSection = makeElementTag({
        element: "section",
        id: "history_annual_leave_section"
    });

    return {
        historyAnnualLeaveHeader,
        historyAnnualLeaveSection
    }
}

export const weeklyAnnualLeaveComponent = async () => {
    const weeklyAnnualLeaveBar = makeElementTag({
        id: "weekly_annual_leave_bar",
        element: "div"
    });

    const weeklyAnnualLeaveHeader = makeElementTag({
        id: "weekly_annual_leave_header",
        element: "header"
    });

    const weeklyAnnualLeaveHeaderName = makeElementTag({
        id: "weekly_annual_leave_header_name",
        element: "h2",
        textContent: "주간 연차리스트"
    });

    const weeklyAnnualLeaveSection = makeElementTag({
        id: "weekly_annual_leave_section",
        element: "section",
    });

    weeklyAnnualLeaveHeader.appendChild(weeklyAnnualLeaveHeaderName);
    weeklyAnnualLeaveBar.append(weeklyAnnualLeaveHeader, weeklyAnnualLeaveSection);
    return weeklyAnnualLeaveBar;
}

export const getWeeklyAnnualLeaveData = async () => {
    const data = await fetch(`${timworxUrl}/annual-leave/all`);
    if (data.status === 200) {
        // 주간 연차들을 가져와서 띄워준다.
        const { weeklyAnnualLeaveData } = await data.json();
        weeklyAnnualLeaveData.forEach(annualLeave =>
            setWeeklyAnnualLeaveObj({ ...annualLeave })
        );
        initializeWeeklyAnnualLeave();
    }
}