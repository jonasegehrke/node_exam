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

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api/auth", authLimiter);

import loginRouter from "./routers/loginRouter.js";
app.use(loginRouter);

import studentRouter from "./routers/studentRouter.js";
app.use(studentRouter);

import postRouter from "./routers/postRouter.js";
app.use(postRouter);

import lessonRouter from './routers/lessonRouter.js'
app.use(lessonRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
