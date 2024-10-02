import { config } from 'dotenv';
import express, { json } from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import user from './routes/user';
import company from './routes/company';
import { connect } from 'mongoose';

const app = express();
config();
app.use(session({
    secret: process.env.SESSION_SECRET || "test",
    resave: false,
    saveUninitialized: false, 
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
        signed: true
    }
}));
app.use(cors({ origin: '*' }));
app.use(json());
app.use("/user", user);
app.use("/company", company);
app.use("/tickets", () => {});
connect(process.env.API_URI as string)
    .then(() => app.listen(process.env.PORT || 5000, () => {
        if (process.env.NODE_ENV === 'development') {
            console.log("http://localhost:5000");
        }
    }))
    .catch((reason) => console.log(reason));
