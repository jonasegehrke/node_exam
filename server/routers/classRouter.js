import { Router } from 'express'
import { db } from "../database/createConnection.js";

const router = Router();

function checkLoginStatus(req, res, next) {
    if (!req.session.isLoggedIn) {
      res.status(403).send("Forbidden");
      return;
    }
    next();
  }

router.get('/api/classes', checkLoginStatus, async (req, res) => {
    const classes = await db.all('SELECT * FROM class');

    classes ? res.send({ data: classes }) : res.status(404).send('Nothing found');
});


export default router;