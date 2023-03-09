const fruits = [10, 20, 43, 10, 30];
const shops = [210, 70, 40, 90, 90];

// initialise array
let charts = [];

function setup() {
  createCanvas(500, 500);
  background(200);

 

  // loop push objects into array
  // for (let x = 0; x < 100; x++) {
  //   // creates new BarChart object with a random value for height
  //   // charts.push(new BarChart(Math.floor(Math.random() * x)))

  //   // with p5 random()
  //   let _randomNum = Math.floor(random(0, 400));

  //   charts.push(new BarChart(_randomNum));
  // }

    
  charts.push(new BarChart(200, 200, 50, 250, fruits))
  charts.push(new BarChart(200, 200, 50, 470, shops))
}

function draw() {
  charts[0].render();
  charts[1].render();
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