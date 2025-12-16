import mongoose, { Schema, Document } from 'mongoose';
import { Movie as IMovie } from '../types';

export interface MovieDocument extends Omit<IMovie, 'id'>, Document { }

const movieSchema = new Schema<MovieDocument>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        genres: {
            type: [String],
            enum: ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'],
            required: true,
        },
        releaseDate: {
            type: Date,
            required: true,
        },
        director: {
            type: String,
            required: true,
        },
        actors: {
            type: [String],
            required: true,
        },
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

movieSchema.index({ genres: 1 });
movieSchema.index({ releaseDate: -1 });

export const MovieModel = mongoose.model<MovieDocument>('Movie', movieSchema);
