import { StudentExcelRow } from "./excelTypes";

export interface ValidationError {

    row: number;
    reason: string;

}

export const validateRow = (

    row: StudentExcelRow,

    rowNumber: number

): ValidationError | null => {

    if (!row.admissionNo?.trim()) {

        return {

            row: rowNumber,

            reason: "Admission Number missing"

        };

    }

    if (!row.name?.trim()) {

        return {

            row: rowNumber,

            reason: "Student Name missing"

        };

    }

    if (!row.class?.trim()) {

        return {

            row: rowNumber,

            reason: "Class missing"

        };

    }

    return null;

};