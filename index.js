const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = require("./db");
const Users = db.users;

const passport = require("passport");
const LocalStrategy = require("passport-local");

const express = require("express");
const session = require("express-session");
var router = express.Router();
const app = express();

//=================================== EJS ==========================================

app.set("view engine", "ejs");

app.use("/contact", function (request, response) {
   response.render("contact", {
      title: "Мои контакты",
      emailsVisible: true,
      emails: ["gavgav@mycorp.com", "mioaw@mycorp.com"],
      phone: "+1234567890",
   });
});
app.use("/play", function (request, response) {
   response.render("play", {
      title: "Сапер",
   });
});
app.use("/signup", function (request, response) {
   response.render("signup", {
      title: "Сапер — Вхід",
   });
});
app.use("/registration", function (request, response) {
   response.render("registration", {
      title: "Сапер — Реєстрація",
   });
});

app.listen(3000);

//=================================== EJS END ==========================================

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

router.get("/play.ejs", checkAuthentication, function (req, res) {
   res.sendFile(path.join(__dirname, "views", "play.ejs"));
   console.log("GET /game.html спрацював");
});

// =============================== checkAuthentication ==========================================

// =============================== checkAuthentication END ==========================================

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
   res.sendFile(__dirname + "/registration");
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

      res.redirect("/signup");
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
      successRedirect: "/play",
      failureRedirect: "/signup?error=1",
   }),
);

function checkAuthentication(req, res, next) {
   if (req.isAuthenticated()) {
      console.log(req.isAuthenticated());
      next();
   } else {
      console.log("Ти  лох");
      res.redirect("/login.html");
   }
}

app.listen(3000, () => {
   console.log("Server started on http://localhost:3000");
});
