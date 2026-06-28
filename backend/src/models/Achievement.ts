import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
    student: mongoose.Types.ObjectId;

    game: string;
    competition: string;

    venue?: string;
    date?: Date;
    results?: string;
    certificate?: string;

    isDeleted: boolean;
}

const achievementSchema = new Schema<IAchievement>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        game: {
            type: String,
            required: true,
            trim: true,
        },

        competition: {
            type: String,
            required: true,
            trim: true,
        },

        venue: {
            type: String,
            default: "",
            trim: true,
        },

        date: {
            type: Date,
            default: null,
        },

        results: {
            type: String,
            default: "",
            trim: true,
        },

        certificate: {
            type: String,
            default: "",
            trim: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

achievementSchema.index(
    {
        student: 1,
        game: 1,
        competition: 1,
        date: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            isDeleted: false,
        },
    }
);

export default mongoose.model<IAchievement>(
    "Achievement",
    achievementSchema
);