import express from "express";
import { createClient } from "redis";
import { dowloadFiles, buildProject, uploadDir, uploadFile } from "./utils/utils";

const app = express();

(async () => {
  const redis_uri = process.env.REDIS_URI!
  const subscriber = await createClient({
    url: redis_uri 
  })
    .on('error', err => console.error(err))
    .on('ready', () => console.log("ready"))
    .connect()


    console.log(process.env)
  subscriber.subscribe("deploy", async (ms) => {
    await dowloadFiles(ms)
    await buildProject(ms)
    uploadDir(`${__dirname}/utils/repos/${ms}/build`, uploadFile)
  })

  console.log(process.env.REDIS_URI!)
  app.get("/deploy", (req, res) => {
    res.send("yay DEPLOY")
  })
  app.listen(5002, () => console.log("DEPLOY SERVICE ON 5002"))
})()


