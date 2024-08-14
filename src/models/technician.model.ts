import { Schema, model } from "mongoose";

export default model("Technicians", new Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    avaible: {
        type: Boolean,
        required: true
    }
}, { timestamps: true }))