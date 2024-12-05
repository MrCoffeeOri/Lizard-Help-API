import { config } from 'dotenv';
import express, { json, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import { Server } from 'socket.io';
import user from './routes/user';
import company from './routes/company';
import { connect } from 'mongoose';
import { createServer } from 'http';
import Ticket from './models/ticket.model';

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: { 
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
})

config()
app.use(cors())
app.use(session({
    secret: process.env.SESSION_SECRET || "test",
    resave: false,
    saveUninitialized: false, 
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
        signed: true
    }
}))
app.use(json())
app.use("/user", user)
app.use("/company", company)
app.use("/tickets", () => {})
app.get("/test", (req: Request, res: Response) => res.status(200).json({ msg: "Server funcionando 🦎" }))

io.on("connection", socket => {
    socket.data.user = socket.handshake.auth.user
    if (socket.data.user.type == "technician")
        socket.join("technician")

    socket.on("ticket", async event => {
        const ticket = await Ticket.create({ by: event.data.by, title: event.data.title, description: event.data.description, tags: event.data.tags })
        socket
            .to(socket.id)
            .to("technician"/*(await io.sockets.fetchSockets()).filter(_socket => _socket.data.user.type == "technician").map(_socket => _socket.data.user.type)*/)
            .emit("ticket", {
            action: event.action,
            data: ticket.toObject()
        })
    })
})

connect(process.env.API_URI as string)
    .then(() => server.listen(process.env.PORT || 5000, () => {
        if (process.env.NODE_ENV === 'development') {
            console.log("http://localhost:5000");
        }
    }))
    .catch((reason) => console.log(reason))
