import { NextFunction, Request, Response } from "express";
import Token from "../models/token.model";
import Company from "../models/company.model";
import User from "../models/user.model";
import Technician from "../models/technician.model";

export default async function Login(req: Request, res: Response, next: NextFunction) {
    const urlType = req.baseUrl.replace('/', '')
    let doc = null
    if (req.signedCookies.authToken) {
        doc = await Token.aggregate([
            {
                $match: { value: req.signedCookies.authToken }
            },
            {
                $lookup: {
                    from: urlType == "company" ? "Companies" : "Users",
                    as: urlType,
                    localField: "uid",
                    foreignField: "_id",
                }
            },
            {
                $unwind: `\$${urlType}`
            },
            {
                $replaceRoot: { newRoot: `\$${urlType}` } 
            },
            {
                $unset: "password"
            }
        ])
    } else {
        const modelToOperate = urlType == "company" ? Company : User
        doc = await Company.findOne({ email: req.body.email, password: req.body.password })
        res.cookie("auth", )
    }
    if (!doc) return res.status(404).json({ error: "Data not found" })
    res.locals.loginDoc = doc
    next()
}