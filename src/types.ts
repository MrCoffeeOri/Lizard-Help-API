import { Types } from "mongoose";

export interface ICompany {
    name: string,
    email: string,
    password: string,
    phone: string,
    cid: string,
    people: [Types.ObjectId]
}