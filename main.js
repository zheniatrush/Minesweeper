var row = 8;
var column = 8;
var counter = 0;
var gameCells = [];
function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min) + min); // Максимум не включается, минимум включается
}
var bombs = [];
let bomb = 0;
do {
   var bombPosition = getRandomInt(0, row * column);
   bomb++;
   if (!bombs.includes(bombPosition)) {
      bombs.push(bombPosition);
   }
} while (bomb < 10);
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
let gameElemets = document.querySelectorAll(".cell");
gameElemets.forEach(function (element) {
   element.addEventListener("mousedown", function (event) {
      if (event.button === 2) {
         event.target.classList.toggle("flag");
      }
   });
});
var cells = document.querySelectorAll(".cell");

cells.forEach(function (cell) {
   cell.addEventListener("click", function (event) {
      var gameCellsRow = event.target.closest("[data-row]");
      var gameCellsColumn = event.target.closest("[data-column]");
      let rowValue = parseInt(gameCellsRow.getAttribute("data-row"));
      let columnValue = parseInt(gameCellsColumn.getAttribute("data-column"));
      var elt = event.target.closest("[data-index]");
      var index = elt.getAttribute("data-index");
      gameCells.forEach((row) => {
         if (index == "bomb") {
            elt.classList.add("bomb");
            // location.reload();
         } else {
            for (let x = -1; x <= 1; x++) {
               for (let y = -1; y <= 1; y++) {
                  // console.log("хуй", event.target);
                  // console.log("пизда", x);
                  // console.log("залупа", row);
                  // console.log("пеніс", rowValue);
                  // console.log("жопа", columnValue);

                  let GameRowValue = rowValue + x;
                  let GameColumnValue = columnValue + y;
                  console.log(GameRowValue);
                  let CellsOpened = document.querySelector(
                     `[data-row="${GameRowValue}"][data-column="${GameColumnValue}"]`
                  );
                  console.log(CellsOpened);
                  if (
                     gameCells[rowValue + x][columnValue + y].class != "bomb"
                  ) {
                     CellsOpened.classList.add("opened");
                  }
               }
            }
            elt.classList.add("opened");
         }
      });
   });
});
