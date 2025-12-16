import mongoose, { Schema, Document } from 'mongoose';
import { MyListItem as IMyListItem } from '../types';

export interface MyListDocument extends Omit<IMyListItem, 'id'>, Document { }

const myListSchema = new Schema<MyListDocument>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
            ref: 'User',
        },
        contentId: {
            type: String,
            required: true,
            index: true,
        },
        contentType: {
            type: String,
            required: true,
            enum: ['movie', 'tvshow'],
        },
        addedAt: {
            type: Date,
            required: true,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: false,
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

myListSchema.index({ userId: 1, contentId: 1 }, { unique: true });
myListSchema.index({ userId: 1, addedAt: -1 });

export const MyListModel = mongoose.model<MyListDocument>('MyList', myListSchema);
