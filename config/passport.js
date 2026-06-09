const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const db = require("../db");
const Users = db.Users;

function configurePassport(passport) {
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
            return cb(err);
         }
      }),
   );

   passport.serializeUser(function (user, done) {
      done(null, user);
   });

   passport.deserializeUser(function (user, done) {
      done(null, user);
   });
}

module.exports = configurePassport;
