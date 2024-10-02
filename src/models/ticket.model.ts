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