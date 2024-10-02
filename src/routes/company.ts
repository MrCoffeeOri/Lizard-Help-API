import { Router, Request, Response } from "express"
import { ICompany } from "../types";
import Company from "../models/company.model"
import Token from "../models/token.model"
import Login from "../middlewares/login";

export default Router()
    .get("/", Login, async (req: Request, res: Response) => {
        res.status(200).json((await Company.findOne({ name: "Carlinhos LTDA" }))?.toObject())
    })
    .post("/create", async (req: Request, res: Response) => {
        const company = (await Company.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            cid: req.body.cid
        })).toObject()
        res.status(201).json(company)
    })
    .post("/login", async (req: Request, res: Response) => {
        if (req.signedCookies.authToken) {
            const company = await Token.aggregate([
                {
                    $match: { value: req.signedCookies.authToken }
                },
                {
                    $lookup: {
                        from: "Companies",
                        as: "company",
                        localField: "uid",
                        foreignField: "_id",
                    }
                },
                {
                    $unwind: "$company"
                },
                {
                    $replaceRoot: { newRoot: "$company" } 
                },
                {
                    $unset: "password"
                }
            ]) as unknown as ICompany // Faz o Overlaping com unknow para transformar a tipagem para ICompany (Gambiarra das brabas)
            if (!company) return res.status(404).json({ error: "Empresa não encontrada" })
            return res.status(200).json(company)
        }
        const company = await Company.findOne({ email: req.body.email, password: req.body.password })
        if (!company) return res.status(404).json({ error: "Empresa não encontrada" })
        const authToken = crypto.randomUUID()
        res.status(200).cookie("authToken", authToken, { signed: true, maxAge: 60000 }).json({ ...company?.toObject(), authToken })
    })