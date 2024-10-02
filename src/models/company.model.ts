import { Schema, model, Types } from "mongoose";
import { ICompany } from "../types";

export default model<ICompany>("Companies", new Schema<ICompany>({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String, 
        required: true
    },
    cid: {
        type: String, 
        required: true
    },
    people: {
        type: [Types.ObjectId],
        default: []
    }
}, { timestamps: true }))