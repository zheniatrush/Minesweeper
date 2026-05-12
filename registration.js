const express = require("express");
const app = express();

app.get("/register", function (_, res) {
   res.sendFile(__dirname + "/register.html");
});

app.post("/register", async (req, res) => {
   const { username, password, email } = req.body;

   try {
      const newUser = await Users.create({
         login: username,
         password: password,
         email: email,
      });

      res.redirect("/login.html");
   } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).send("Error creating user");
   }
});
