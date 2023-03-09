class BarChart {
  // constructor defines everything that's in the object
  constructor(
    _height,
    _width,
    _posX,
    _posY,
    _data,
    _numTicks,
    _labels,
    _xRotate = 0,
    _columnLabel,
    _rowLabel
  ) {
    
    // FROM CONSTRUCTOR
    this.height = _height;
    this.width = _width;
    this.posX = _posX;
    this.posY = _posY;
    this.data = _data;
    this.labels = _labels;
    this.xRotate = _xRotate;
    this.rounding = // what num to round to

    // default all values, inc data
    // replace all construstor options with an object
    // accepted in any order

    // TABLE COLUMN SETTINGS
    this.columnLabel =  //
    this.rowLabel =  //
    this.graphTitle = //

    // MEASUREMENTS
    this.numBlocks = this.data.length;
    this.mappedData = [];
    this.margin = 20;
    this.barGap = 5;
    this.maxValue = this.roundMax(
      // Reduce uses a callback function on each element of the array
      this.data.reduce((a, b) => Math.max(a, b), -Infinity)
    );
    this.barWidth =
      (this.width - this.margin * 2 - this.barGap * (this.numBlocks - 1)) /
      this.numBlocks;
    // must generate num of ticks that fits evenly into maxValue, modulo
    this.numTicks = 6;
    this.notchGap = this.height / this.numTicks;
    this.tickLength = 5;

    // COLOUR PALETTE
    this.fadedColour = "#534D4D";
    this.lightColour = "#FCF8F5";
    this.palette = ["#F15060", "#F68A8D", "#F5DCDD"]; // pink3, pink2, pink1, white

    // TEXT SIZES
    // adjust text size with chart size and num of elements displaying, less elements = larger text
    this.xText = this.width * 0.03;
    this.yText = this.height * 0.03;
  }

  // METHODS

  // function keyword isn't needed in class
  render() {
    this.mapData(this.data);

    push();
    translate(this.posX, this.posY);
    this.xAxisLines();
    this.drawBars();
    this.chartTitle();
    this.verticalAxis();
    this.horizontalAxis();
    this.notches();
    this.yLabels();
    this.xLabels();
    pop();
  }

  tidy() {
    for (let x = 0; x < table.getRowCount(); x++) {
      data.push(table.rows[x].obj.Total_Cases / 1000000);
    }
    for (let x = 0; x < table.getRowCount(); x++) {
      titles.push(table.rows[x].obj.Country);
    }
  }

  // data.rows[x].obj.Total (convert to property)
  // data.rows[x].obj[this.yValue]

  generateNumTicks() {
    for (let x = 2; x < 50; x++) {
      if (this.maxValue % 20 == 0) {
        // if (this.maxValue % x == 0 && this.maxValue % 20 == 0) {
        console.log(x);
        return x;
      }
    }
  }

  // add 1 to max num until divisiable by numticks
  // and divisible by e.g 100, 1000 so nums are in 100's or 1000's
  // this.rounding = 100
  // max+i % numticks == 0 && max+i % this.rounding == 0

  // how to set default params in js
  // don't worry about order, pass object with properties 
  // that a class can parse
  // array sorting - sort bars smallest to highest
  // make methods and params to auto 'extract' 

  // standard deviation, normalisation - charts
  // use formulas

  roundMax(_num) {
    let roundedNum = Math.ceil(_num / 10) * 10;

    for (let x = 0; x < 30; x++) {
      roundedNum++;
      if (roundedNum % 20 == 0) {
        return roundedNum;
      }
    }
  }

  /////////////////////////////////////////////
  // Scales values to display blocks using the full height of the chart
  /////////////////////////////////////////////
  mapData(_array) {
    // finds the max value in the array
    let maxVal = max(_array);
    let dif = this.maxValue - maxVal; // difference between real max and the rounded RoundMax() max
    // console.log(dif)
    for (let i = 0; i < _array.length; i++) {
      // maps each value to fit within the chart height and pushes into new array
      this.mappedData.push(map(_array[i], 0, maxVal, 0, this.height - dif));
    }
  }

  /////////////////////////////////////////////
  // Draws each bar in the bar chart
  /////////////////////////////////////////////
  drawBars() {
    noStroke();
    for (let x = 0; x < this.numBlocks; x++) {
      let barPos = x * this.barWidth + x * this.barGap + this.margin; // add master gap that increments
      // uses the Scaler() method to scale the value and store it in a variable
      let currentBar = -this.mappedData[x];

      fill(color(this.palette[x % this.palette.length]));
      rect(barPos, 0, this.barWidth, currentBar);
    }
  }

  chartTitle() {
    let title = "Covid Cases in Millions"; //use variable from table later

    push();
    translate(this.width / 2, -this.height - 30);
    fill(this.lightColour);
    noStroke(0);
    textSize(20);
    textFont("Helvetica");
    textAlign(CENTER, CENTER);
    text(title, 0, 0);
    pop();
  }

  xLabels() {
    for (let x = 0; x < this.numBlocks; x++) {
      let barPos = x * this.barWidth + x * this.barGap + this.margin;
      let midPoint = this.barWidth / 2;
      let gap = midPoint + this.barGap;
      let pos = this.margin + gap * (x + 1);

      push();
      // rotate and change translation to fit if xRotate is on
      // automate rotation when barW is under x size?
      if (this.xRotate == 1) {
        translate(barPos + this.barWidth / 2, 15);
        textAlign(LEFT, CENTER);
        rotate(PI / 2);
        text(this.titles[x], 0, 0);
      } else {
        translate(barPos + this.barWidth / 2, 15);
        textAlign(CENTER, CENTER);
        text(this.titles[x], 0, 0);
      }

      pop();
    }
  }

  yLabels() {
    for (let x = 0; x < this.numTicks + 1; x++) {
      let axisNum = round((this.maxValue / this.numTicks) * x); //round to whole nums
      // scale the numbers
      // if(this.labels == 1){
      fill(this.lightColour);
      noStroke(0);
      textSize(this.yText);
      textFont("Helvetica");
      textAlign(RIGHT, CENTER);
      text(axisNum, -this.tickLength - 5, x * -this.notchGap);
      // }
    }
  }

  /////////////////////////////////////////////
  // Draws axis lines for chart with option to display number labels
  /////////////////////////////////////////////
  verticalAxis() {
    noFill();
    stroke(this.lightColour);
    strokeWeight(1);
    line(0, 0, 0, -this.height);
  }

  horizontalAxis() {
    // draws just the horizontal line
    noFill();
    stroke(this.lightColour);
    strokeWeight(1);
    line(0, 0, this.width, 0);
  }

  notches() {
    for (let x = 0; x < this.numTicks + 1; x++) {
      strokeWeight(1);
      stroke(this.lightColour);
      line(0, -x * this.notchGap, -this.tickLength, -x * this.notchGap);
    }
  }

  xAxisLines() {
    for (let x = 0; x < this.numTicks + 1; x++) {
      strokeWeight(1);
      stroke(this.fadedColour);
      line(0, -x * this.notchGap, this.width, -x * this.notchGap);
    }
  }
}
