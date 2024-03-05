import passport from "passport";
import { Router, Response, Request, NextFunction } from "express";

const router = Router()

router.get("/github", passport.authenticate('github', {
  scope: ["user"]
}))

router.get("/github/callback", passport.authenticate('github'), (req: Request, res: Response) => {
  res.send(req.user)
})


router.get("/github/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if(err) next(err)
    res.redirect("/")
  })
})


router.get("/current_user", (req: Request, res: Response) => {
  console.log(req.user)
  res.send(req.user)
})

export default router;
