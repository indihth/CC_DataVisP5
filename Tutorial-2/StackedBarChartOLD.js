class StackedBarChartOLD {
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
    // replace 3 options with 1 array
    _dataColumn1,
    _dataColumn2,
    _dataColumn3,
    _graphTitle,
    _numberScale = 0,
  }) {
    // FROM CONSTRUCTOR
    this.height = _height;
    this.width = _width;
    this.posX = _posX;
    this.posY = _posY;
    this.data = Object.values(_data.getObject());
    this.labels = _labels;
    this.xRotate = _xRotate;
    this.rounding = // what num to round to
      // default all values, inc data
      // replace all construstor options with an object
      // accepted in any order

      // TABLE COLUMN SETTINGS
    // this.columnData1 = int(this.data.getColumn(_dataColumn1));
    // this.columnData2 = this.data.getRows();
    // this.columnData3 = int(this.data.getColumn(_dataColumn3));

    // this.columnLabels = this.data.getColumn(_labelColumn);
    this.graphTitle = _graphTitle;
    this.graphTitleSize = 20;
    this.numberScale = _numberScale;

    // MEASUREMENTS
    this.numBlocks = this.data.length;
    this.mappedData = [];
    this.margin = 20;
    this.barGap = 5;
    this.barWidth =
      (this.width - this.margin * 2 - this.barGap * (this.numBlocks - 1)) /
      this.numBlocks;
    // must generate num of ticks that fits evenly into maxValue, modulo
    this.numTicks = _numTicks;
    this.notchGap = this.height / this.numTicks;
    this.tickLength = 5;
    this.maxValue = this.calculateMax(this.data);

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

  // makeArray() {
  //   let data = this.columnData2;
  //   console.log(data[1].obj.Total_Cases);
  //   let temp = [];

  //   for (let i = 0; i < data.length; i++) {
  //     temp.push(data[i].obj.Total_Cases)
  //   }
  //   console.log(temp);
  // }

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
  mapData(_array) {
    // make numbers more manageable by using _numberScale to divide
    _array.forEach((element) => {
      element / this.numberScale;
    });

    for (let i = 0; i < _array.length; i++) {
      // maps each value to fit within the chart height and pushes into new array
      this.mappedData.push(map(_array[i], 0, this.maxValue, 0, this.height));
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
    let title = this.graphTitle; //use variable from table later

    push();
    translate(this.width / 2, -this.height - 30);
    fill(this.lightColour);
    noStroke(0);
    textSize(this.graphTitleSize);
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
      text(axisNum.toLocaleString("en-US"), -this.tickLength - 5, x * -this.notchGap);
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
