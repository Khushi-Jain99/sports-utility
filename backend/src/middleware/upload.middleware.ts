
import multer from "multer";
import path from "path";
import fs from "fs";

// Create folder if it doesn't exist
const createFolder = (folderPath: string) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Photo storage
const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = "uploads/photos";
        createFolder(folder);
        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

// Certificate storage
const certificateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = "uploads/certificates";
        createFolder(folder);
        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

const imageFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

export const uploadPhoto = multer({
    storage: photoStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB
    },
});

const certificateFilter: multer.Options["fileFilter"] = (req, file, cb) => {

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and Image files are allowed"));
    }

};

export const uploadCertificate = multer({

    storage: certificateStorage,

    fileFilter: certificateFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

});

const excelStorage = multer.diskStorage({

    destination(req, file, cb) {

        const folder = "uploads/excel";

        createFolder(folder);

        cb(null, folder);

    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);

    },

});

const excelFilter: multer.Options["fileFilter"] = (
    req,
    file,
    cb
) => {

    const allowedTypes = [

        "application/vnd.ms-excel",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(new Error("Only Excel files are allowed"));

    }

};

export const uploadExcel = multer({

    storage: excelStorage,

    fileFilter: excelFilter,

    limits: {

        fileSize: 10 * 1024 * 1024,

    },

});