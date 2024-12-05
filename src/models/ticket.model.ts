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
    }
}, { timestamps: true }))