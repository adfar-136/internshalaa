import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path"
import { UserRouter } from "./routes/user.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(bodyParser.json())
dotenv.config();
const dbURI = process.env.MONGODB_URI;
app.use(express.json());
app.use(cors({
  origin:["http://localhost:3001"],
  credentials:true
}));
app.use(cookieParser());

app.use("/auth",UserRouter)
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("connected to Mongodb");
  })
  .catch((e) => {
    console.log(e);
  });
  app.use(express.static(path.join(__dirname, '/buildd')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/buildd/index.html'));
  });
app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 3000")
})