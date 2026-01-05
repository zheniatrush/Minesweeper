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
let i = 0;
do {
   var bomba = getRandomInt(0, row * column);
   i++;
   if (!bombs.includes(bomba)) {
      bombs.push(bomba);
   }
} while (i < 10);
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
console.log(gameCells);
for (let i = 0; i < row; i++) {
   for (let j = 0; j < column; j++) {
      if (gameCells[i][j].class == "bomb") {
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
         console.log(bombCount);
         for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
               if (i + x >= 0 && i + x < row && j + y >= 0 && j + y < column) {
                  if (gameCells[i + x][j + y].class != "bomb") {
                     gameCells[i][j].bombsCounts = bombCount;
                  }
               }
            }
         }
      }
   }
}
function generateCells(Cells) {
   let template = ``;
   Cells.forEach((row) => {
      row.forEach((Cell) => {
         template += `<div class="cell size closed" data-row="${Cell.row}" data-column="${Cell.column}" data-index="${Cell.class}">${Cell.bombsCounts}</div>`;
         document.querySelector(".grid").innerHTML = template;
      });
   });
}
generateCells(gameCells);
console.log(gameCells[0][0 + 1]);

var cells = document.querySelectorAll(".cell");
cells.get;
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
         } else {
            elt.classList.add("opened");
            for (let i = -1; i <= 1; i++) {
               for (let j = -1; j <= 1; j++) {
                  if (
                     rowValue + i >= 0 &&
                     rowValue + i < row &&
                     columnValue + j >= 0 &&
                     columnValue + j < column
                  ) {
                  }
               }
            }
         }
      });
   });
});
