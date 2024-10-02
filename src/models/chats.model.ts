import { Schema, model, Types } from "mongoose";

export default model("Chats", new Schema({
    messages: {
        type: [{
            content: String,
            by: Types.ObjectId,
            createdAt: {
                type: Date,
                default: Date.now,
                immutable: true
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        required: true
    },
    technician: {
        type: Types.ObjectId,
        required: true
    },
    client: {
        type: Types.ObjectId,
        required: true
    }
}, { timestamps: true }))