import { db } from "./createConnection.js";

const deleteMode = true;

if (deleteMode) {
  db.exec(`DROP TABLE IF EXISTS students;`);
}

db.exec(
  "CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, class TEXT);"
);

//seed
if (deleteMode) {
  db.run(
    `INSERT INTO students (name, email, class) VALUES ('John', 'john@mail.com', '1A');`
  );
  db.run(
    `INSERT INTO students (name, email, class) VALUES ('Jane', 'jane@mail.com', '1B');`
  );
  db.run(
    `INSERT INTO students (name, email, class) VALUES ('Joe', 'joe@mail.com', '1C');`
  );
}

db.close();
