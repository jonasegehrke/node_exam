import express from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";


const app = express();

// I chose to use SQLite for this project, as i want to deploy it. We have not yet learned how to connect to a mySQL database hosted on Heroku/AWS/azure.
dotenv.config();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

import studentRouter from "./routers/studentRouter.js";
app.use(studentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
