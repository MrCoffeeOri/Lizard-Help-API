import { NextFunction, Request, Response } from "express";
import Token from "../models/token.model";
import Company from "../models/company.model";
import User from "../models/user.model";

export default async function Login(req: Request, res: Response, next: NextFunction) {
    let doc = null
    if (req.session.user) {
        doc = await User.findOne({ email: req.session.user.email })
        if (!doc || doc.name !== req.session.user.name || doc.password !== req.session.user.password) return res.status(401).json({ error: "Credenciais inválidas" })
        if (doc.type === "owner") {
            
        }
    } else {
        doc = await User.findOne({ email: req.body.email, password: req.body.password })
    }
    if (!doc) return res.status(404).json({ error: "Data not found" })
    res.locals.loginDoc = doc
    next()
}