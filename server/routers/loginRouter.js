import { Router } from "express";
import { db } from "../database/createConnection.js";
import bcrypt from "bcrypt";

const router = Router();

async function comparePasswords(req, res, next) {
  let admin = false;
  const { username } = req.body;

  let user = await db.get(
    "SELECT * FROM student_user WHERE username = ?",
    username
  );

  //check if any user is found
  if (user === undefined) {
    user = await db.get(
      "SELECT * FROM teacher_user WHERE username = ?",
      username
    );
    admin = true;
    if (user === undefined) {
      res.send({ message: "Brugernavnet er forkert", isLoggedIn: false });
      return;
    }
  }

  //check if password is correct
  const isSame = await bcrypt.compare(
    String(req.body.password),
    String(user.pass)
  );
  if (isSame) {
    req.session.isLoggedIn = true;
    req.session.userId = user.userId;
    if (admin) {
      req.session.isAdmin = true;
    }
  } else {
    req.session.isLoggedIn = false;
  }
  next();
}

router.post("/api/auth", comparePasswords, (req, res) => {
  if (!req.session.isLoggedIn) {
    res.send({ message: "Adgangskoden er forkert", isLoggedIn: false });
    return;
  }
  res.send({ isLoggedIn: true, userId: req.session.userId, isAdmin: req.session.isAdmin });
});

router.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.send({ message: "Du er nu logget ud", isLoggedIn: false });
});

router.post("/api/login/status", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.send({ isLoggedIn: false });
    return;
  }
  res.send({ isLoggedIn: req.session.isLoggedIn, isAdmin: req.session.isAdmin });
});

export default router;
