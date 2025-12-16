import { createClient, RedisClientType } from 'redis';
import { config } from '../config';
import logger from '../utils/logger';

class CacheService {
    private client: RedisClientType | null = null;
    private isConnected = false;

    async connect(): Promise<void> {
        if (this.isConnected) {
            return;
        }

        try {
            this.client = createClient({
                socket: {
                    host: config.redis.host,
                    port: config.redis.port,
                },
                password: config.redis.password,
            });

            this.client.on('error', (error) => {
                logger.error('Redis Client Error:', error);
            });

            this.client.on('connect', () => {
                logger.info('Redis client connected');
            });

            this.client.on('ready', () => {
                logger.info('Redis client ready');
                this.isConnected = true;
            });

            this.client.on('end', () => {
                logger.warn('Redis client disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
        } catch (error) {
            logger.error('Failed to connect to Redis:', error);
            this.client = null;
        }
    }

    async disconnect(): Promise<void> {
        if (this.client && this.isConnected) {
            await this.client.quit();
            this.client = null;
            this.isConnected = false;
            logger.info('Redis connection closed');
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.client || !this.isConnected || !config.cache.enabled) {
            return null;
        }

        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error(`Cache get error for key ${key}:`, error);
            return null;
        }
    }

    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        if (!this.client || !this.isConnected || !config.cache.enabled) {
            return;
        }

        try {
            const ttl = ttlSeconds || config.cache.ttlSeconds;
            await this.client.setEx(key, ttl, JSON.stringify(value));
        } catch (error) {
            logger.error(`Cache set error for key ${key}:`, error);
        }
    }

    async del(key: string): Promise<void> {
        if (!this.client || !this.isConnected || !config.cache.enabled) {
            return;
        }

        try {
            await this.client.del(key);
        } catch (error) {
            logger.error(`Cache delete error for key ${key}:`, error);
        }
    }

    async delPattern(pattern: string): Promise<void> {
        if (!this.client || !this.isConnected || !config.cache.enabled) {
            return;
        }

        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
            }
        } catch (error) {
            logger.error(`Cache delete pattern error for ${pattern}:`, error);
        }
    }

    isReady(): boolean {
        return this.isConnected && this.client !== null;
    }
}

export const cacheService = new CacheService();
