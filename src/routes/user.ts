import { Router, Request, Response } from "express"

export default Router()
    .get("/", (req: Request, res: Response) => {
        res.send("faz o B")
    })
    .post("/create", (req: Request, res: Response) => {
        res.status(200).json(req.body)
    })
    .get("/login", (req: Request, res: Response) => {
        
    })