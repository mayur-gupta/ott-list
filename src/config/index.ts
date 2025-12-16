import dotenv from 'dotenv';

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),

    mongodb: {
        uri: process.env.NODE_ENV === 'test'
            ? process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ott-mylist-test'
            : process.env.MONGODB_URI || 'mongodb://localhost:27017/ott-mylist',
    },

    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
    },

    api: {
        version: process.env.API_VERSION || 'v1',
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
            maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        },
    },

    pagination: {
        defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
        maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
    },

    cache: {
        enabled: process.env.CACHE_ENABLED === 'true',
        ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10),
    },
};
