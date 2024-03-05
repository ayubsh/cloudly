import express from "express"
import passport from "passport";
import session from "express-session";

import mongoose from "mongoose"

import "./services/passport";
import authRouter from "./routes/github-rout"

(async () =>{
    await mongoose.connect("mongodb://localhost:27017/authdb")
    console.log("db connected")
    const app = express()
    app.use(session({
      secret: "somesecret",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true, maxAge: 600}
    }))


    app.use("/auth/", authRouter)

    app.get("/", (_, res) => {
      res.send("Yaya yoo")
    })

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Auth Service On ${PORT}`)
    })
})()


