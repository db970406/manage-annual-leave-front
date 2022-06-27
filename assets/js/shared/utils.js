
export const clearDemical = (number) => {
    const isInteger = Number.isInteger(+number);
    return isInteger ? Math.floor(+number) : number;
}

export const checkHalfLeave = (annualLeave) => +annualLeave === 0.5 || annualLeave === "반" ? "반차" : `${annualLeave}일`;

export const trimmedNumberFormat = (number) => {
    const isInteger = Number.isInteger(+number);
    return isInteger ? parseInt(+number) : parseFloat(+number);
};