import XLSX from "xlsx";
import { COLUMN_MAPPING } from "./columnMapper";

export const findHeaderRow = (worksheet: XLSX.WorkSheet): number => {

    const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
        defval: "",
    });

    const required = Object.entries(COLUMN_MAPPING)
        .filter(([_, config]) => config.required);

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i].map(cell =>
            String(cell)
                .replace(/\r/g, "")
                .replace(/\n/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .toLowerCase()
        );

        let matched = 0;

        for (const [, config] of required) {

            const found = config.aliases.some(alias =>

                row.includes(

                    alias
                        .replace(/\r/g, "")
                        .replace(/\n/g, " ")
                        .replace(/\s+/g, " ")
                        .trim()
                        .toLowerCase()

                )

            );

            if (found)
                matched++;

        }

        if (matched === required.length)
            return i;

    }

    throw new Error("Header row not found");

};