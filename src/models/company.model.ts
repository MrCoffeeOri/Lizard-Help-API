import { Schema, model } from "mongoose";
import { ICompany } from "../types";

export default model<ICompany>("Companies", new Schema<ICompany>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        require: true,
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
        type: [String],
        default: []
    }
}, { timestamps: true }))