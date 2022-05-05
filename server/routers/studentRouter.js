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

router.get("/api/students", checkLoginStatus, async (req, res) => {
  const students = await db.all(
    "SELECT * FROM student INNER JOIN class ON student.classId = class.classId INNER JOIN student_grade ON student.gradeId = student_grade.gradeId;"
  );
  res.send({ data: students });
});

router.get("/api/students/user", checkLoginStatus, async (req, res) => {
  const id = req.session.userId;
  const student = await db.get(
    "SELECT * FROM student_user INNER JOIN student ON student_user.studentId = student.studentId INNER JOIN class ON student.classId = class.classId INNER JOIN student_grade ON student.gradeId = student_grade.gradeId WHERE userId = ?;",
    id
  );

  student
    ? res.send({ data: student })
    : res.send({ error: "Student not found" });
});

export default router;
