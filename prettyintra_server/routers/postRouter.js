import { Router } from "express";
import { db } from "../database/createConnection.js";

const router = Router();

router.get("/api/posts/:id", async (req, res) => {
    const { id } = req.params;
    const posts = await db.all("SELECT * FROM post WHERE classId = ? ORDER BY created DESC;", id);
  
    posts ? res.send({ data: posts }) : res.send({ error: "No posts were found" });
  });

router.post("/api/posts", async (req, res) => {
  const { title, content, created, studentName, classId } = req.body;
  const post = await db.run(
    "INSERT INTO post (title, content, created, studentName, classId) VALUES (?,?,?,?,?);",
    [title, content, created, studentName, classId]
  );
  post.changes > 0
    ? res.send({ success: true })
    : res.send({ error: "Something went wrong" });
});



export default router;