const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(userPassword) {
   let hash = await bcrypt.hash(userPassword, saltRounds);
   return hash;
}

module.exports = { hashPassword };
