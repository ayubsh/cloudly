import  {Response, Request, NextFunction} from "express"

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if(req.isAuthenticated()){
    return next()
  }else {
    res.redirect('/')
  }
}


export const notAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if(!req.isAuthenticated()){
    return next()
  }else {
    res.redirect("/dashboard")
  }
}
