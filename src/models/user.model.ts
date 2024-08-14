import { Schema, model } from "mongoose";

export default model("Users", new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['worker', 'admin'],
        required: true
    }
}, { timestamps: true }))