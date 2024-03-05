import passport from "passport";
import { Router, Response, Request } from "express";

const router = Router()

router.get("/github", passport.authenticate('github', {
  scope: ["user"]
}))

router.get("/github/callback", passport.authenticate('github'), (req: Request, res: Response) => {
  res.send(req.user)
})


export default router;
