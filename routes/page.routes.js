const express = require("express");
const router = express.Router();

const checkAuthentication = require("../middlewares/authMiddleware");

const {
   isAdmin,
   ActualUser,
   getAllUsers,
} = require("../services/user.service");

router.get("/play", checkAuthentication, async function (req, res) {
   const users = await getAllUsers();

   res.render("play", {
      title: "Сапер",
      isAdmin: req.user.role,
      actualUser: req.user.login,
      userlist: users,
   });
});

router.get("/lobby", checkAuthentication, async function (req, res) {
   res.render("lobby", {
      title: "Ігрові лобі",
      isAdmin: req.user.role,
      actualUser: req.user.login,
   });
});

router.get("/lobby/play", checkAuthentication, async function (req, res) {
   res.render("lobby/play", {
      title: "Ігрові лобі",
      isAdmin: req.user.role,
      actualUser: req.user.login,
   });
});

router.get("/signup", function (req, res) {
   res.render("signup", {
      title: "Сапер — Вхід",
   });
});

router.get("/registration", function (req, res) {
   res.render("registration", {
      title: "Сапер — Реєстрація",
   });
});

router.get("/game.html", function (req, res) {
   console.log("GET /game.html спрацював");
   res.redirect("/play");
});
router.get("/register", function (_, res) {
   res.sendFile(__dirname + "/registration");
});
module.exports = router;
