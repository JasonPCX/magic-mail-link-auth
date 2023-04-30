import { config } from "dotenv";

config();

import express from "express";
import cors from "cors";
import authRouter from "./routers/auth.routes.js";


const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
