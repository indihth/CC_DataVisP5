class HorizontalBarChart {
  // constructor defines everything that's in the object
  constructor({
    _height = 400,
    _width = 400,
    _posX = 70,
    _posY = 400,
    _data,
    _numTicks = 7,
    _labels = 0,
    _xRotate = 0,
    _labelColumn,
    _dataColumn,
    _graphTitle = "Graph Title",
    _xAxisTitle = "Values",
    _numberScale = 0,
  }) {
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
      this.columnData = int(this.data.getColumn(_dataColumn));
    this.columnLabels = this.data.getColumn(_labelColumn);

    this.columnTitle = _labelColumn;
    this.xAxisTitle = _xAxisTitle;
    this.graphTitle = _graphTitle;
    this.graphTitleSize = 25;
    this.numberScale = _numberScale;

    // MEASUREMENTS
    this.numBlocks = this.columnData.length;
    this.mappedData = [];
    this.margin = 20;
    this.barGap = 5;
    this.barWidth =
      (this.height - this.margin * 2 - this.barGap * (this.numBlocks - 1)) /
      this.numBlocks;
    // must generate num of ticks that fits evenly into maxValue, modulo
    this.numTicks = _numTicks;
    this.notchGap = this.width / this.numTicks;
    this.tickLength = 5;
    this.maxValue = this.calculateMax();

    // COLOUR PALETTE
    this.fadedColour = "#534D4D";
    this.lightColour = "#FCF8F5";
    this.palette = ["#F15060", "#F68A8D", "#F5DCDD"]; // pink3, pink2, pink1, white

    // TEXT SIZES
    // adjust text size with chart size and num of elements displaying, less elements = larger text
    this.xText = this.width * 0.03;
    this.yText = this.height * 0.03;
    this.axisTitle = 14;
  }

  // METHODS

  render() {
    this.mapData(this.columnData);

    push();
    translate(this.posX, this.posY);
    this.chartTitle();
    this.yAxisLines();
    this.drawBars();
    this.verticalAxis();
    this.horizontalAxis();
    this.notches();
    this.xLabels();
    this.yLabels();
    pop();
  }

  calculateMax() {
    let max = 0;

    for (let x = 0; x < this.columnData.length; x++) {
      if (this.columnData[x] > max) {
        max = this.columnData[x];
      }
    }

    for (let x = max; x < 10000000; x++) {
      if (x % this.numTicks == 0) {
        max = x;
        break;
      }
    }
    return max;
  }

  /////////////////////////////////////////////
  // Scales values to display blocks using the full height of the chart
  /////////////////////////////////////////////
  mapData(_array) {
    // finds the max value in the array
    // let maxVal = max(_array);
    // let dif = this.maxValue - maxVal; // difference between real max and the rounded RoundMax() max
    // console.log(dif)
    for (let i = 0; i < _array.length; i++) {
      // maps each value to fit within the chart height and pushes into new array
      this.mappedData.push(map(_array[i], 0, this.maxValue, 0, this.width));
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
      rect(0, -barPos - this.barWidth, -currentBar, this.barWidth);
    }
  }

  chartTitle() {
    let title = this.graphTitle; //use variable from table later

    fill(this.lightColour);
    noStroke(0);
    textFont("Helvetica");
    textAlign(LEFT, CENTER);

    push();
    translate(0, -this.height - 40);
    textSize(this.graphTitleSize);
    text(title, 0, 0);
    pop();
  }

  yLabels() {
    // Draws y axis title
    push();
    translate(-80, -this.height / 2);
    rotate(radians(-90));
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.axisTitle);
    text(this.columnTitle, 0, 0);
    pop();

    // Draws y axis text
    for (let x = 0; x < this.numBlocks; x++) {
      let barPos = x * this.barWidth + x * this.barGap + this.margin;
      let midPoint = this.barWidth / 2;
      let gap = midPoint + this.barGap;
      let pos = this.margin + gap * (x + 1);

      textSize(this.xText);

      push();

      translate(-15, -(barPos + this.barWidth / 2));
      textAlign(RIGHT, CENTER);
      text(this.columnLabels[x], 0, 0);

      pop();
    }
  }

  xLabels() {
    // Draws column title
    fill(this.lightColour);
    noStroke(0);
    textAlign(CENTER, CENTER);
    textSize(this.axisTitle);
    let pos = 45;

    // If labels are rotated display lower
    if (this.xRotate == 1) {
      pos += 15;
    }

    text(this.xAxisTitle, this.width / 2, pos);
    for (let x = 0; x < this.numTicks + 1; x++) {
      let axisNum;

      if (this.numberScale == 0) {
        //divide data values if a scale number is set e.g 1000's to 1
        axisNum = (this.maxValue / this.numTicks) * x; //round to whole nums
      } else {
        axisNum = (
          ((this.maxValue / this.numTicks) * x) /
          this.numberScale
        ).toFixed(); //round to whole nums
      }
      // scale the numbers
      // if(this.labels == 1){

      textSize(this.yText);
      textFont("Helvetica");
      textAlign(CENTER, CENTER);
      text(axisNum, x * this.notchGap, this.tickLength + 10);
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
      line(x * this.notchGap, 0, x * this.notchGap, this.tickLength);
    }
  }

  yAxisLines() {
    for (let x = 0; x < this.numTicks + 1; x++) {
      strokeWeight(1);
      stroke(this.fadedColour);
      line(x * this.notchGap, 0, x * this.notchGap, -this.height);
    }
  }
}
