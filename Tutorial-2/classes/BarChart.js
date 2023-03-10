class BarChart {
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
    _lineGraphColumnData = 0,
    _graphTitle = "Graph Title",
    _yAxisTitle = "Y Values",
    _linesTitle = "Line Graph Title",
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

    // TABLE COLUMN SETTINGS
    this.columnData = int(this.data.getColumn(_dataColumn));
    this.columnLabels = this.data.getColumn(_labelColumn);
    this.lineGraphColumnData = int(this.data.getColumn(_lineGraphColumnData));
    // Seperate variable used to check if data for line chart was given
    this.lineDataFilled = _lineGraphColumnData;

    // Line graph not draw if value has defaulted to 0
    this.columnTitle = _labelColumn;
    this.graphTitle = _graphTitle;

    this.yAxisTitle = _yAxisTitle;
    this.linesTitle = _linesTitle;
    this.numberScale = _numberScale;
    this.lineNumberScale = _lineNumberScale;

    // MEASUREMENTS
    this.numBlocks = this.columnData.length;
    this.mappedData = [];
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
    this.maxValue = this.calculateMax(this.columnData);
    this.maxLineValue = this.calculateMax(this.lineGraphColumnData);

    // COLOUR PALETTE
    this.fadedColour = "#534D4D";
    this.lightColour = "#FCF8F5";
    this.palette = ["#F15060", "#F68A8D", "#F5DCDD"]; // pink3, pink2, pink1, white

    // TEXT SIZES - scales text to size of chart
    this.graphTitleSize = 25;
    this.axisTitle = 14;
    this.xText = this.width * 0.03;
    this.yText = this.height * 0.03;
  }

  // beginShape()
  // loop through points
  // endShape()
  // METHODS

  render() {
    this.mapData(this.columnData, this.mappedData, this.maxValue);
    this.mapData(
      this.lineGraphColumnData,
      this.lineMappedData,
      this.maxLineValue
    );
    // this.mapLineData(this.lineGraphColumnData);

    push();
    translate(this.posX, this.posY);
    this.xAxisLines();
    this.drawBars();
    this.chartTitle();
    this.axis();

    this.notches();
    this.yLabels();
    this.xLabels();

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
  mapData(_array, _name, _maxValue) {
    // make numbers more manageable by using _numberScale to divide
    _array.forEach((element) => {
      element / this.numberScale;
    });

    for (let i = 0; i < _array.length; i++) {
      // maps each value to fit within the chart height and pushes into new array
      _name.push(map(_array[i], 0, _maxValue, 0, this.height));
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

  drawLineGraph() {
      // if no line data was given, then none of the line graphs elements will be drawn
    if (this.lineDataFilled == 0) {
      return;
    } else {
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
      // Draws y axis title
      push();
      translate(this.width + 50, -this.height / 2);
      rotate(radians(90));
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(this.axisTitle);
      text(this.linesTitle, 0, 0);
      pop();
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

  xLabels() {
    // Draws column title
    textAlign(CENTER, CENTER);
    textSize(this.axisTitle);
    let pos = 45;

    // If labels are rotated display lower
    if (this.xRotate == 1) {
      pos += 15;
    }

    text(this.columnTitle, this.width / 2, pos);

    // Draws column text
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
    // Draws y axis title
    push();
    translate(-40, -this.height / 2);
    rotate(radians(-90));
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.axisTitle);
    text(this.yAxisTitle, 0, 0);
    pop();

    // Draws y axis text
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
