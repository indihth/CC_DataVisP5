let fruits = [
  { name: "apples", sales: 24 },
  { name: "oranges", sales: 20 },
  { name: "bananas", sales: 28 },
  { name: "mangos", sales: 34 },
  { name: "pinapples", sales: 52 },
];

// initialise array
let charts = [];

let table;
let data = [];

// preload() doesn't need to be called, it's done automatically in setup()
function preload() {
  table = loadTable('data/fruitSales.csv', 'csv', 'header');
}

function tidyData() {
  // loops through table contents and pushes objects into 'data[]'
  for (let x = 0; x < table.getRowCount(); x++) {
    data.push(table.rows[x].obj);
  }
  console.log(data);
}

function setup() {
  tidyData();

  createCanvas(500, 500);
  background(200);
}

function draw() {
  background(200);
}

// next week: axis' and coloured bar charts with numbers  
