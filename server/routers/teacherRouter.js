import { Router } from "express";
import { db } from "../database/createConnection.js";

const router = Router();

function checkLoginStatus(req, res, next) {
  if (!req.session.isLoggedIn || !req.session.isAdmin) {
    res.status(403).send("Forbidden");
    return;
  }
  next();
}

router.get("/api/teacher/user", checkLoginStatus, async (req, res) => {
  const id = req.session.userId;
  const teacher = await db.get(
    "SELECT * FROM teacher_user INNER JOIN teacher ON teacher_user.teacherId = teacher.teacherId WHERE userId = ?;",
    id
  );

  delete teacher.pass;

  const classes = await db.all(
    "SELECT * FROM teacher_classes INNER JOIN class ON teacher_classes.classId = class.classId WHERE teacherID = ?;",
    teacher.teacherId
  );

  teacher
    ? res.send({ teacherData: teacher, classes: classes })
    : res.send({ error: "Student not found" });
});

export default router;