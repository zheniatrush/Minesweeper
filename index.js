const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("./db");
const Users = db.users;

const passport = require("passport");
const LocalStrategy = require("passport-local");

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
//let errorText = document.querySelector(".error_log");
passport.use(
   new LocalStrategy(async function verify(username, password, cb) {
      try {
         const findUsers = await Users.findOne({
            where: {
               login: username,
               password: password,
            },
         });

         console.log("username:", username);
         console.log("findUsers:", findUsers);

         if (!findUsers) {
            return cb(null, false, {
               message: "Неправильний логін або пароль!",
            });
         }

         return cb(null, findUsers);
      } catch (err) {
         // errorText.innerHTML = "Невірні дані";
      }
   }),
);
app.get("/register", function (_, res) {
   res.sendFile(__dirname + "/register.html");
});

async function hashPassword(userPassword) {
   let hash = await bcrypt.hash(userPassword, saltRounds);
   return hash;
}
app.post("/register", async (req, res) => {
   const hashDone = await hashPassword(req.body.password);
   console.log(hashDone);
   const { username, email } = req.body;
   console.log(username);
   try {
      const newUser = await Users.create({
         login: username,
         password: hashDone,
         email: email,
      });

      res.redirect("/login.html");
   } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).send("Error creating user");
   }
});

app.post(
   "/login",
   (req, res, next) => {
      console.log("POST /login спрацював");
      console.log(req.body);
      next();
   },

   passport.authenticate("local", {
      session: false,
      successRedirect: "/profile",
      failureRedirect: "/login.html?error=1",
   }),
);

app.listen(3000, () => {
   console.log("Server started on http://localhost:3000");
});
