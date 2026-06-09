const { Server } = require("socket.io");
const db = require("./db");
const Lobby = db.Lobby;
function initSocket(server) {
   const io = new Server(server);

   io.on("connection", (socket) => {
      console.log("Socket підключився:", socket.id);

      socket.on("join-lobby", (data) => {
         socket.join(`lobby-${data.lobbyId}`);
         console.log(`Користувач зайшов у lobby-${data.lobbyId}`);
      });

      socket.on("game:update", (data) => {
         socket.to(`lobby-${data.lobbyId}`).emit("game:update", data);
      });
      socket.on("first-player-board:update", async (data) => {
         try {
            await Lobby.update(
               {
                  first_player_json: data.board,
               },
               {
                  where: {
                     lobby_id: data.lobbyId,
                  },
               },
            );

            socket
               .to(`lobby-${data.lobbyId}`)
               .emit("first-player-board:receive", {
                  board: data.board,
               });
         } catch (error) {
            console.error("Помилка запису поля в БД:", error);
         }
      });
      socket.on("disconnect", () => {
         console.log("Socket відключився:", socket.id);
      });
   });
}

module.exports = initSocket;
