import passport from "passport";
import { Router, Response, Request, NextFunction } from "express";

const router = Router()

router.get("/github", passport.authenticate('github', {
  scope: ["user", "repo"]
}))

router.get("/github/callback", passport.authenticate('github', {
 successRedirect: "/dashboard" 
}))

router.get("/github/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if(err) next(err)
    res.redirect("/")
  })
})


router.get("/current_user", (req: Request, res: Response) => {
  //console.log(req.user)
  res.json(req.user)
})



export default router;
