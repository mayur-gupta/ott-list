import mongoose, { Schema, Document } from 'mongoose';
import { TVShow as ITVShow } from '../types';

export interface TVShowDocument extends Omit<ITVShow, 'id'>, Document { }

const tvShowSchema = new Schema<TVShowDocument>(
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
        episodes: [
            {
                episodeNumber: {
                    type: Number,
                    required: true,
                },
                seasonNumber: {
                    type: Number,
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

tvShowSchema.index({ genres: 1 });

export const TVShowModel = mongoose.model<TVShowDocument>('TVShow', tvShowSchema);
