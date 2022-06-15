import { timworxUrl } from '../../shared/requestUrl.js';
import { warning } from '../../shared/alert.js';
import { colorChangeByLeftAnnualLeave, initializeCreateAnnualLeaveForm, carculateAnnualLeave, removeAnnualLeaveInHistory, removeWeeklyAnnualLeave } from './utils.js';

export const deleteAnnualLeave = ({ annualLeaveId, employeeId, howLong }) => {
    const executeEvent = async () => {
        const data = await fetch(`${timworxUrl}/annual-leave/${annualLeaveId}/delete`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                employeeId,
                howLong
            })
        });

        if (data.status === 200) {
            carculateAnnualLeave({
                kindOfCarculate: "delete",
                targetId: annualLeaveId
            });
            removeAnnualLeaveInHistory(annualLeaveId);
            removeWeeklyAnnualLeave(annualLeaveId);
            colorChangeByLeftAnnualLeave();
            initializeCreateAnnualLeaveForm();
        }
    }
    warning({ warningString: "정말 삭제하시겠습니까?", executeEvent });
}