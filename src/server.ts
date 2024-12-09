import { config } from 'dotenv';
import express, { json, Request, Response } from 'express';
import session from 'express-session';
import cors from 'cors';
import { Server } from 'socket.io';
import user from './routes/user';
import company from './routes/company';
import { connect } from 'mongoose';
import MongoDBStore from "connect-mongodb-session";
import { createServer } from 'http';
import Ticket from './models/ticket.model';
import authRequired from "./middlewares/authRequired";
import User from './models/user.model';
import Chat from './models/chats.model';


declare module 'http' {
    interface IncomingMessage {
      session?: session.Session & Partial<session.SessionData>;
    }
  }

const corsConfigs = { 
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
const mongoStore = MongoDBStore(session)
const store = new mongoStore({
    collection: "userSessions",
    databaseName: "lizardhelp",
    uri: "mongodb+srv://Renan:RPee55230@cluster0.89mpfoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    expires: 1000,
})
const app = express()
const server = createServer(app)
export const io = new Server(server, { cors: corsConfigs })

config()
app.use(cors(corsConfigs))
app.use(session({
    store,
    name: "userSession",
    secret: process.env.SESSION_SECRET || "test",
    resave: false,
    saveUninitialized: false, 
    cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' exige HTTPS
        secure: process.env.NODE_ENV === 'production', // Requer HTTPS em produção
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
        httpOnly: true
    }
}))
app.use(json())
app.use("/user", user)
app.use("/company", authRequired, company)
app.use("/tickets", authRequired, () => {})
app.get("/test", (req: Request, res: Response) => res.status(200).json({ msg: "Server funcionando 🦎" }))

io.on("connection", socket => {
    socket.on("auth", event => {
        socket.data.user = event.user
        socket.join(socket.id)
        if (socket.data.user.companyID) {
            io.to(socket.data.user.companyID).volatile.emit("user", { action: "avaible", data: { avaible: true, userID: socket.data.user._id } })
            socket.data.user.type == "owner" && socket.join(socket.data.user.companyID)
        }
        if (socket.data.user.type == "technician" || socket.data.user.type == "admin")
            socket.join("technician")
    })

    socket.on("ticket", async event => {
        let ticket;
        switch (event.action) {
            case "create":
                ticket = await Ticket.create({ by: event.data.by, title: event.data.title, description: event.data.description, tags: event.data.tags, company: event.data.companyID  })
                break;
            case "delete":
                event.data = await Ticket.findByIdAndDelete(event.data._id)
                await Chat.findOneAndDelete({ ticket: event.data.companyID })
                break;
            case "edit":
                await Ticket.findByIdAndUpdate(event.data._id, { 
                    ...(event.data.by ? { by: event.data.by } : {}), 
                    ...(event.data.title ? { title: event.data.title } : {}), 
                    ...(event.data.description ? { description: event.data.description } : {}), 
                    ...(event.data.tags ? { tags: event.data.tags } : {}),
                    ...(event.data.service ? { service: event.data.service } : {}),
                    ...(event.data.priority ? { priority: event.data.priority } : {}),
                    ...(event.data.status ? { status: event.data.status } : {}),
                    ...(event.data.solved ? { solved: event.data.solved } : {})
                })
                break;
        }
        io.to(event.data.companyID).to("technician").emit("ticket", { action: event.action, data: event.action == "create" ? ticket.toObject() : event.data })
    })

    socket.on("chat", async event => {
        let chat;
        switch (event.action) {
            case "create":
                chat = (await Chat.create({ client: event.data.client, technician: event.data.technician, ticket: event.data.ticket })).toObject()
                break;
            default:
                break;
        }
        io.to(socket.id).to(event.data.companyID).to(event.data.client._id).emit("chat", { action: event.action, data: chat || event.data })
    })

    socket.on("disconnect", async () => {
        if (socket.data.user) {
            io.to(socket.data.user.companyID).volatile.emit("user", { action: "avaible", data: { avaible: false, userID: socket.data.user._id } })
            await User.findByIdAndUpdate(socket.data.user._id, { avaible: false })
        }
    })
})

connect(process.env.API_URI as string)
    .then(() => server.listen(process.env.PORT || 5000, () => {
        if (process.env.NODE_ENV == 'development') {
            console.log("http://localhost:5000" + " " + process.env.NODE_ENV);
        }
    }))
    .catch((reason) => console.log(reason))
