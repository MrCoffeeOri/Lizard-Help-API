import { Schema, Types, model } from "mongoose";

export default model("Tokens", new Schema({
    uid: {
        type: Types.ObjectId,
        required: true
    },
    value: {
        type: String,
        required: true
    },
}))