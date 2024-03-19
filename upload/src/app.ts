import express from "express";
import cors from "cors"

import dotenv from "dotenv"

import uploadRoutes from "./routes/uploadRoutes"

dotenv.config()




const app = express();

(async () => {

  app.use(express.json())
  app.use(cors())

  app.use("/upload", uploadRoutes)

  app.listen(5001, () => console.log("UPLOAD ON 5001", process.env.R2_ACCESS_KEY))
})()

