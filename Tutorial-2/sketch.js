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
  table = loadTable("data/covid_worldwide.csv", "csv", "header");
  table2 = loadTable("data/covid.csv", "csv", "header");
  usa = loadTable("data/covidUSA.csv", "csv", "header");
  ireland = loadTable("data/age-sexIRL.csv", "csv", "header");

  table3 = loadTable("data/langReport.csv", "csv", "header");

}


function setup() {
  createCanvas(1500, 1000);
  
  charts.push(new BarChart({
    _height: 300, 
    _width: 350, 
    // _posX: 100, 
    // _posY: 400, 
     _posX: 600, 
    _posY: 400,
    _data: table2, 
    _labelColumn: "Country",
    _dataColumn: "Total Cases",
    _lineGraphColumnData: "Population",
    _graphTitle: "Country Cases and Population",
    _yAxisTitle: "Cases in millions",
    _linesTitle: "Populations in billions",
    _numTicks: 4,
    _numberScale: 1000000,
    _lineNumberScale: 1000000000
  }));

  charts.push(new StackedBarChart100({
    _height: 300, 
    _width: 350, 
    _posX: 100, 
    _posY: 400, 
    // _posX: 600, 
    // _posY: 400, 
    _height: 300, 
    _data: ireland, 
    _labelColumn: "Age Groups",
    _dataColumns1: ["Female", "Male"],
    _dataTotal: "Total",
    _lineGraphColumnData: "populationin1000sF",
    _linesTitle: "Female Population in 1000's",
    _graphTitle: "Male vs. Female Covid Cases",
    _yAxisTitle: "Cases in Millions",
    _numTicks: 4,
    _xRotate: 1
  }));

  charts.push(new HorizontalBarChart({
    _height: 400, 
    _width: 350, 
    _posX: 1100, 
    _posY: 500, 
    _data: table2, 
    _labelColumn: "Country",
    _dataColumn: "Total Cases",
    _graphTitle: "Horizontal",
    _xAxisTitle: "X Axis Title",
    _numTicks: 7,
    _numberScale: 1000000 // 1:1 million
  }));


}

function draw() {
  background(bgColour); //text looks blocky if background() is in setup()

  charts[0].render();
  charts[1].render();
  charts[2].render();
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
