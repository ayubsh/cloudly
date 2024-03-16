import simpleGit from "simple-git";
import { Router, Response, Request } from "express";
import path from "path";
import fs from "fs";
import { getName } from "../utils/utils";
const router = Router();


//TODO
//generate the local_path name 
//check if repo exist localy 
//  if exist do pull
//  if not do clone
router.post("/", async (req: Request, res: Response) => {
  const url = req.body.url
  const rs = getName(url)

  const local_path = path.join( __dirname, "../..") + `/repos/${rs?.username}/${rs?.reponame}`

  if (fs.existsSync(local_path)) {
    //TODO do git pull
    res.status(200).send("pull request")
  } else {
    const rsp = await simpleGit().clone(url, local_path)
    console.log(rsp)

    res.status(200).send("clone request")
  }
  
})

export default router;
