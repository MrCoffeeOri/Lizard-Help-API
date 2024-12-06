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
import authRequired from "./middlewares/authRequired";


declare module 'http' {
    interface IncomingMessage {
      session?: session.Session & Partial<session.SessionData>;
    }
  }

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: { 
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
})
const sharedSession = session({
    secret: process.env.SESSION_SECRET || "test",
    resave: false,
    saveUninitialized: false, 
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
        signed: true
    }
})

config()
app.use(cors())
app.use(sharedSession)
app.use(json())
app.use("/user", user)
app.use("/company", authRequired, company)
app.use("/tickets", authRequired, () => {})
app.get("/test", (req: Request, res: Response) => res.status(200).json({ msg: "Server funcionando 🦎" }))

io.engine.use(sharedSession)
io.on("connection", socket => {
    /*socket.data.user = socket.request.session.user
    if (socket.data.user.type == "technician")
        socket.join("technician")*/

    socket.on("ticket", async event => {
        switch (event.action) {
            case "create":
                const ticket = await Ticket.create({ by: event.data.by, title: event.data.title, description: event.data.description, tags: event.data.tags })
            case "delete":
                Ticket.findByIdAndDelete(event.data._id)
            case "edit":
                Ticket.findByIdAndUpdate(event.data._id, { by: event.data.by, title: event.data.title, description: event.data.description, tags: event.data.tags })
            default:
                socket.to(socket.id).to("technician").emit("ticket", { action: event.action, data: event.action == "create" ? ticket.toObject() : event.data })
                break;
        }
    })

    socket.on("chat", event => {
        
    })

    
})

connect(process.env.API_URI as string)
    .then(() => server.listen(process.env.PORT || 5000, () => {
        if (process.env.NODE_ENV == 'development') {
            console.log("http://localhost:5000" + " " + process.env.NODE_ENV);
        }
    }))
    .catch((reason) => console.log(reason))
