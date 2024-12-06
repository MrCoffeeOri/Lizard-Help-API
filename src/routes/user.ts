import { Router, Request, Response } from "express"
import Company from "../models/company.model";
import User from "../models/user.model";
import { IUser } from "../types";
import Ticket from "../models/ticket.model";

export default Router()
    .get("/", (req: Request, res: Response) => {
        res.status(200).json({ user: req.session.user, id: req.session.id })
    })
    .post("/create", async (req: Request, res: Response) => {
        if (!req.body.email || !req.body.password || !req.body.name || !req.body.type) 
            return res.status(400).json({ error: "Dados incompletos" })
        if (await User.findOne({ email: req.body.email }))
            return res.status(400).json({ error: "Email já utilizado" })
        const newUser = (await User.create({ email: req.body.email, password: req.body.password, name: req.body.name, type: req.body.type, avaible: true })).toObject()
        req.session.user = newUser as IUser
        res.status(201).json({ msg: "Usuário criado com sucesso", user: { ...newUser, password: undefined } }) 
    })
    .post("/auth", async (req: Request, res: Response) => {
        const user = (await User.findOne({ email: req.session.user?.email || req.body.email }))?.toObject()
        if (!user || (user.password !== (req.session.user?.password || req.body.password))) 
            return res.status(401).json({ error: "Credenciais inválidas" })
        if (!req.session.user)
            req.session.user = user as IUser
        res.status(200).json({ 
            msg: "Usuário logado com sucesso", 
            user: 
                user.type === "owner" ? 
                { ...user, company: (await Company.findOne({ owner: user._id }))?.toObject() } 
                : 
                { ...user, tickets: (await Ticket.find(user.type === "technician" ? { $or: [{ status: "ongoing", "service.by": req.session.user._id }, { status: "open" }]  } : { by: req.session.user.name })) } 
        })
    })