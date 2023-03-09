class BarChart {
  // constructor defines everything that's in the object
  constructor(_height, _width, _posX, _posY, _data, _numTicks) {
    // makes height of object value that user passed in _height
    this.height = _height;
    this.width = _width;
    this.posX = _posX;
    this.posY = _posY;
    this.data = _data;
    this.numBlocks = this.data.length;

    this.margin = 10;
    this.barGap = 20;

    // Reduce uses a callback function on each element of the array
    // this.maxValue = this.data.reduce((a, b) => a + b, 0);
    this.maxValue = this.RoundMax(
      this.data.reduce((a, b) => Math.max(a, b), -Infinity)
    );

    // must generate num of ticks that fits evenly into maxValue, modulo
    this.numTicks = this.maxValue ;



    this.barWidth =
      (this.width - this.margin * 2 - (this.numBlocks - 1) * this.barGap) /
      this.numBlocks;

    // Axis tick variables
    this.numNotch = 5;
    this.numTicks = 5;
    this.notchGap = this.height / this.numNotch;
    this.numGap = this.maxValue / this.numNotch;
    this.tickLength = 10;
  }

  // METHODS

  // function keyword isn't needed in class
  render() {
    push();
    translate(this.posX, this.posY);

    this.DrawBars();
    this.VerticalAxis();
    // this.HorizontalAxis();

    pop();
    // console.log(this.maxValue)
  }

  /////////////////////////////////////////////
  // Find increment and adjust axis numbers
  /////////////////////////////////////////////
  // round max num to nearest 10 OR to num that's divisible by numTicks
  // use rounded num as scaler ratio and for axis nums
  // num that is divisible by notchNum

  // num = 2701
  // loops until number found that is divisible by numNotch e.g 7
  
  RoundMax(_num) {
    
    for (let x = _num; (x % numNotch) == 0; x++) {
      let maxNum = x;   //might need a -1 after x
    }

    // let roundedNum = Math.ceil(_num / 10) * 10;

    // if (roundedNum == _num) {
    //   return roundedNum + 10;
    // }
    return roundedNum;
  }

  /////////////////////////////////////////////
  // Scales values to display blocks using the full height of the chart
  /////////////////////////////////////////////
  Scaler(_num) {
    // Finds the ratio that each value should be scaled at by using
    // the charts height and the highest value in the array
    // use maping ??
    let scaleValue = this.height / this.maxValue;

    // returns the parameter (arguement?) multiplied by the scaling ratio
    return _num * scaleValue;
  }

  /////////////////////////////////////////////
  // Draws each bar in the bar chart
  /////////////////////////////////////////////
  DrawBars() {
    noStroke();

    for (let x = 0; x < this.data.length; x++) {
      // add master gap that increments
      let gap = x * (this.barGap + this.barHeight);

      // uses the Scaler() method to scale the value and store it in a variable
      let currentBar = this.Scaler(-this.data[x]);

      fill(190, 50, 0);
      rect(x * this.notchGap, 0, this.barWidth, currentBar);
    }
  }

  /////////////////////////////////////////////
  // Draws axis lines for chart with option to display number labels
  /////////////////////////////////////////////
  VerticalAxis() {
    // drawing y axis
    // translate(this.posX, this.posY);
    angleMode(DEGREES);
    // rotate(270);

    stroke(20, 50, 100);
    strokeWeight(2);
    line(0, 0, 0, -this.height);
    stroke(100);

    // drawing notches on y axis line
    for (let i = 0; i < this.numTicks + 1; i++) {
      stroke(1);
      line(0, i * -this.notchGap, -this.tickLength, i * -this.notchGap);
      noStroke();
    }

    // drawing numbers beside notches
    for (let i = 0; i < this.numTicks + 1; i++) {
      // round each notch num to nearest increment of 10 and adjust chart
      // find what the increment needs to be in own method
      let axisNum = (this.maxValue / this.numTicks) * i;
      textSize(12);
      text(axisNum, 4 * -this.tickLength, i * -this.notchGap + 4);
    }
  }

  HorizontalAxis() {
    // draws just the horizontal line
    stroke(20, 50, 100);
    strokeWeight(2);
    line(0, 0, 0, this.width);
    stroke(100);

    // drawing notches on x axis line
    for (let i = 0; i < this.numTicks + 1; i++) {
      stroke(1);
      line(-this.tickLength, i * this.notchGap, 0, i * this.notchGap);
      noStroke();
    }
  }
}
