import express from "express";
import cors from "cors"

import uploadRoutes from "./routes/uploadRoutes"

const app = express();

app.use(express.json())
app.use(cors())

app.use("/upload", uploadRoutes)

app.listen(5001, () => console.log("UPLOAD ON 5001"))

