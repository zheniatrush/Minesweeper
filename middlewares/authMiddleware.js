function checkAuthentication(req, res, next) {
   if (req.isAuthenticated()) {
      console.log(req.isAuthenticated());
      next();
   } else {
      console.log("Ти  лох");
      res.redirect("/signup");
   }
}

module.exports = checkAuthentication;
