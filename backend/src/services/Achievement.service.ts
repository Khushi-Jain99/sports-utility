
import Achievement from "../models/Achievement";
import ApiError from "../utils/ApiError";
import Student from "../models/Student";

export const createAchievement = async (data: any) => {

    const student = await Student.findOne({
        _id: data.student,
        isDeleted: false,
    });

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return await Achievement.create(data);

};

export const getAllAchievements = async (
    page = 1,
    limit = 10,
    search = "",
    game = "",
    competition = "",
    result = ""
) => {

    const skip = (page - 1) * limit;

    const query: any = {
        isDeleted: false,
    };

    // Search by Game or Competition
    if (search) {
        query.$or = [
            {
                game: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                competition: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    // Individual Filters
    if (game) {
        query.game = game;
    }

    if (competition) {
        query.competition = {
            $regex: competition,
            $options: "i",
        };
    }

    if (result) {
        query.results = {
            $regex: result,
            $options: "i",
        };
    }

    const achievements = await Achievement.find(query)
    .populate(
        "student",
        "name admissionNo class photo dob phone"
    )
        .sort({
            date: -1,
        })
        .skip(skip)
        .limit(limit);

    const total = await Achievement.countDocuments(query);

    return {
        achievements,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
    };
};

export const getAchievementById = async (id: string) => {
    const achievement = await Achievement.findOne({
        _id: id,
        isDeleted: false,
    }).populate("student");

    if (!achievement) {
        throw new ApiError(404, "Achievement not found");
    }

    return achievement;
};

export const updateAchievement = async (id: string, data: any) => {
    const achievement = await Achievement.findOneAndUpdate(
        { _id: id, isDeleted: false },
        data,
        { new: true, runValidators: true }
    );

    if (!achievement) {
        throw new ApiError(404, "Achievement not found");
    }

    return achievement;
};

export const deleteAchievement = async (id: string) => {
    const achievement = await Achievement.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
    );

    if (!achievement) {
        throw new ApiError(404, "Achievement not found");
    }

    return achievement;
};

export const uploadCertificate = async (
    id: string,
    certificateUrl: string
) => {

    const achievement = await Achievement.findOneAndUpdate(
        {
            _id: id,
            isDeleted: false,
        },
        {
            certificate: certificateUrl,
        },
        {
            new: true,
        }
    );

    if (!achievement) {
        throw new ApiError(404, "Achievement not found");
    }

    return achievement;
};

