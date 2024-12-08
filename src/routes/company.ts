import { Router, Request, Response, NextFunction } from "express"
import Company from "../models/company.model"
import User from "../models/user.model";
import Ticket from "../models/ticket.model";
import Chat from "../models/chats.model";

export default Router()
    .post("/create", async (req: Request, res: Response) => {
        const { name, email, phone, cid, owner } = req.body;
        if (!name || !email || !phone || !cid || !owner)
            return res.status(400).json({ error: "Dados incompletos" });
        try {
            const company = (await Company.create({ name, email, phone, cid, owner })).toObject();
            res.status(201).json({ msg: "Empresa criado com sucesso", company: { ...company, tickets: [], availableTechnicians: await User.find({ type: "technician", avaible: true }, { password: 0 }) } });
        } catch (error) {
            res.status(500).json({ error: `Falha ma criação da empresa: ${error}` })
        }
    })
    .post("/people", async (req: Request, res: Response) => {
        try {
          const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
            avaible: false
          })
          await Company.findOneAndUpdate(
            {
              _id: req.body.companyID,
              owner: req.session.user._id
            },
            {
              $push: { people: newUser._id }
            }
          )
          res.status(201).json({ msg: `Novo ${req.body.type == "admin" ? "administrador" : "funcionário"} adicionado`, user: { ...newUser.toObject(), password: undefined } })
        } catch (error) {
          res.status(500).json({ error: error.toString() })
        }
      })
      .put("/people/:userId", async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { name, email, password, type } = req.body;
        try {
          const userCompany = await Company.findOne({
            $or: [
              { owner: req.session.user._id },
              { people: { $in: [req.session.user._id] } },
            ],
            people: { $in: [userId] },
          })
          if (!userCompany)
            return res.status(403).json({ error: "Permissão negada ou trabalhador não associado a esta empresa." });
          const updatedUser = await User.findByIdAndUpdate(userId, { name, email, password, type }, { new: true, runValidators: true })
          if (!updatedUser)
            return res.status(404).json({ error: "Usuário não encontrado." })
          await Ticket.findOneAndUpdate({ "by._id": userCompany._id }, { "by.name": userCompany.name })
          await Chat.findOneAndUpdate({ "client._id": userCompany._id }, { "client.name": userCompany.name })
          res.status(200).json({
            msg: "Informações do funcionário atualizadas com sucesso!",
            user: updatedUser.toObject(),
          });
        } catch (error) {
          res.status(500).json({ error: `Erro ao atualizar trabalhador: ${error instanceof Error ? error.message : error}` });
        }
      })
      .delete("/people/:userId", async (req: Request, res: Response) => {
        const { userId } = req.params;
        try {
          const company = await Company.findOne({
            $or: [
              { owner: req.session.user._id },
              { people: { $in: [req.session.user._id] } },
            ],
            people: { $in: [userId] },
          })
          if (!company)
            return res.status(403).json({ error: "Permissão negada ou funcionário não associado à empresa." });
          await Company.findByIdAndUpdate(
            company._id,
            { $pull: { people: userId } }
          )
          const deletedUser = await User.findByIdAndDelete(userId);
          if (!deletedUser)
            return res.status(404).json({ error: "Funcionário não encontrado." })
          await Ticket.findOneAndDelete({ "by._id": deletedUser._id })
          await Chat.findOneAndDelete({ "client._id": deletedUser._id })
          res.status(200).json({ msg: "Funcionário excluído com sucesso!" })
        } catch (error) {
          res.status(500).json({ error: `Erro ao excluir funcionário: ${error instanceof Error ? error.message : error}` });
        }
      })