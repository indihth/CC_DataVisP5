const fruits = [10, 20, 43, 10, 30];
const shops = [210, 70, 40, 90, 90];

// initialise array
let charts = [];

let table;
let data = [];
let titles = [];

let bgColour = "#363030";

// preload() doesn't need to be called, it's done automatically in setup()
function preload() {
  table = loadTable("data/covid.csv", "csv", "header");
}

function tidy() {
  for (let x = 0; x < table.getRowCount(); x++) {
    data.push(table.rows[x].obj.Total_Cases / 1000000);
  }
  for (let x = 0; x < table.getRowCount(); x++) {
    titles.push(table.rows[x].obj.Country);
  }
}



function setup() {
  tidy();
  createCanvas(500, 500);

  charts.push(new BarChart(300, 350, 70, 400, data, titles, 7, 1));

  // charts[0].generateNumTicks();
}

function draw() {
  background(bgColour); //text looks blocky if background() is in setup()

  charts[0].render();
}

///////////////////////////////////////////
// Barchart must be easy to read
//
// round line ends
//
// round axis numbers to full numbers
// 1605, round up to even number (modulo 5 + 100)
//
// adding colour palets for each charts
// how to spread 4 colours across more than 4 bars
// MODULO for cycling through things
// 12 % 4 = 0
//
// data.length % 3 = 0 (use x colour)
///////////////////////////////////////////
