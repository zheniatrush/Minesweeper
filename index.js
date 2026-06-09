const path = require("path");

const db = require("./db");
const Users = db.Users;
const Lobby = db.Lobby;

const passport = require("passport");

const express = require("express");
const session = require("express-session");

var router = express.Router();
const app = express();

const checkAuthentication = require("./middlewares/authMiddleware");
const configurePassport = require("./config/passport");
configurePassport(passport);

app.use(express.json());
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

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const pageRoutes = require("./routes/page.routes");
app.use("/", pageRoutes);

app.use(express.static(path.join(__dirname, "public")));

//=================================== EJS ==========================================

app.set("view engine", "ejs");

app.post("/make-admin", async (req, res) => {
   try {
      const userId = req.body.id;

      await Users.update(
         { role: "admin" },
         {
            where: {
               id: userId,
            },
         },
      );
   } catch (error) {
      console.error(error);
   }
});

app.post("/delete-user", async (req, res) => {
   try {
      const userId = req.body.id;

      await Users.destroy({
         where: {
            id: userId,
         },
      });
      res.send("User deleted successfully");
   } catch (error) {
      console.error(error);
   }
});
//=================================== EJS END ==========================================
app.post("/logout-user", (req, res, next) => {
   console.log("POST /logout-user спрацював");
   req.session.destroy();
   res.redirect("/signup");
});

app.post("/go-to-lobby", async (req, res) => {
   try {
      const actualUser = req.user.login;

      const existingLobby = await Lobby.findOne({
         where: {
            first_player: actualUser,
         },
      });

      if (existingLobby) {
         console.log("Користувач вже знаходиться в лобі");
         await Lobby.update(
            {
               second_player: actualUser,
               player_count: 2,
            },
            {
               where: {
                  lobby_id: 1,
               },
            },
         );
      }

      await Lobby.update(
         {
            first_player: actualUser,
            player_count: 1,
         },
         {
            where: {
               lobby_id: 1,
            },
         },
      );

      return res.redirect("/lobby/play");
   } catch (error) {
      console.error(error);
      return res.status(500).send("Помилка сервера");
   }
});

// =================================== LOBBY START ==========================================

app.listen(3000, () => {
   console.log("Server started on http://localhost:3000");
});
