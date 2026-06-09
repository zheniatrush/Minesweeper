const db = require("../db");
const Users = db.Users;

function isAdmin(userRole) {
   let roles = userRole;
   return roles;
}

function ActualUser(userName) {
   let onlineUser = userName;
   return onlineUser;
}

async function getAllUsers() {
   const allUsers = await Users.findAll({
      attributes: ["login", "id", "role"],
   });

   return allUsers.map((user) => user.toJSON());
}

module.exports = {
   isAdmin,
   ActualUser,
   getAllUsers,
};
