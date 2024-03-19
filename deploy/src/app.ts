import express from "express";
import { createClient } from "redis";
import { dowloadFiles } from "./utils/utils";

const app = express();

(async () => {
  const subscriber = await createClient()
    .on('error', err => console.error(err))
    .connect()


  await subscriber.subscribe("deploy", (ms) => dowloadFiles(ms))

  app.listen(5002, () => console.log("DEPLOY SERVICE ON 5002"))
})()


