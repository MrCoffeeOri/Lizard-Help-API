import { Router, Request, Response } from "express"
import Company from "../models/company.model";
import User from "../models/user.model";
import { ISessionUser, IUser } from "../types";

export default Router()
    .get("/", (req: Request, res: Response) => {
        res.send(req.session.user)
    })
    .post("/create", async (req: Request, res: Response) => {
        if (!req.body.email || !req.body.password || !req.body.name || !req.body.type) 
            return res.status(400).json({ error: "Dados incompletos" })
        if (await User.findOne({ email: req.body.email }))
            return res.status(400).json({ error: "Email já utilizado" })
        const newUser = (await User.create({ email: req.body.email, password: req.body.password, name: req.body.name, type: req.body.type, avaible: true })).toObject()
        req.session.user = newUser as ISessionUser
        res.status(201).json({ 
            msg: "Usuário criado com sucesso", 
            user: { 
                ...newUser, 
                password: undefined, 
            } 
        })
    })
    .post("/auth", async (req: Request, res: Response) => {
        const user = (await User.findOne({ email: req.session.user ? req.session.user.email : req.body.email }))?.toObject()
        if (!user || user.password !== (req.session.user?.password || req.body.password)) return res.status(401).json({ error: "Credenciais inválidas" })
        res.status(200).json(user.type === "owner" ? user : { ...user, ...(await Company.findOne({ owner: user._id }))?.toObject() })
    })