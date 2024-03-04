import express from "express"
import passport from "passport";
import session from "express-session";
import GitHubStrategy, {Profile}  from "passport-github2"


const app = express()
app.use(session({
  secret: "somesecret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 600}
}))


passport.use(new GitHubStrategy.Strategy({
  clientID: "",
  clientSecret: "",
  callbackURL: "/auth/github/callback"
}, 
  (accessToken: String, refreshToken: String, profile: Profile, done: (err: Error | null, user: Profile) => void) => {
    console.log(`accessToken ${accessToken} `)
    done(null, profile)
  }
))

app.get("/auth/github/callback", passport.authenticate('github'), (req, res) => {
  res.send("yaya redirected")
})

app.get("/auth/github", passport.authenticate("github", {
  scope: "user:email"
} ))
app.get("/", (_, res) => {
  res.send("Yaya yoo")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Auth Service On ${PORT}`)
})
