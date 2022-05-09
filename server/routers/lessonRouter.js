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

router.get(
  "/api/lessons/:id/:startDate/:endDate",
  checkLoginStatus,
  async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate } = req.params;
    const lessons = await db.all(
      "SELECT * FROM Lesson WHERE classId = ? AND lessonDate BETWEEN ? AND ?;",
      [id, startDate, endDate]
    );
    res.send({ data: lessons });
  }
);

router.post("/api/lessons", checkLoginStatus, async (req, res) => {
  const { classId, lessonDate, lessonNumber, lessonSubject } = req.body;

  const lesson = await db.run(
    "INSERT INTO Lesson (classId, lessonDate, lessonNumber, lessonSubject) VALUES (?, ?, ?, ?);",
    [classId, lessonDate, lessonNumber, lessonSubject]
  );

  lesson.changes > 0
    ? res.send({ success: true })
    : res.send({ error: "Something went wrong" });
});

router.delete("/api/lessons/:id", checkLoginStatus, async (req, res) => {
  const { id } = req.params;
  const lesson = await db.run("DELETE FROM Lesson WHERE lessonId = ?;", [id]);

  lesson.changes > 0
    ? res.send({ success: true })
    : res.send({ error: "Something went wrong" });
});

export default router;
