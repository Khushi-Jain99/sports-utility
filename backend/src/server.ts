import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";

import { createDefaultAdmin } from "./utils/createDefaultAdmin";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {

        await connectDB();

        await createDefaultAdmin();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error(error);

        process.exit(1);

    }
};

startServer();