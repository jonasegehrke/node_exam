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

router.get("/api/lessons/:id/:startDate/:endDate", checkLoginStatus, async (req, res) => {
  const { id } = req.params;
  const { startDate, endDate } = req.params;
  const lessons = await db.all(
    "SELECT * FROM Lesson WHERE classId = ? AND lessonDate BETWEEN ? AND ?;",
    [id, startDate, endDate]
  );
  res.send({ data: lessons });
});

export default router;
