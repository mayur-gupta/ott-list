import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser } from '../types';

export interface UserDocument extends Omit<IUser, 'id'>, Document { }

const userSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        preferences: {
            favoriteGenres: {
                type: [String],
                enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'],
                default: [],
            },
            dislikedGenres: {
                type: [String],
                enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'],
                default: [],
            },
        },
        watchHistory: [
            {
                contentId: {
                    type: String,
                    required: true,
                },
                watchedOn: {
                    type: Date,
                    required: true,
                    default: Date.now,
                },
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                ret.id = ret._id.toString();
                delete (ret as any)._id;
                delete (ret as any).__v;
                return ret;
            },
        },
    }
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
