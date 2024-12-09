import { Schema, model, Types } from "mongoose";

export default model("Chats", new Schema({
    messages: {
        type: [{
            _id: String,
            content: String,
            by: Types.ObjectId,
            createdAt: {
                type: Date,
                default: Date.now,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        required: true
    },
    technician: {
        type: {
            _id: Types.ObjectId,
            name: String
        },
        required: true
    },
    client: {
        type: {
            _id: Types.ObjectId,
            name: String
        },
        required: true
    },
    ticket: {
        type: Types.ObjectId,
        require: true
    }
}, { timestamps: true }))