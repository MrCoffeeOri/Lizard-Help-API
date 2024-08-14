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
    messages: {
        type: [{
            by:  String,
            text: String,
            date: {
                type: Date,
                default: Date.now
            },
            views: [Types.ObjectId]
        }],
        default: []
    }
}, { timestamps: true }))