import express from "express";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();

dotenv.config();

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});
app.use(sessionMiddleware);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));

const clientSocketIds = [];

io.on("connection", (socket) => {
  socket.on("update-client-socket-ids", (user) => {
    user.socketId = socket.id;
    clientSocketIds.push(user);
  });

  socket.on("send-message", (message) => {
    if (message.receiverId) {
      const receiver = clientSocketIds.find(
        (user) => user.userId === message.receiverId
      );
      if (receiver) {
        socket.to(receiver.socketId).emit("receive-message", message);
      }
    }
  });

    socket.on("disconnect", () => {
        const index = clientSocketIds.findIndex((user) => user.socketId === socket.id);
        clientSocketIds.splice(index, 1);

    });
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // Limit each IP to 6 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api/auth", authLimiter);


import loginRouter from "./routers/loginRouter.js";
app.use(loginRouter);

import studentRouter from "./routers/studentRouter.js";
app.use(studentRouter);

import teacherRouter from './routers/teacherRouter.js';
app.use(teacherRouter);

import classRouter from './routers/classRouter.js';
app.use(classRouter);

import postRouter from "./routers/postRouter.js";
app.use(postRouter);

import lessonRouter from "./routers/lessonRouter.js";
app.use(lessonRouter);

import chatRouter from './routers/chatRouter.js';
app.use(chatRouter);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
