import simpleGit from "simple-git";
import { Router, Response, Request } from "express";
import path from "path";
import fs from "fs";
import {createClient} from "redis"

import { getName } from "../utils/utils";
import { uploadDir, uploadFile } from "../utils/s3";

const router = Router();
const publisher = createClient({
  url: process.env.REDIS_URI
})
publisher.on("error", err => console.log("REDIS ERROR: ", err))
publisher.connect()

//TODO
//generate the local_path name 
//check if repo exist localy 
//  if exist do pull
//  if not do clone
router.post("/", async (req: Request, res: Response) => {
  const url = req.body.url
  const rs = getName(url)

  console.log(url, rs)

  const local_path = path.join( __dirname, "../..") + `/repos/${rs?.username}/${rs?.reponame}`
  console.log(local_path)
  if (fs.existsSync(local_path)) {
    //TODO do git pull
    console.log("file exist")
    res.status(200).send("pull request")
  } else {
    /*
    await simpleGit().clone(url, local_path)
    uploadDir(local_path, uploadFile)
    */
    setTimeout(() => {
      console.log("waiting for upload")
      publisher.publish("deploy", `${rs?.username}/${rs?.reponame}`)
    }, 5000)
    console.log(`${rs?.username}/${rs?.reponame}`)
    res.status(200).send("Uploaded ...")
  }
  
})

export default router;
