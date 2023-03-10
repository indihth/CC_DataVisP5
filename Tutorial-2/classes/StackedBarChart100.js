class StackedBarChart100 {
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
    _dataTotal,
    _lineGraphColumnData = 0,
    _graphTitle = "Graph Title",
    _barsTitle = "Bars Title",
    _yAxisTitle = "Values",
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
    this.rounding = // what num to round to
      // default all values, inc data
      // replace all construstor options with an object
      // accepted in any order

      // TABLE COLUMN SETTINGS
      this.columnNames = _dataColumns1;
    this.columnData = this.data.getColumn(_dataColumns1);
    this.dataTotal = int(this.data.getColumn(_dataTotal));

    this.columnTitle = _labelColumn;
    this.columnLabels = this.data.getColumn(_labelColumn);
    this.lineGraphColumnData = int(this.data.getColumn(_lineGraphColumnData));
    // Seperate variable used to check if data for line chart was given
    this.lineDataFilled = _lineGraphColumnData;

    // TABLE TITLES
    this.graphTitle = _graphTitle;
    this.barsTitle = _barsTitle;
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
    // Sets number of ticks for the 100% axis to 5, gives even numbers
    this.numTicks100 = 5;   
    this.notchGap = this.height / this.numTicks;
    this.tickLength = 5;
    this.maxValue = 100;
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

  // METHODS

  render() {
    this.mapData(this.columnData, this.mappedData, this.maxValue);
    this.mapLineData(
      this.lineGraphColumnData,
      this.lineMappedData,
      this.maxLineValue
    );

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
        max = _data[x].toFixed();
      }
    }
    // for (let x = max; x < 10000000; x++) {
    //   if (x % this.numTicks == 0) {
    //     max = x;
    //     break;
    //   }
    // }
    return max;
  }

  /////////////////////////////////////////////
  // Scales values to display blocks using the full height of the chart
  /////////////////////////////////////////////
  mapData(_val, _max) {
    // make numbers more manageable by using _numberScale to divide
    // _array.forEach((element) => {
    //   element / this.numberScale;
    // });

    // for (let i = 0; i < _array.length; i++) {
    //   // maps each value to fit within the chart height and pushes into new array
    //   _name.push(map(_array[i], 0, _maxValue, 0, this.height));
    // }

    // get total from each stacked back and multiply by scale value (height / maxVal which is 100)

    return map(_val, 0, _max, 0, this.height);
  }

  mapLineData(_array, _name, _maxValue) {
    // make numbers more manageable by using _numberScale to divide
    _array.forEach((element) => {
      element / this.numberScale;
    });

    for (let i = 0; i < _array.length; i++) {
      // maps each value to fit within the chart height and pushes into new array
      _name.push(map(_array[i], 0, _maxValue, 0, this.height));
    }
  }

  barScaler(_bar, _total) {
    let scaleValue = this.height / _total;
    // console.log(scaleValue);
    return int(_bar * scaleValue);
  }

  /////////////////////////////////////////////
  // Draws each bar in the bar chart
  /////////////////////////////////////////////
  drawBars() {
    // Draw legend and translate to top right of graph
    push();
    translate(this.width + 50, -this.height + 20);
    this.drawLegend();
    pop();

    // Starts the bar drawing at the margin
    push();
    translate(this.margin, 0);
    // translate(this.margin + (this.barWidth * x) + (this.barGap * x), 0);

    // First loop to draw the bars
    for (let x = 0; x < this.data.getRowCount(); x++) {
      push();

      let barHeight = -this.dataTotal[x];
      // console.log(barHeight);

      // Second loop to draw the stacks of each bar
      for (let y = 0; y < this.columnNames.length; y++) {
        // Scale the array of column data at this point
        let current = this.columnNames[y];
        let height = -this.data.rows[x].obj[current];
        // console.log(height);
        fill(color(this.palette[y % this.palette.length]));
        rect(
          (this.barWidth + this.barGap) * x,
          0,
          this.barWidth,
          -this.mapData(height, barHeight)
        );
        translate(0, -this.mapData(height, barHeight));
      }
      translate(this.barGap * x, 0);
      pop();
    }
    pop();
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
          axisNum = ((this.maxLineValue / this.numTicks) * x).toFixed(); //round to whole nums
        } else {
          axisNum = (
            ((this.maxLineValue / this.numTicks) * x) /
            this.lineNumberScale
          ).toFixed(); //round to whole nums
        }

        if (axisNum > 0) {
          axisNum += "k";
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

  drawLegend() {
    push();
    for (let x = 0; x < this.columnNames.length; x++) {
      let nColour = x % this.palette.length;
      let legend = this.columnNames[x];
      fill(color(this.palette[nColour]));
      // stroke(255);
      // strokeWeight(1);
      noStroke();
      circle(0, 0, 10);
      textAlign(LEFT, CENTER);
      text(legend, 10, 1);
      translate(0, 30);
    }
    pop();
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

      if (axisNum > 0) {
        axisNum += "%";
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
