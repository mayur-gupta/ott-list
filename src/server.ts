import { createApp } from './app';
import { connectDatabase } from './db/connection';
import { cacheService } from './services/cache.service';
import { config } from './config';
import logger from './utils/logger';

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDatabase();

        // Connect to Redis (optional - app works without it)
        await cacheService.connect();

        // Create Express app
        const app = createApp();

        // Start server
        app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port} in ${config.env} mode`);
            logger.info(`API available at http://localhost:${config.port}/api/${config.api.version}`);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
