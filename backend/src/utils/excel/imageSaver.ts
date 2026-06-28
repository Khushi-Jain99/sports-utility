import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface SaveImageOptions {
    folder: "photos" | "certificates";
    fileName: string;
    extension: string;
    buffer: Buffer;
}

export const saveImage = async ({
    folder,
    fileName,
    extension,
    buffer,
}: SaveImageOptions): Promise<string> => {

    const uploadDir = path.join(
        process.cwd(),
        "uploads",
        folder
    );

    await fs.mkdir(uploadDir, {
        recursive: true,
    });

    const uniqueName =
        `${fileName}-${crypto.randomUUID()}.${extension}`;

    const fullPath = path.join(
        uploadDir,
        uniqueName
    );

    await fs.writeFile(fullPath, buffer);

    return `/uploads/${folder}/${uniqueName}`;
};