import { db } from "./createConnection.js";

const deleteMode = true;

if (deleteMode) {
  await db.exec(`DROP TABLE IF EXISTS class;`);
  await db.exec(`DROP TABLE IF EXISTS student_grade;`);
  await db.exec(`DROP TABLE IF EXISTS student;`);
  await db.exec(`DROP TABLE IF EXISTS student_user;`);
  await db.exec(`DROP TABLE IF EXISTS teacher;`);
  await db.exec(`DROP TABLE IF EXISTS class_membership;`);
  await db.exec(`DROP TABLE IF EXISTS post;`);
}

// Create the tables
await db.exec(
  "CREATE TABLE class(classId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, className TEXT);"
);

await db.exec(
  "CREATE TABLE student_grade(gradeId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, dansk INT, engelsk INT, matematik INT, historie INT, geografi INT);"
);

await db.exec(
  "CREATE TABLE student(studentId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, studentNumber TEXT, absenceLessons INT, totalLessons INT, phone TEXT, address TEXT, email TEXT, classId INT, gradeId INT, FOREIGN KEY (classId) REFERENCES class(classId), FOREIGN KEY (gradeId) REFERENCES student_grade(gradeId));"
);

await db.exec(
  "CREATE TABLE student_user(userId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, pass TEXT, studentId INT, FOREIGN KEY (studentId) REFERENCES student(studentId));"
);

db.exec(
  "CREATE TABLE teacher(teacherId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, phone TEXT, email TEXT);"
);

db.exec(
  "CREATE TABLE class_membership(classId INTEGER NOT NULL, teacherId INTEGER NOT NULL, FOREIGN KEY (classId) REFERENCES class(classId), FOREIGN KEY (teacherId) REFERENCES teacher(teacherId));"
);

db.exec(
  "CREATE TABLE post(postId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, studentName TEXT, created DATETIME, classId INT, FOREIGN KEY (classId) REFERENCES class (classId));"
);

//seed
if (deleteMode) {
  //class
  await db.run(`INSERT INTO class(className) VALUES ("1A");`);
  await db.run(`INSERT INTO class(className) VALUES ("2A");`);
  await db.run(`INSERT INTO class(className) VALUES ("3A");`);

  //student_grade
  await db.run(
    `INSERT INTO student_grade(dansk, engelsk, matematik, historie, geografi) VALUES (4, 10, 2, 12, 7);`
  );
  await db.run(
    `INSERT INTO student_grade(dansk, engelsk, matematik, historie, geografi) VALUES (10, 10, 12, 2, 7);`
  );

  //student
  await db.run(
    `INSERT INTO student(firstName, lastName, studentNumber, absenceLessons, totalLessons, phone, address, email, classId, gradeId) VALUES ("Jonas", "Gehrke", "1234", 10, 100, "53 68 07 08", "Fredensborggade 6 4th 2200 København N", "jonas@mail.com", 1, 1);`
  );
  await db.run(
    `INSERT INTO student(firstName, lastName, studentNumber, absenceLessons, totalLessons, phone, address, email, classId, gradeId) VALUES ("Andreas", "Andersen", "4321", 7, 100, "45 67 89 90", "Fiktivgade 2 1tv 2200 København N", "andreas@mail.com", 1, 2);`
  );

  //student_user
  await db.run(
    `INSERT INTO student_user(username, email, pass, studentId) VALUES ("jonas", "jonas@mail.com", "$2a$12$RxG.U9bHcPWmsd/UnB0ZleEialN2QcjUoIpXYPz2sfav.NLo5UkNe", 1);`
  );
  await db.run(
    `INSERT INTO student_user(username, email, pass, studentId) VALUES ("andreas", "andreas@mail.com", "$2a$12$RxG.U9bHcPWmsd/UnB0ZleEialN2QcjUoIpXYPz2sfav.NLo5UkNe", 2);`
  );

  //teacher
  db.run(
    `INSERT INTO teacher(firstName, lastName, phone, email) VALUES ("Hans", "Hansen", "45 45 45 45", "hans@mail.com");`
  );
  db.run(
    `INSERT INTO teacher(firstName, lastName, phone, email) VALUES ("Jens", "Jensen", "45 45 45 45", "jens@mail.com");`
  );
  db.run(
    `INSERT INTO teacher(firstName, lastName, phone, email) VALUES ("Anders", "Andersen", "45 45 45 45", "anders@mail.com");`
  );

  //class_membership
  db.run(`INSERT INTO class_membership(teacherId, classId) VALUES (1,1);`);
  db.run(`INSERT INTO class_membership(teacherId, classId) VALUES (1,2);`);
  db.run(`INSERT INTO class_membership(teacherId, classId) VALUES (2,3);`);
  db.run(`INSERT INTO class_membership(teacherId, classId) VALUES (3,2);`);

  //post
  db.run(
    `INSERT INTO post(title, content, studentName, created, classId) VALUES ("lorem ipsum 2", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni tenetur voluptatem blanditiis architecto inventore vitae ab!", "Jonas Gehrke", "2022-05-01 12:50:00", 1);`
  );
  db.run(
    `INSERT INTO post(title, content, studentName, created, classId) VALUES ("lorem ipsum 3", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni tenetur voluptatem blanditiis architecto inventore vitae ab!", "Jonas Gehrke", "2022-05-01 12:55:00", 1);`
  );
  db.run(
    `INSERT INTO post(title, content, studentName, created, classId) VALUES ("lorem ipsum 1", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni tenetur voluptatem blanditiis architecto inventore vitae ab!", "Jonas Gehrke", "2022-05-01 12:40:00", 1);`
  );
}

db.close();
