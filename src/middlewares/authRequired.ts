import { NextFunction, Request, Response } from "express";

export default async function authRequired(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user)
        return res.status(401).json({ error: "Não autenticado" })
    next()
}