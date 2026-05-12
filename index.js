const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("./db");
const Users = db.users;

const passport = require("passport");
const LocalStrategy = require("passport-local");

const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(
   session({
      secret: "my-secret-key",
      resave: false,
      saveUninitialized: false,
   }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/game.html", checkAuthentication, function (req, res) {
   res.sendFile(path.join(__dirname, "public", "game.html"));
});

app.use(express.static(path.join(__dirname, "public")));
//let errorText = document.querySelector(".error_log");
async function LogHashPassword(LoginPassword) {
   let LoginHash = await bcrypt.hash(LoginPassword, saltRounds);
   return LoginHash;
}

passport.use(
   new LocalStrategy(async function verify(username, password, cb) {
      try {
         const findUsers = await Users.findOne({
            where: {
               login: username,
            },
         });

         //  console.log("username:", username);
         // console.log("findUsers:", findUsers);

         if (!findUsers) {
            return cb(null, false, {
               message: "Неправильний логін або пароль!",
            });
         }
         const isPasswordValid = await bcrypt.compare(
            password,
            findUsers.password,
         );

         if (!isPasswordValid) {
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

passport.serializeUser(function (user, done) {
   done(null, user);
});

passport.deserializeUser(function (user, done) {
   done(null, user);
});

app.get("/register", function (_, res) {
   res.sendFile(__dirname + "/register.html");
});

async function hashPassword(userPassword) {
   let hash = await bcrypt.hash(userPassword, saltRounds);
   return hash;
}
app.post("/register", async (req, res) => {
   const hashDone = await hashPassword(req.body.password);
   const { username, email } = req.body;
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
      // console.log("POST /login спрацював");
      // console.log(req.body);
      next();
   },

   passport.authenticate("local", {
      session: true,
      successRedirect: "/game.html",
      failureRedirect: "/login.html?error=1",
   }),
);

function checkAuthentication(req, res, next) {
   if (req.isAuthenticated()) {
      console.log(req.isAuthenticated());
      next();
   } else {
      res.redirect("/login.html");
   }
}

app.listen(3000, () => {
   console.log("Server started on http://localhost:3000");
});
