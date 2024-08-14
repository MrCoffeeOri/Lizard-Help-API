import { Router, Request, Response } from "express"
import Company from "../models/company.model"

export default Router()
    .get("/", (req: Request, res: Response) => {
        res.send("faz o B")
    })
    .post("/create", (req: Request, res: Response) => {
        Company.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            cid: req.body.cid
        }).then(doc => {
            res.status(200).json(doc.toObject())
        })
    })
    .get("/login", (req: Request, res: Response) => {
        Company.findOne({  })
    })