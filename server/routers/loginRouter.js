import { Router } from 'express';
import { db } from "../database/createConnection.js";
import bcrypt from 'bcrypt';

const router = Router();

async function comparePasswords(req, res, next){

    const { password } = req.body;
    const { username } = req.body;

    console.log("password: ", password);
    console.log("username: ", username);

    const user = await db.get("SELECT * FROM student_user WHERE username = ?", username);

    console.log(user)

    //check if any user is found
    if(user === undefined){
        res.send({ message: "Brugernavnet er forkert", isLoggedIn: false });
        return
    }

    //check if password is correct
    const isSame = await bcrypt.compare(String(req.body.password), String(user.pass));
    console.log("isSame >>> ", isSame)
    if(isSame){
        req.session.isLoggedIn = true;
        req.session.userId = user.userId;
    }else{
        req.session.isLoggedIn = false;
    }
    next();
}

router.post('/api/auth', comparePasswords, (req, res) => {
    if(!req.session.isLoggedIn){
      res.send({ message: "Adgangskoden er forkert", isLoggedIn: false });
        return
    }
    res.send({ isLoggedIn: true, userId: req.session.userId });
})

export default router;