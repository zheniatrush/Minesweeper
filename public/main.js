min = 0;
hour = 0;
//Оставляем вашу функцию
function init() {
   sec = 0;
   setInterval(tick, 1000);
}

//Основная функция tick()
function tick() {
   sec++;
   if (sec >= 60) {
      //задаем числовые параметры, меняющиеся по ходу работы программы
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
function generateCells(Cells) {
   let template = ``;
   Cells.forEach((row) => {
      row.forEach((Cell) => {
         template += `<div class="cell size closed" data-row="${Cell.row}" data-column="${Cell.column}" data-index="${Cell.class}" data-number="${Cell.bombsCounts}">${Cell.bombsCounts}</div>`;
         document.querySelector(".grid").innerHTML = template;
      });
   });
}
generateCells(gameCells);

var cells = document.querySelectorAll(".cell");
var popupGameOver = document.querySelector(".game_over.lost");
var popupGameWin = document.querySelector(".game_over.win");
function checkWin() {
   const closedCells = document.querySelectorAll(".closed");
   if (closedCells.length === bombs.length) {
      popupGameWin.style.display = "flex";
      document.querySelector(".steps").innerHTML =
         `Кількість кроків: ${clickCount}`;
   }
}
function restartGame() {
   location.reload();
}
cells.forEach(function (element) {
   element.addEventListener("mousedown", function (event) {
      if (event.button === 2) {
         event.target.classList.toggle("flag");
      }
   });
});
let timerStart = false;
cells.forEach(function (timerEvent) {
   timerEvent.addEventListener(
      "click",
      function (timer) {
         if (!timerStart) {
            timerStart = true;
            init();
         }
      },
      { once: true },
   );
});
let clickCount = 0;
cells.forEach(function (cell) {
   cell.addEventListener("click", function (event) {
      clickCount++;
      document.querySelector(".step_counter").innerHTML = `${clickCount}`;
      var elt = event.target.closest(".cell");
      let rowValue = parseInt(elt.getAttribute("data-row"));
      let columnValue = parseInt(elt.getAttribute("data-column"));
      var index = elt.getAttribute("data-index");
      let currentData = gameCells[rowValue][columnValue];
      if (index == "bomb") {
         elt.classList.add("bomb");
         popupGameOver.style.display = "flex";
      } else {
         if (currentData.bombsCounts !== "") {
            elt.classList.remove("closed");
            elt.classList.add("opened");
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
                     CellsOpened.classList.add("opened");
                     CellsOpened.classList.remove("closed");
                     checkWin();
                  }
               }
            }
         }
         elt.classList.remove("closed");
         elt.classList.add("opened");
         checkWin();
      }
   });
});

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
ViewAllUsers(userlist);

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
