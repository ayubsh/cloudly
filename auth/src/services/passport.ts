import passport, { Profile } from "passport"
import GitHubStrategy from "passport-github2"
import User from "../models/User"


interface ProfileI extends Profile {
  _json: {
    repos_url: String
  }
}

passport.serializeUser((user, done) => {
  //console.log("from serializeUser: ", user)
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  //console.log(id)
  //console.log("form deserializeUser: ", user)
  done(null, user)
})

passport.use(new GitHubStrategy.Strategy({
  clientID: "",
  clientSecret: "",
  callbackURL: "/auth/github/callback"
}, 
  async (accessToken: String, refreshToken: String, profile: ProfileI, done: (err: Error | null, user: any) => void) => {
   // console.log(profile)
    const githubId = profile.id
    const repo_url = profile._json.repos_url;
    //console.log(repo_url)

    const user_exist = await User.findOne({githubId})
    //console.log(user_exist)

    if(user_exist){
      done(null, user_exist)
    }else {
      const user = await User.create({githubId, repo_url})
      done(null, user)

    }

  }
))


