import ExcelJS from "exceljs";

export interface ExtractedImage {
    row: number;
    col: number;
    buffer: Buffer;
    extension: string;
}

export const extractImages = async (
    filePath: string
): Promise<Map<string, ExtractedImage>> => {

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(filePath);

    const imageMap = new Map<string, ExtractedImage>();

    workbook.eachSheet((worksheet) => {

        const images = worksheet.getImages();

        console.log("Found Images:", images.length);

        for (const image of images) {

            console.log(image);

            const img = workbook.getImage(image.imageId);

            if (!img) continue;

            const row = image.range.tl.nativeRow + 1;
            const col = image.range.tl.nativeCol + 1;

            console.log(
                `Image -> Row ${row} Column ${col}`
            );

            imageMap.set(`${row}-${col}`, {
                row,
                col,
                buffer: img.buffer,
                extension: img.extension,
            });
        }

    });

    return imageMap;
};