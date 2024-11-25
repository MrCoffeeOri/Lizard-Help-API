import { Router, Request, Response } from "express"
import Company from "../models/company.model"
import User from "../models/user.model";
import authRequired from "../middlewares/authRequired";

export default Router()
    .post("/create", authRequired, async (req: Request, res: Response) => {
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
    .post("/people", authRequired, async (req: Request, res: Response) => {
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