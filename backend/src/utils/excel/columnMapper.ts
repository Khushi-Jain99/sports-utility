export interface ColumnConfig {
    required: boolean;
    aliases: string[];
}

export const COLUMN_MAPPING: Record<string, ColumnConfig> = {

    admissionNo: {
        required: true,
        aliases: [
            "Adm. No.",
            "Adm No",
            "Admission No",
            "Admission Number",
            "Admission",
            "Adm.\nNo."
        ]
    },

    name: {
        required: true,
        aliases: [
            "Name",
            "Student Name",
            "Student"
        ]
    },

    class: {
        required: true,
        aliases: [
            "Class",
            "Course",
            "Programme",
            "Program"
        ]
    },

    dob: {
        required: false,
        aliases: [
            "DOB",
            "D.O.B",
            "Birth Date",
            "Date of Birth"
        ]
    },

    phone: {
        required: false,
        aliases: [
            "Phone",
            "Mobile",
            "Mobile Number",
            "Contact No.",
            "Contact Number"
        ]
    },

    photo: {
        required: false,
        aliases: [
            "Photo",
            "Image"
        ]
    },

    game: {
        required: false,
        aliases: [
            "Game",
            "Sport",
            "Sports"
        ]
    },

    competition: {
        required: false,
        aliases: [
            "Competition",
            "Tournament",
            "Championship",
            "Event",
            "Name of Competition",
            "Name of Comppetition",
            "Name of Compettition"
        ]
    },

    venue: {
        required: false,
        aliases: [
            "Venue",
            "Place",
            "Location"
        ]
    },

    date: {
        required: false,
        aliases: [
            "Date",
            "Event Date"
        ]
    },

    results: {
        required: false,
        aliases: [
            "Result",
            "Results"
        ]
    },

    certificate: {
        required: false,
        aliases: [
            "Certificate"
        ]
    }

};