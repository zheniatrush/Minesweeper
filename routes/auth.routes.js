const express = require("express");
const router = express.Router();

const passport = require("passport");

const db = require("../db");
const Users = db.Users;

const { hashPassword } = require("../utils/hash");

router.post("/register", async (req, res) => {
   const hashDone = await hashPassword(req.body.password);
   const { username, email } = req.body;

   try {
      await Users.create({
         login: username,
         password: hashDone,
         email: email,
      });

      res.redirect("/signup");
   } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).send("Error creating user");
   }
});

router.post(
   "/login",
   passport.authenticate("local", {
      session: true,
      successRedirect: "/play",
      failureRedirect: "/signup?error=1",
   }),
);

module.exports = router;
