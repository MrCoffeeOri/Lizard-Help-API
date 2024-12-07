import { Schema, Types, model } from "mongoose";

export default model("Tickets", new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    by: {
        type: String,
        required: true
    },
    solved: {
        type: {
            by: Types.ObjectId,
            justification: String,
            date: {
                type: Date,
                default: Date.now
            }
        },
        default: null
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'ongoing'],
        default: false
    },
    service: {
        type: {
            by: Types.ObjectId,
            date: {
                type: Date,
                default: Date.now
            }
        },
        default: null
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: false
    }
}, { timestamps: true }))