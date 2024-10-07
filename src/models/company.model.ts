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
        type: Schema.Types.ObjectId,
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
        type: [Schema.Types.ObjectId],
        default: []
    }
}, { timestamps: true }))