import { Router, Request, Response } from "express"
import Login from "../middlewares/login"

export default Router()
    .get("/", (req: Request, res: Response) => {
        res.send("faz o B")
    })
    .post("/create", (req: Request, res: Response) => {
        res.status(200).json(req.body)
    })
    .get("/login", Login, (req: Request, res: Response) => {
        
    })