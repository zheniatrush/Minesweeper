var io = require("socket.io").listen(3000);

io.sockets.on("connection", function (socket) {
   socket.on("message", function () {});
   socket.on("disconnect", function () {});
});

var socket = io.connect("http://localhost:3000/");
socket.on("connect", function () {
   socket.send("hi");

   socket.on("message", function (msg) {
      // my msg
   });
});
