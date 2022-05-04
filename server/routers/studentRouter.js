import { Router } from "express";
import { db } from "../database/createConnection.js";

const router = Router();



router.get("/api/students", async (req, res) => {
  const students = await db.all("SELECT * FROM student INNER JOIN class ON student.classId = class.classId INNER JOIN student_grade ON student.gradeId = student_grade.gradeId;");
  res.send({ data: students });
});

router.get("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  const student = await db.get("SELECT * FROM student_user INNER JOIN student ON student_user.studentId = student.studentId INNER JOIN class ON student.classId = class.classId INNER JOIN student_grade ON student.gradeId = student_grade.gradeId WHERE userId = ?;", id);

  student ? res.send({ data: student }) : res.send({ error: "Student not found" });
});

router.post("/api/students", async (req, res) => {
  const { name, email, class: className } = req.body;
  const student = await db.run(
    `INSERT INTO students (name, email, class) VALUES (?, ?, ?);`,
    name,
    email,
    className
  );

  student ? res.send({ data: "OK" }) : res.send({ error: "An error occured" });
});

router.delete("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  const student = await db.run(`DELETE FROM students WHERE id = ?;`, id);

  student ? res.send({ data: "OK" }) : res.send({ error: "An error occured" });
});

export default router;
