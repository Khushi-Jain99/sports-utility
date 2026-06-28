export interface StudentExcelRow {
    // ==========================
    // STUDENT
    // ==========================
    admissionNo: string;
    name: string;
    class: string;

    dob?: Date;
    phone?: string;
    photo?: string;

    // ==========================
    // ACHIEVEMENT
    // ==========================
    game?: string;
    competition?: string;

    venue?: string;
    date?: Date;

    results?: string;
    certificate?: string;
}