import axios from "axios";
import { Router, Request, Response, } from "express";
//import { createClient } from "redis";

import { isAuthenticated, notAuthenticated } from "../middleware/auth";
import Repos from "../models/Repos";
// import UrlProj from "../models/ProjUrls";
const router = Router();

// console.log(process.env.REDIS_URI)
// const subscriber = createClient({
//   url: process.env.REDIS_URI!
// })
// .on("error", err => console.log("Error on subscriber Auth", err))
// .on("ready", () => console.log("ready to subscriber"))
// subscriber.connect()

router.get("/", (req: Request, res: Response) => {
  res.render('home')
})

router.get("/login", notAuthenticated, (req: Request, res: Response) => {
  res.render('login', {
    layout: 'login',
    user: req.user?.username
  })
})


// // const save_repo_url = (user_id: String) => {
// //   console.log(user_id)

// //   subscriber.subscribe("url", async (ms) => {
// //     console.log(ms)
// //     const found_url = await UrlProj.find({
// //       url: ms
// //     })


// //     if(!found_url){
// //       const saved_url = await UrlProj.create({
// //         user_id: user_id,
// //         url: ms
// //       })
// //       console.log("saved_url")
// //     }else {
// //       console.log("already in db")
// //     }
// //   })
// }
//isAuthenticated
router.get("/dashboard", isAuthenticated, async (req: Request, res: Response) => {

  await axios.get("/repos")
  const data = await Repos.find({githubId: req.user?.githubId}, {_id: 0, __v: 0})
  // save_repo_url(req.user?.id)
  // const urls = await UrlProj.find()
  //console.log(data)

  res.render('dashboard', {
    repos: data,
    user: req.user?.username,
    // urls: urls
  })
})

export default router;
