const path = require("path");

const db = require("./db");
const Users = db.Users;
const Lobby = db.Lobby;

const passport = require("passport");

const express = require("express");
const session = require("express-session");
const http = require("http");
var router = express.Router();
const app = express();
const server = http.createServer(app);
const initSocket = require("./socket.server");
initSocket(server);
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
const { Op } = require("sequelize");
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

      const lobby = await Lobby.findOne({
         where: {
            lobby_id: 1,
         },
      });

      if (!lobby) {
         return res.status(404).send("Лобі не знайдено");
      }

      if (
         lobby.first_player === actualUser ||
         lobby.second_player === actualUser
      ) {
         return res.redirect("/lobby/play");
      }

      if (!lobby.first_player) {
         await Lobby.update(
            {
               first_player: actualUser,
               player_count: 1,
               game_state: "waiting",
            },
            {
               where: {
                  lobby_id: 1,
               },
            },
         );

         return res.redirect("/lobby/play");
      }

      if (!lobby.second_player) {
         await Lobby.update(
            {
               second_player: actualUser,
               player_count: 2,
               game_state: "active",
            },
            {
               where: {
                  lobby_id: 1,
               },
            },
         );

         return res.redirect("/lobby/play");
      }

      return res.send("Лобі вже заповнене");
   } catch (error) {
      console.error(error);
      return res.status(500).send("Помилка сервера");
   }
});

// =================================== LOBBY START ==========================================

server.listen(3000, () => {
   console.log("Server started on http://localhost:3000");
});
