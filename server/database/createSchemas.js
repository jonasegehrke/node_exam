import { db } from "./createConnection.js";
import { faker } from '@faker-js/faker'

const deleteMode = true;

if (deleteMode) {
  await db.exec(`DROP TABLE IF EXISTS class;`);
  await db.exec(`DROP TABLE IF EXISTS student_grade;`);
  await db.exec(`DROP TABLE IF EXISTS student;`);
  await db.exec(`DROP TABLE IF EXISTS student_user;`);
  await db.exec(`DROP TABLE IF EXISTS teacher;`);
  await db.exec(`DROP TABLE IF EXISTS teacher_user;`);
  await db.exec(`DROP TABLE IF EXISTS teacher_classes;`);
  await db.exec(`DROP TABLE IF EXISTS post;`);
  await db.exec(`DROP TABLE IF EXISTS lesson;`);
  await db.exec(`DROP TABLE IF EXISTS message;`);
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
  "CREATE TABLE teacher_classes(teacherId INT, classId INT, FOREIGN KEY (classId) REFERENCES class (classID));"
);

await db.exec(
  "CREATE TABLE teacher_user(userId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, pass TEXT, teacherId INT, FOREIGN KEY (teacherId) REFERENCES teacher(teacherId));"
);

await db.exec(
  "CREATE TABLE post(postId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, studentName TEXT, created DATETIME, classId INT, FOREIGN KEY (classId) REFERENCES class (classId));"
);

await db.exec(
  "CREATE TABLE lesson(lessonId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, lessonSubject TEXT, lessonDate Date, lessonNumber INT, classId INT, FOREIGN KEY (classId) REFERENCES class (classId) );"
)

await db.exec(
  "CREATE TABLE message(messageId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, message TEXT, sender INT, reciever INT, messageSent DATETIME );"
)

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

  await db.run(
    `INSERT INTO student_user(username, email, pass, studentId) VALUES ("test", "test@mail.com", "$2a$12$RxG.U9bHcPWmsd/UnB0ZleEialN2QcjUoIpXYPz2sfav.NLo5UkNe", 2);`
  );

  //teacher
  await db.run(
    `INSERT INTO teacher(firstName, lastName, phone, email) VALUES ("Anders", "Latif", "45 45 45 45", "anders@mail.com");`
  );
  await db.run(
    `INSERT INTO teacher(firstName, lastName, phone, email) VALUES ("Jens", "Jensen", "45 45 45 45", "jens@mail.com");`
  );
  await db.run(
    `INSERT INTO teacher(firstName, lastName, phone, email) VALUES ("Anders", "Andersen", "45 45 45 45", "anders@mail.com");`
  );

  //teacher_user
  await db.run(
    `INSERT INTO teacher_user(username, email, pass, teacherId) VALUES ("anders", "anders@mail.com", "$2a$12$RxG.U9bHcPWmsd/UnB0ZleEialN2QcjUoIpXYPz2sfav.NLo5UkNe", 1);`
  );

  //teacher_classes
  await db.run(`INSERT INTO teacher_classes(teacherId, classId) VALUES (1,1);`);
  await db.run(`INSERT INTO teacher_classes(teacherId, classId) VALUES (1,2);`);
  await db.run(`INSERT INTO teacher_classes(teacherId, classId) VALUES (2,3);`);
  await db.run(`INSERT INTO teacher_classes(teacherId, classId) VALUES (3,2);`);

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


  //Lesson
  async function seedLessons(classId){
  let lessonNumber = 0;
  const subjects = ["Dansk", "Engelsk", "Matematik", "Historie", "Geografi"];
    const dates = ["2022-06-20","2022-10-06","2022-06-17","2022-09-08","2022-07-18","2022-09-09","2022-08-11","2022-11-15","2022-06-12","2022-11-06","2022-06-23","2022-05-02","2022-11-01","2022-05-26","2022-11-13","2022-05-10","2022-08-05","2022-07-31","2022-05-01","2022-06-28","2022-11-25","2022-11-28","2022-09-05","2022-09-29","2022-07-21","2022-08-18","2022-10-19","2022-10-14","2022-10-23","2022-05-09","2022-07-02","2022-09-17","2022-05-18","2022-08-30","2022-07-19","2022-10-05","2022-08-17","2022-09-10","2022-11-08","2022-11-14","2022-11-26","2022-07-17","2022-09-12","2022-11-09","2022-10-20","2022-09-26","2022-09-18","2022-09-25","2022-10-12","2022-06-07","2022-11-02","2022-08-19","2022-11-05","2022-07-20","2022-10-01","2022-08-20","2022-09-15","2022-10-08","2022-09-20","2022-05-16","2022-08-10","2022-08-23","2022-07-26","2022-05-30","2022-08-26","2022-05-14","2022-10-09","2022-06-04","2022-08-25","2022-08-28","2022-06-24","2022-10-17","2022-07-06","2022-06-22","2022-07-01","2022-09-03","2022-11-29","2022-07-30","2022-09-02","2022-07-16","2022-11-20","2022-11-10","2022-10-04","2022-09-04","2022-11-23","2022-11-17","2022-08-08","2022-11-12","2022-10-31","2022-11-11","2022-10-18","2022-05-13","2022-10-25","2022-06-29","2022-08-14","2022-08-21","2022-09-14","2022-07-03","2022-06-15","2022-06-13","2022-08-06","2022-05-11","2022-09-23","2022-05-31","2022-10-29","2022-07-22","2022-09-27","2022-08-22","2022-09-24","2022-11-30","2022-05-23","2022-06-25","2022-08-12","2022-10-03","2022-09-13","2022-11-16","2022-06-09","2022-08-15","2022-05-17","2022-11-27","2022-06-19","2022-06-10","2022-07-11","2022-08-02","2022-07-14","2022-10-10","2022-05-24","2022-10-11","2022-11-07","2022-09-01","2022-06-01","2022-07-27","2022-08-01","2022-08-07","2022-07-05","2022-07-04","2022-08-09","2022-07-28","2022-05-15","2022-08-16","2022-06-16","2022-06-18","2022-09-28","2022-05-25","2022-09-11","2022-07-07","2022-11-18","2022-06-08","2022-08-31","2022-07-09","2022-09-21","2022-05-12","2022-09-07","2022-09-30","2022-05-22","2022-06-03","2022-10-16","2022-05-05","2022-07-10","2022-10-02","2022-09-16","2022-05-20","2022-06-30","2022-11-22","2022-07-13","2022-10-30","2022-11-24","2022-06-21","2022-08-04","2022-05-06","2022-10-24","2022-06-14","2022-09-19","2022-07-23","2022-08-29","2022-07-29","2022-11-04","2022-05-29","2022-06-26","2022-08-27","2022-10-28","2022-08-03","2022-05-27","2022-11-21","2022-09-06","2022-05-28","2022-05-07","2022-05-08","2022-06-06","2022-07-08","2022-10-21","2022-06-11","2022-08-24","2022-11-19","2022-05-04","2022-06-02","2022-10-13","2022-05-03","2022-11-03","2022-05-21"];
  for(let i = 1; i < dates.length; i++){

    lessonNumber = faker.datatype.number({min: 1, max: 2})
    


    if(lessonNumber === 2){
      lessonNumber = 3;
    }

    const subject = subjects[Math.floor(Math.random()*subjects.length)];
    await db.run(`INSERT INTO Lesson(lessonSubject, lessonDate, lessonNumber, classId) VALUES (?, ?, ?, ?);`, [
      subject,
      dates[i],
      lessonNumber,
      classId
    ]);
    
    await db.run(`INSERT INTO Lesson(lessonSubject, lessonDate, lessonNumber, classId) VALUES (?, ?, ?, ?);`, [
      subject,
      dates[i],
      ++lessonNumber,
      classId
    ]);
  }
}
  await seedLessons(1);
  await seedLessons(2);
  await seedLessons(3);
}

// message 
await db.run ("INSERT INTO message (message, sender, reciever, messageSent) VALUES ('Wanna get a coffee?', 1, 2, '2022-05-02 12:52:00');")
await db.run ("INSERT INTO message (message, sender, reciever, messageSent) VALUES ('sorry i am at work :-(', 2, 1, '2022-05-02 12:53:00');")
await db.run ("INSERT INTO message (message, sender, reciever, messageSent) VALUES ('Wonderful day is it not?', 1, 2, '2022-05-02 12:50:00');")
await db.run ("INSERT INTO message (message, sender, reciever, messageSent) VALUES ('Yes it is', 2, 1, '2022-05-02 12:51:00');")

db.close();

console.log("Database created, goodbye :-)");