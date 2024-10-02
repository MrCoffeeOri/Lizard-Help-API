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
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['worker', 'admin', 'technician'],
        required: true
    },
    avaible: {
        type: String,
        default: true
    }
}, { timestamps: true }))