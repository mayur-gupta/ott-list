import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from './config/index';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

export const createApp = (): Application => {
    const app = express();

    // Security middleware
    app.use(helmet());
    app.use(cors());

    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Compression
    app.use(compression());

    // Logging
    if (config.env !== 'test') {
        app.use(morgan('combined', {
            stream: {
                write: (message) => logger.info(message.trim()),
            },
        }));
    }

    // API routes
    app.use(`/api/${config.api.version}`, routes);

    // Swagger Documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Root endpoint
    app.get('/', (_req, res) => {
        res.json({
            success: true,
            message: 'OTT My List API',
            version: config.api.version,
            endpoints: {
                health: `/api/${config.api.version}/health`,
                myList: {
                    add: `POST /api/${config.api.version}/mylist`,
                    remove: `DELETE /api/${config.api.version}/mylist/:contentId`,
                    list: `GET /api/${config.api.version}/mylist`,
                },
            },
        });
    });

    // Error handling
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};
