import express from "express";
import { createClient } from "redis";
import { dowloadFiles, buildProject, uploadDir, uploadFile } from "./utils/utils";

const app = express();

(async () => {
  const subscriber = await createClient()
    .on('error', err => console.error(err))
    .on('ready', () => console.log("ready"))
    .connect()


    console.log(__dirname)
  subscriber.subscribe("deploy", async (ms) => {
    await dowloadFiles(ms)
    await buildProject(ms)
    uploadDir(`${__dirname}/utils/repos/${ms}/build`, uploadFile)
  })

  app.listen(5002, () => console.log("DEPLOY SERVICE ON 5002"))
})()


