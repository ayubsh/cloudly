import express, {Request} from "express"
import cookieSession from "cookie-session";
import passport from "passport";
import mongoose from "mongoose"
import cors from "cors"
import {engine} from "express-handlebars"

import "./services/passport";
import authRouter from "./routes/github-rout"
import reposRouter from "./routes/repos-route";
import indexRouter from "./routes/index"
import path from "path";

(async () =>{
    await mongoose.connect("mongodb://localhost:27017/authdb")
    console.log("db connected")
    const app = express()
    app.use(cookieSession({
    name: 'auth-session',
    keys: ["somesessionsercrets"],
    maxAge: 24*60*60*1000
  }))

  app.use(passport.initialize())
  app.use(passport.session())
  app.use(passport.authorize('session'))
  app.use(cors())

  // register regenerate & save after the cookieSession middleware initialization

app.use(function(request: Request, _, next) {
    if (request.session && !request.session.regenerate) {
      //@ts-ignore
        request.session.regenerate = (cb) => {

      //@ts-ignore
            cb()
        }
    }
    if (request.session && !request.session.save) {

      //@ts-ignore
        request.session.save = (cb) => {

      //@ts-ignore
            cb()
        }
    }
    next()
})

      app.engine('handlebars', engine());
      app.set('view engine', 'handlebars');
      app.set('views', path.join(__dirname, '/views/'));
      app.use(express.static(path.join(__dirname, 'public')))

      app.use("/", indexRouter)
      app.use("/auth/", authRouter)
      app.use("/repos", reposRouter) 

      app.get("/", (_, res) => {
        res.send("Yaya yoo")
      })

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Auth Service On ${PORT}`)
    })
})()


