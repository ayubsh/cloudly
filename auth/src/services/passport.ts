import passport, { Profile } from "passport"
import GitHubStrategy from "passport-github2"
import User from "../models/User"

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const found_user = await User.findOne({githubId: id})
  done(null, found_user)
})

passport.use(new GitHubStrategy.Strategy({
  clientID: "",
  clientSecret: "",
  callbackURL: "/auth/github/callback"
}, 
  async (accessToken: String, refreshToken: String, profile: Profile, done: (err: Error | null, user: any) => void) => {
    const githubId = profile.id
    const user_exist = await User.findOne({githubId})
    console.log(user_exist)

    if(user_exist){
      done(null, user_exist)
    }else {
      const user = await User.create({githubId})
      done(null, user)

    }

  }
))


