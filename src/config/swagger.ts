import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'OTT My List API',
            version: config.api.version || '1.0.0',
            description: 'API documentation for the My List feature of the OTT platform',
            contact: {
                name: 'API Support',
                url: 'http://localhost:3000',
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port || 3000}/api/${config.api.version || 'v1'}`,
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                userIdAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-user-id',
                    description: 'User ID header required for authentication',
                },
            },
            schemas: {
                MyListItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '657e2...' },
                        userId: { type: 'string', example: 'user123' },
                        contentId: { type: 'string', example: 'movie456' },
                        contentType: { type: 'string', enum: ['movie', 'tvshow'] },
                        addedAt: { type: 'string', format: 'date-time' },
                        content: {
                            type: 'object',
                            description: 'Enriched content details (Movie or TVShow)',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error message' },
                        errors: { type: 'array', items: { type: 'object' } },
                    },
                },
            },
        },
        security: [
            {
                userIdAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './dist/routes/*.js'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
