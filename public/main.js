const socket = io();
const socketConnected = new Promise((resolve) => {
   socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      socket.emit("join-lobby", {
         lobbyId: 1,
      });

      resolve(socket.id);
   });
});

// async function getMySocketId() {
//    const socketId = await socketConnected;
//    console.log("Мій Socket IDqweqweqweqwe:", myClientSocketId);

//    try {
//       let dataSocketId = document.querySelector("[data-socket-id]");
//       if (dataSocketId) {
//          dataSocketId.setAttribute("data-socket-id", socketId);
//       }
//    } catch (error) {
//       console.error("Помилка встановлення data-socket-id:", error);
//    }
//    return socketId;
// }

// console.log(getMySocketId());

// socket.on("connect", () => {
//    console.log("Socket connected:", socket.id);
//    socket.emit("join-lobby", {
//       lobbyId: 1,
//    });
//    myClientSocketId = socket.id;
// });

min = 0;
hour = 0;
//Оставляем вашу функцию
function init() {
   sec = 0;
   setInterval(tick, 1000);
}

function tick() {
   sec++;
   if (sec >= 60) {
      min++;
      sec = sec - 60;
   }

   if (sec < 10) {
      if (min < 10) {
         if (hour < 10) {
            document.getElementById("timer").innerHTML = "0" + min + ":0" + sec;
         } else {
            document.getElementById("timer").innerHTML = "0" + min + ":0" + sec;
         }
      } else {
         if (hour < 10) {
            document.getElementById("timer").innerHTML = "0" + min + ":0" + sec;
         } else {
            document.getElementById("timer").innerHTML = "0" + min + ":0" + sec;
         }
      }
   } else {
      if (min < 10) {
         if (hour < 10) {
            document.getElementById("timer").innerHTML = "0" + min + ":" + sec;
         } else {
            document.getElementById("timer").innerHTML = "0" + min + ":" + sec;
         }
      } else {
         if (hour < 10) {
            document.getElementById("timer").innerHTML = min + ":" + sec;
         } else {
            document.getElementById("timer").innerHTML =
               hour + ":" + min + ":" + sec;
         }
      }
   }
}

var row = 8;
var column = 8;
var counter = 0;
var gameCells = [];
function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min) + min);
}
var bombs = [];
let bomb = 0;
do {
   var bombPosition = getRandomInt(0, row * column);
   bomb++;
   if (!bombs.includes(bombPosition)) {
      bombs.push(bombPosition);
   }
} while (bombs.length < 10);

// console.log(bombs);
for (let i = 0; i < row; i++) {
   gameCells[i] = [];
   for (let j = 0; j < column; j++) {
      gameCells[i].push({
         row: i,
         column: j,
         bombsCounts: 0,
         index: counter,
         class: "active",
         status: "closed",
      });
      counter++;
      if (bombs.includes(counter)) {
         gameCells[i][j].class = "bomb";
      }
   }
}

for (let i = 0; i < row; i++) {
   for (let j = 0; j < column; j++) {
      if (gameCells[i][j].class == "active") {
         var bombCount = 0;
         for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
               if (i + x >= 0 && i + x < row && j + y >= 0 && j + y < column) {
                  if (gameCells[i + x][j + y].class == "bomb") {
                     bombCount++;
                  }
               }
            }
         }
         for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
               if (i + x >= 0 && i + x < row && j + y >= 0 && j + y < column) {
                  if (gameCells[i + x][j + y].class != "bomb") {
                     if (bombCount == 0) {
                        bombCount = "";
                     }
                     gameCells[i][j].bombsCounts = bombCount;
                  }
               }
            }
         }
      } else {
         gameCells[i][j].bombsCounts = "";
      }
   }
}

function generateCells(Cells, container) {
   let template = ``;

   Cells.forEach((row) => {
      row.forEach((Cell) => {
         template += `
            <div 
               class="cell size ${Cell.status}" 
               data-row="${Cell.row}" 
               data-column="${Cell.column}" 
               data-index="${Cell.class}" 
               data-number="${Cell.bombsCounts}"
            >
               ${Cell.bombsCounts}
            </div>
         `;
      });
   });

   container.innerHTML = template;
}
const myGrid = document.querySelector("[data-my-board]");
const enemyGrid = document.querySelector("[data-enemy-board]");

generateCells(gameCells, myGrid);
const stepEnemy = document.querySelector("[data-enemy-counter]");
socket.on("first-player-board:receive", (data) => {
   generateCells(data.board, enemyGrid);
   stepEnemy.innerHTML = `${data.counter}`;
});
const grid = document.querySelector(".player-grid");
var cells = document.querySelectorAll(".player-grid .cell");
var popupGameOver = document.querySelector(".game_over.lost");
var popupGameWin = document.querySelector(".game_over.win");

function checkWin() {
   const closedCells = document.querySelectorAll(".closed");
   if (closedCells.length === bombs.length) {
      popupGameWin.style.display = "flex";
      document.querySelector(".steps").innerHTML =
         `Кількість кроків: ${clickCount}`;
      document.querySelector(".username").innerHTML = `Користувач: ${gameUser}`;
   }
   return gameUser;
}

function restartGame() {
   location.reload();
}

let clickCount = 0;
const playerGrid = document.querySelector(".player-grid");
if (playerGrid) {
   playerGrid.addEventListener("click", function (event) {
      const elt = event.target.closest(".cell");

      if (!elt) return;

      clickCount++;
      document.querySelector(".step_counter").innerHTML = `${clickCount}`;

      let rowValue = parseInt(elt.getAttribute("data-row"));
      let columnValue = parseInt(elt.getAttribute("data-column"));
      let index = elt.getAttribute("data-index");

      let currentData = gameCells[rowValue][columnValue];

      if (index == "bomb") {
         elt.classList.add("bomb");
         popupGameOver.style.display = "flex";
         return;
      }

      if (currentData.bombsCounts !== "") {
         currentData.status = "opened";

         elt.classList.remove("closed");
         elt.classList.add("opened");

         sendBoardUpdate();
         checkWin();
         return;
      }

      for (let x = -1; x <= 1; x++) {
         for (let y = -1; y <= 1; y++) {
            let GameRowValue = rowValue + x;
            let GameColumnValue = columnValue + y;

            if (
               GameRowValue >= 0 &&
               GameRowValue < row &&
               GameColumnValue >= 0 &&
               GameColumnValue < column
            ) {
               let targetCell = gameCells[GameRowValue][GameColumnValue];

               let CellsOpened = document.querySelector(
                  `[data-row="${GameRowValue}"][data-column="${GameColumnValue}"]`,
               );

               if (
                  targetCell.class !== "bomb" &&
                  targetCell.bombsCounts === ""
               ) {
                  targetCell.status = "opened";

                  if (CellsOpened) {
                     CellsOpened.classList.add("opened");
                     CellsOpened.classList.remove("closed");
                  }
               }
            }
         }
      }

      elt.classList.remove("closed");
      elt.classList.add("opened");
      currentData.status = "opened";

      sendBoardUpdate();
      checkWin();
   });
}
console.log(checkWin());
if (playerGrid) {
   playerGrid.addEventListener("mousedown", function (event) {
      const cell = event.target.closest(".cell");

      if (!cell) return;

      if (event.button === 2) {
         cell.classList.toggle("flag");
      }
   });
}

let timerStart = false;

if (playerGrid) {
   playerGrid.addEventListener("click", function () {
      if (!timerStart) {
         timerStart = true;
         init();
      }
   });
}

function ViewAllUsers(userlist) {
   let listUsers = ``;
   userlist.forEach((user) => {
      listUsers += `
      <div class="user-card">
            <div class="user-card__info">
               <div class="user-card__avatar">A</div>
               <div>
                  <h3>${user.login}</h3>
                  <p>${user.role}</p>
               </div>
            </div>

            <div class="user-card__actions">
               <button type="button" class="btn-admin" data-user-id="${user.id}" name="make-admin">Додати адмін права</button>
               <button type="button" class="btn-delete" data-user-id="${user.id}" name="delete-user">Видалити</button>
            </div>
         </div>
      `;
   });
   document.querySelector(".users-list").innerHTML = listUsers;
}
if (typeof userlist !== "undefined") {
   ViewAllUsers(userlist);
}

document.addEventListener("click", async function (event) {
   if (event.target.classList.contains("btn-admin")) {
      const userId = event.target.dataset.userId;

      const response = await fetch("/make-admin", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            id: userId,
         }),
      });

      const result = await response.json();
      console.log(result);
   }

   if (event.target.classList.contains("btn-delete")) {
      const userId = event.target.dataset.userId;

      const response = await fetch("/delete-user", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            id: userId,
         }),
      });

      const result = await response.json();
      console.log(result);
   }
});
const ButtonLogout = document.querySelector(".logout-link");
ButtonLogout.addEventListener("click", async function () {
   const response = await fetch("/logout-user", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
   });
   const result = await response.json();
   console.log(result);
});

// const ButtonGoLobby = document.querySelector(".btn-join");
// ButtonGoLobby.addEventListener("click", async function () {
//    const response = await fetch("/go-to-lobby", {
//       method: "POST",
//       headers: {
//          "Content-Type": "application/json",
//       },
//    });
//    const result = await response.json();
//    console.log(result);
// });

function getBoardFromDOM() {
   const cells = document.querySelectorAll(".grid .cell");
   const board = [];

   cells.forEach((cell) => {
      let status = cell.classList.contains("opened") ? "opened" : "closed";
      board.push({
         row: Number(cell.dataset.row),
         column: Number(cell.dataset.column),
         class: cell.dataset.index,
         bombsCounts: cell.dataset.number,
         status: status,
      });
   });

   return board;
}
getBoardFromDOM();
console.log(getBoardFromDOM());

function sendBoardUpdate() {
   socket.emit("first-player-board:update", {
      lobbyId: 1,
      board: gameCells,
      counter: clickCount,
      winner: checkWin(),
      timer,
   });
}
