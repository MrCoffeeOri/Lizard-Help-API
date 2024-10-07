import { Schema, model } from "mongoose";
import { IUser } from "../types";

export default model<IUser>("Users", new Schema<IUser>({
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
        enum: ['owner', 'worker', 'admin', 'technician'],
        required: true
    },
    avaible: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }))