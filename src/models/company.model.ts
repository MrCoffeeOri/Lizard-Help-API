import { Schema, model, Types } from "mongoose";

export default model("Companies", new Schema({
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