class StackedChart100 {
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
    _dataColumns1,
    _dataColumns2,
    _lineGraphColumnData = 0,
    _graphTitle = "Graph Title",
    _barsTitle = "Bars Title",
    _linesTitle = "Lines Title",
    _numberScale = 0,
    _lineNumberScale = 0,
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
    this.columnNames = _dataColumns1;
    this.columnData = this.data.getColumn(_dataColumns1);
    this.columnData2 = this.data.getColumn(_dataColumns2);
    this.dataTotal = int(this.data.getColumn("total"));

    this.columnLabels = this.data.getColumn(_labelColumn);
    this.lineGraphColumnData = int(this.data.getColumn(_lineGraphColumnData));
    this.graphTitle = _graphTitle;
    this.barsTitle = _barsTitle;
    this.linesTitle = _linesTitle;
    this.graphTitleSize = 20;
    this.numberScale = _numberScale;
    this.lineNumberScale = _lineNumberScale;

    // MEASUREMENTS
    this.numBlocks = this.columnData.length;
    this.mappedData = [];
    this.mappedData2 = [];
    this.lineMappedData = [];
    this.margin = 20;
    this.barGap = 5;
    this.barWidth =
      (this.width - this.margin * 2 - this.barGap * (this.numBlocks - 1)) /
      this.numBlocks;
    // must generate num of ticks that fits evenly into maxValue, modulo
    this.numTicks = _numTicks;
    this.notchGap = this.height / this.numTicks;
    this.tickLength = 5;
    this.maxValue = this.calculateMax(this.dataTotal);
    this.maxLineValue = this.calculateMax(this.lineGraphColumnData);

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

  render() {
    this.mapData(this.columnData, this.mappedData, this.maxValue);
    this.mapData(this.columnData2, this.mappedData2, this.maxValue);

    push();
    translate(this.posX, this.posY);
    this.xAxisLines();
    this.drawBars();
    this.chartTitle();
    this.axis();

    this.notches();
    this.yLabels();
    this.xLabels();

    if (this.lineGraphColumnData == "") {
      // draw line graph and axis
      console.log("testing");
    }
    this.drawLineGraph();
    pop();
  }

  calculateMax(_data) {
    let max = 0;

    for (let x = 0; x < _data.length; x++) {
      if (_data[x] > max) {
        max = _data[x];
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
  mapData(_val) {
    // make numbers more manageable by using _numberScale to divide
    // _array.forEach((element) => {
    //   element / this.numberScale;
    // });

    // for (let i = 0; i < _array.length; i++) {
    //   // maps each value to fit within the chart height and pushes into new array
    //   _name.push(map(_array[i], 0, _maxValue, 0, this.height));
    // }

    return map(_val, 0, this.height, 0, this.height);
  }

  /////////////////////////////////////////////
  // Draws each bar in the bar chart
  /////////////////////////////////////////////
  drawBars() {
    push();
    translate(this.margin, 0);
    // translate(this.margin + (this.barWidth * x) + (this.barGap * x), 0);
    for (let x = 0; x < this.data.getRowCount(); x++) {
      push();
      let barHeight = int(-this.data.rows[x].obj[this.columnNames]);

      for (let y = 0; y < this.columnNames.length; y++) {
        
        let current = this.columnNames[y];
        let height = (-this.data.rows[x].obj[current]);
        fill(color(this.palette[y % this.palette.length]));
        rect((this.barWidth + this.barGap) * x, 0, this.barWidth, this.mapData(height));
        translate(0, this.mapData(height));
      }
      translate(this.barGap * x, 0);
      pop();

    }
    pop();
  }

  drawLineGraph() {
    // DRAW DOTS
    for (let x = 0; x < this.numBlocks; x++) {
      let barPos = x * this.barWidth + x * this.barGap + this.margin;
      push();
      translate(barPos + this.barWidth / 2, -this.lineMappedData[x]);
      fill(255);
      circle(0, 0, 8);
      pop();
    }

    // DRAW LINES
    for (let x = 0; x < this.numBlocks - 1; x++) {
      let barPos = x * this.barWidth + x * this.barGap + this.margin;
      let endX = this.barWidth + 5;
      let endY = -(this.lineMappedData[x + 1] - this.lineMappedData[x]);
      push();
      translate(barPos + this.barWidth / 2, -this.lineMappedData[x]);
      stroke(255);
      strokeWeight(1.5);
      line(0, 0, endX, endY);
      pop();
    }

    // DRAW AXIS
    stroke(this.lightColour);
    line(this.width, 0, this.width, -this.height);

    // DRAW NOTCHES
    for (let x = 0; x < this.numTicks + 1; x++) {
      strokeWeight(1);
      stroke(this.lightColour);
      line(
        this.width,
        -x * this.notchGap,
        this.width + this.tickLength,
        -x * this.notchGap
      );
    }

    // DRAW LABELS
    for (let x = 0; x < this.numTicks + 1; x++) {
      let axisNum;

      if (this.lineNumberScale == 0) {
        //divide data values if a scale number is set e.g 1000's to 1
        axisNum = (this.maxLineValue / this.numTicks) * x; //round to whole nums
      } else {
        axisNum = (
          ((this.maxLineValue / this.numTicks) * x) /
          this.lineNumberScale
        ).toFixed(2); //round to whole nums
      }

      fill(this.lightColour);
      noStroke(0);
      textSize(this.yText);
      textFont("Helvetica");
      textAlign(RIGHT, CENTER);
      text(axisNum, this.width + 30, x * -this.notchGap);
      // }
    }
  }

  chartTitle() {
    let title = this.graphTitle; //use variable from table later

    fill(this.lightColour);
    noStroke(0);
    textFont("Helvetica");
    textAlign(CENTER, CENTER);

    push();
    translate(this.width / 2, -this.height - 30);
    textSize(this.graphTitleSize);
    text(title, 0, 0);
    pop();
  }

  xLabels() {
    for (let x = 0; x < this.numBlocks; x++) {
      let barPos = x * this.barWidth + x * this.barGap + this.margin;
      let midPoint = this.barWidth / 2;
      let gap = midPoint + this.barGap;
      let pos = this.margin + gap * (x + 1);

      textSize(this.xText);

      push();
      // rotate and change translation to fit if xRotate is on
      // automate rotation when barW is under x size?
      if (this.xRotate == 1) {
        translate(barPos + this.barWidth / 2, 10);
        textAlign(LEFT, CENTER);
        rotate(PI / 3.5);
        text(this.columnLabels[x], 0, 0);
      } else {
        translate(barPos + this.barWidth / 2, 15);
        textAlign(CENTER, CENTER);
        text(this.columnLabels[x], 0, 0);
      }

      pop();
    }
  }

  yLabels() {
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
  axis() {
    // draws just the horizontal line
    stroke(this.lightColour);
    strokeWeight(1);
    line(0, 0, this.width, 0);
    line(0, 0, 0, -this.height);
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
