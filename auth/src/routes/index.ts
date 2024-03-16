import axios from "axios";
import { Router, Request, Response, } from "express";
import { isAuthenticated, notAuthenticated } from "../middleware/auth";
import Repos from "../models/Repos";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.render('home')
})

router.get("/login", notAuthenticated, (req: Request, res: Response) => {
  res.render('login', {
    layout: 'login'
  })
})

router.get("/dashboard", isAuthenticated,async (req: Request, res: Response) => {

  await axios.get("http://localhost:5000/repos")
  const data = await Repos.find({githubId: req.user?.githubId}, {_id: 0, __v: 0})
  console.log(data)

  res.render('dashboard', {
    repos: data
  })
})

export default router;
