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
        type: {
            name: String,
            _id: Types.ObjectId
        },
        required: true
    },
    solved: {
        type: {
            by: Types.ObjectId,
            justification: String,
            denied: Boolean,
            date: {
                type: Date,
                default: Date.now
            }
        },
        default: null
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'ongoing', 'waiting'],
        default: 'waiting'
    },
    service: {
        type: {
            by: {
                name: String,
                _id: Types.ObjectId
            },
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
        default: 'low'
    },
    company: {
        type: Types.ObjectId,
        required: true
    }
}, { timestamps: true }))