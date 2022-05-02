import { db } from "./createConnection.js";
import { faker } from '@faker-js/faker'

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

await db.exec(
  "CREATE TABLE teacher(teacherId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, phone TEXT, email TEXT);"
);

await db.exec(
  "CREATE TABLE class_membership(classId INTEGER NOT NULL, teacherId INTEGER NOT NULL, FOREIGN KEY (classId) REFERENCES class(classId), FOREIGN KEY (teacherId) REFERENCES teacher(teacherId));"
);

await db.exec(
  "CREATE TABLE post(postId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, studentName TEXT, created DATETIME, classId INT, FOREIGN KEY (classId) REFERENCES class (classId));"
);

//seed
if (deleteMode) {
  //class
  await db.run(`INSERT INTO class(className) VALUES ("1A");`);
  await db.run(`INSERT INTO class(className) VALUES ("2A");`);
  await db.run(`INSERT INTO class(className) VALUES ("3A");`);

  //student_grade

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  for(let i = 1; i < 90; i++){

    let randomGrades = [2,4,7,10,12]

    shuffle(randomGrades)

    await db.run(
      `INSERT INTO student_grade(dansk, engelsk, matematik, historie, geografi) VALUES (?, ?, ?, ?, ?);`, [
        randomGrades[0],
        randomGrades[1],
        randomGrades[2],
        randomGrades[3],
        randomGrades[4]
      ]
    );
  }
  

  //student

  await db.run(
    `INSERT INTO student(firstName, lastName, studentNumber, absenceLessons, totalLessons, phone, address, email, classId, gradeId) VALUES ("Jonas", "Gehrke", "1234", 7, 100, "53 68 07 08", "København N", "jonas@mail.com", 1, 1);`
  );

  let classId = 1;
  for(let i = 2; i < 90; i++){
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();

    
    if(i > 30){
      classId = 2;
      if(i > 60){
        classId = 3;
      }
    }
  await db.run(
    `INSERT INTO student(firstName, lastName, studentNumber, absenceLessons, totalLessons, phone, address, email, classId, gradeId) VALUES (?, ?, ?, ?, 100, ?, ?, ?, ?, ?);`, [
      firstName,
      lastName,
      faker.datatype.number({min: 1000, max: 9999}),
      faker.datatype.number({min: 0, max: 30}),
      faker.phone.phoneNumber('## ## ## ##'),
      faker.address.city(),
      faker.internet.email(firstName, lastName),
      classId,
      i
    ]

  );
  }
  

  
  
  

  //student_user
  await db.run(
    `INSERT INTO student_user(username, email, pass, studentId) VALUES ("jonas", "jonas@mail.com", "$2a$12$RxG.U9bHcPWmsd/UnB0ZleEialN2QcjUoIpXYPz2sfav.NLo5UkNe", 1);`
  );

  //teacher
  await db.run(
    `INSERT INTO teacher(firstName, lastName, phone, email) VALUES ("Hans", "Hansen", "45 45 45 45", "hans@mail.com");`
  );
  await db.run(
    `INSERT INTO teacher(firstName, lastName, phone, email) VALUES ("Jens", "Jensen", "45 45 45 45", "jens@mail.com");`
  );
  await db.run(
    `INSERT INTO teacher(firstName, lastName, phone, email) VALUES ("Anders", "Andersen", "45 45 45 45", "anders@mail.com");`
  );

  //class_membership
  await db.run(`INSERT INTO class_membership(teacherId, classId) VALUES (1,1);`);
  await db.run(`INSERT INTO class_membership(teacherId, classId) VALUES (1,2);`);
  await db.run(`INSERT INTO class_membership(teacherId, classId) VALUES (2,3);`);
  await db.run(`INSERT INTO class_membership(teacherId, classId) VALUES (3,2);`);

  //post
  await db.run(
    `INSERT INTO post(title, content, studentName, created, classId) VALUES ("lorem ipsum 2", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni tenetur voluptatem blanditiis architecto inventore vitae ab!", "Jonas Gehrke", "2022-05-01 12:50:00", 1);`
  );
  await db.run(
    `INSERT INTO post(title, content, studentName, created, classId) VALUES ("lorem ipsum 3", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni tenetur voluptatem blanditiis architecto inventore vitae ab!", "Jonas Gehrke", "2022-05-01 12:55:00", 1);`
  );
  await db.run(
    `INSERT INTO post(title, content, studentName, created, classId) VALUES ("lorem ipsum 1", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni tenetur voluptatem blanditiis architecto inventore vitae ab!", "Jonas Gehrke", "2022-05-01 12:40:00", 1);`
  );
}

db.close();

console.log("Database created, goodbye :-)");