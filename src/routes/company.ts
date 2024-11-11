import { Router, Request, Response } from "express"
import { ICompany } from "../types";
import Company from "../models/company.model"
import Token from "../models/token.model"
import Login from "../middlewares/login";
import User from "../models/user.model";

export default Router()
    .get("/", Login, async (req: Request, res: Response) => {
        
    })
    .post("/create", async (req: Request, res: Response) => {
        const { name, email, phone, cid, owner } = req.body;
        if (!name || !email || !phone || !cid || !owner)
            return res.status(400).json({ error: "Dados incompletos" });
        try {
            const company = (await Company.create({ name, email, phone, cid, owner })).toObject();
            res.status(201).json({ msg: "Empresa criado com sucesso", company });
        } catch (error) {
            res.status(500).json({ error: `Falha ma criação da empresa: ${error}` })
        }
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
    .post("/people", async (req: Request, res: Response) => {
        const type = req.session.user.type === "owner" ? req.body.type : "worker"
        try {
          const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password || crypto.randomUUID(),
            type
          })
          await Company.findOneAndUpdate(
            {
              _id: req.body.companyID,
              $or: [
                { owner: req.session.user._id },
                { people: { $in: [req.session.user._id] } }
              ]
            },
            {
              $push: { people: newUser._id }
            }
          )
          res.status(201).json({ msg: `Novo ${type == "admin" ? "administrador" : "funcionário"} adicionado` })
        } catch (error) {
          res.status(500).json({ error: "Erro interno ao criar usuário" })
        }
      });