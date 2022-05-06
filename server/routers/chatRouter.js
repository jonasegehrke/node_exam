import { Router } from "express";
import { db } from "../database/createConnection.js";

const router = Router();

function checkLoginStatus(req, res, next) {
  if (!req.session.isLoggedIn) {
    res.status(403).send("Forbidden");
    return;
  }
  next();
}

router.get('/api/chat/:sender/:reciever', checkLoginStatus, async (req, res) => {
  const { sender, reciever } = req.params;
  const messages = await db.all("SELECT * FROM message WHERE sender = ? AND reciever = ? OR sender = ? AND reciever = ? ORDER BY messageSent ASC", [sender, reciever, reciever, sender]);

  messages ? res.send(messages) : res.status(404).send("Not found");
});

router.post('/api/chat', checkLoginStatus, async (req, res) => {
  console.log(req.body);
  const { sender, reciever, message, messageSent } = req.body;
  const newMessage = await db.run("INSERT INTO message (sender, reciever, message, messageSent) VALUES (?, ?, ?, ?)", [sender, reciever, message, messageSent]);
  newMessage.changes > 0 ? res.send({ success: true }) : res.status(404).send("Not found");
});


export default router;