import { Router } from "express";
import { db } from "../database/createConnection.js";

const router = Router();

router.get("/api/lessons/:id/:startDate/:endDate", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.status(403).send("Forbidden");
    return;
  }
  const { id } = req.params;
  const { startDate, endDate } = req.params;
  const lessons = await db.all(
    "SELECT * FROM Lesson WHERE classId = ? AND lessonDate BETWEEN ? AND ?;",
    [id, startDate, endDate]
  );
  res.send({ data: lessons });
});

export default router;
