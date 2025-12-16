import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const addToMyListSchema = Joi.object({
    contentId: Joi.string().required().messages({
        'string.empty': 'Content ID is required',
        'any.required': 'Content ID is required',
    }),
    contentType: Joi.string().valid('movie', 'tvshow').required().messages({
        'any.only': 'Content type must be either "movie" or "tvshow"',
        'any.required': 'Content type is required',
    }),
});

export const removeFromMyListSchema = Joi.object({
    contentId: Joi.string().required().messages({
        'string.empty': 'Content ID is required',
        'any.required': 'Content ID is required',
    }),
});

export const listMyItemsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Page must be a number',
        'number.min': 'Page must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).default(20).messages({
        'number.base': 'Limit must be a number',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100',
    }),
});

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const dataToValidate = req.method === 'GET' ? req.query : req.body;

        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors,
            });
        }

        // Replace request data with validated and sanitized data
        if (req.method === 'GET') {
            req.query = value;
        } else {
            req.body = value;
        }

        next();
    };
};
