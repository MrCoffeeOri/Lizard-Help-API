import { config } from 'dotenv'
import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import user from './routes/user'
import company from './routes/company'
import { connect } from 'mongoose'

const app = express()

config()
app.use(cookieParser())
app.use(cors({ origin: '*' }))
app.use(json())
app.use("/user", user)
app.use("/company", company)
app.use("/tickets", () => {})
connect(process.env.API_URI as string)
    .then(() => app.listen(process.env.PORT || 5000, () => process.env.NODE_ENV == 'development' && console.log("http://localhost:5000")))
    .catch((reason) => console.log(reason))