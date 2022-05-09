import { Router } from "express";
import { db } from "../database/createConnection.js";
import bcrypt from "bcrypt";

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

  delete student.pass;

  student
    ? res.send({ data: student })
    : res.send({ error: "Student not found" });
});

router.get("/api/students/:search", checkLoginStatus, async (req, res) => {
  const search = req.params.search;

  const students = await db.all(
    "SELECT * FROM student WHERE firstName LIKE ? OR lastName LIKE ?;",
    `%${search}%`,
    `%${search}%`
  );

  students
    ? res.send({ data: students })
    : res.send({ error: "Students not found" });
});

router.get("/api/students/class/:id", checkLoginStatus, async (req, res) => {
  const id = req.params.id;
  
  const students = await db.all(
    "SELECT * FROM student WHERE classId = ?;",
    id
  )

  students ? res.send({ data: students }) : res.send({ error: "Students not found" });
});

router.patch("/api/students/:id", checkLoginStatus, async (req, res) => {
  const id = req.params.id;
  const student = await db.get("SELECT * FROM student WHERE studentId = ?;", id);

  const updatedStudent = await db.run(
    "UPDATE student SET absenceLessons = ? where studentId = ?;",
    student.absenceLessons + 1,
    id
  );

  updatedStudent ? res.send({ data: updatedStudent }) : res.send({ error: "Student not found" });
});

router.post("/api/students", checkLoginStatus, async (req, res) => {
  const { firstName, lastName, email, phone, address, classId } = req.body;

  //random student number 
  let studentNumber = Math.floor(Math.random() * 1000000);
  while(true){
    const student = await db.get("SELECT * FROM student WHERE studentNumber = ?;", studentNumber);
    if(!student){
      break;
    }
  }
  

  //create student_grade and get gradeId
  const grade = await db.run(
    "INSERT INTO student_grade(dansk, engelsk, matematik, historie, geografi) VALUES (null, null, null, null, null);"
    );



  //Create student with gradeId & all other. And get studentId

 const student = await db.run(
    "INSERT INTO student(firstName, lastName, studentNumber, absenceLessons, totalLessons, phone, address, email, classId, gradeId) VALUES (?, ?, ?, 0, 100, ?, ?, ?, ?, ?);",
    firstName,
    lastName,
    studentNumber,
    phone,
    address,
    email,
    classId,
    grade.lastID
    );
 
  //Create student_user with random password and username with studentId

  const password = Math.random().toString(36).substring(2, 12) //this should be sent to the students email
  const hashedPass = await bcrypt.hash(password, 12);
  const username = firstName.substring(0, 3) + lastName.substring(0, 3) + studentNumber;

  console.log(password, username);

  const studentUser = await db.run(
    "INSERT INTO student_user(username, email, pass, studentId) VALUES (?, ?, ?, ?);",
    username,
    email,
    hashedPass,
    student.lastID
    );

    if(studentUser.changes > 0 && grade.changes > 0 && student.changes > 0){
      res.send({ success: true });
    }else{
      res.send({ error: "Something went wrong" });
    }
  
});

export default router;
