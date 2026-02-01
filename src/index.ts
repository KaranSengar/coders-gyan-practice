import { app } from "./app";
import { logger } from "./config/logger";
import  AppDataSource  from "./data.source";

const server = async () => {
    try {
        await AppDataSource.initialize();
        logger.info("Database is initialized");

        const PORT = Number(process.env.PORT) || 5000;
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        logger.error("Failed to initialize database", err);
        process.exit(1);
    }
};
void server();
