import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const imageFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const allowed = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

const certificateFilter: multer.Options["fileFilter"] = (
    req,
    file,
    cb
) => {

    const allowed = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and Image files are allowed"));
    }

};

// --------------------
// Student Photos
// --------------------

const photoStorage = new CloudinaryStorage({
    cloudinary,

    params: async () => ({

        folder: "sports-utility/photos",

        allowed_formats: ["jpg", "jpeg", "png", "webp"],

        resource_type: "image",

    }),

});

// --------------------
// Certificates
// --------------------

const certificateStorage = new CloudinaryStorage({
    cloudinary,

    params: async (_req, file) => ({

        folder: "sports-utility/certificates",

        resource_type:
            file.mimetype === "application/pdf"
                ? "raw"
                : "image",

    }),

});

// --------------------
// Upload Middlewares
// --------------------

export const uploadPhoto = multer({

    storage: photoStorage,

    fileFilter: imageFilter,

    limits: {
        fileSize: 2 * 1024 * 1024,
    },

});

export const uploadCertificate = multer({

    storage: certificateStorage,

    fileFilter: certificateFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

});

// --------------------
// Excel Upload
// (Keep disk storage for now)
// --------------------

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

    storage: multer.memoryStorage(),

    fileFilter: excelFilter,

    limits: {
        fileSize: 10 * 1024 * 1024,
    },

});