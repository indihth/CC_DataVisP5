class BarChart {
  // constructor defines everything that's in the object
  constructor(_height, _width, _posX, _posY, _data, _numTicks) {
    // makes height of object value that user passed in _height
    this.height = _height;
    this.width = _width;
    this.posX = _posX;
    this.posY = _posY;
    this.data = _data;
    this.numTicks = _numTicks;
    this.numBlocks = this.data.length;

    this.margin = 10;
    this.barGap = 20;



    this.maxValue = 50;
    
    this.barWidth = (this.width - (this.margin * 2) - (this.numBlocks - 1) * this.barGap) / this.numBlocks;
  }

// METHODS

// function keyword isn't needed in class
  render() {
    push();
    translate(this.posX, this.posY);

    
    this.DrawBars();
    this.VerticalAxis();
    this.HorizontalAxis();

    pop();
  }

  DrawBars() {
    noStroke();

    for (let x = 0; x < this.data.length; x++){
        // add master gap that increments
        let gap = x * (this.barGap + this.barWidth)
        let currentBar = this.Scaler(this.data[x]);
        fill (210, 0, 0);
        rect(this.barGap + gap, 0, this.barWidth, -currentBar);
    }
}

  Scaler(_num) {
        let scaleValue = this.height / this.maxValue;
        return _num * scaleValue;
  }

  
// draws axis lines for chart with option to display number labels
VerticalAxis() {
    // drawing y axis
    // translate(this.posX, this.posY);
    angleMode(DEGREES);
    rotate(270);
  
    stroke(20, 50, 100);
    strokeWeight(2);
    line(0, 0, this.height, 0);

    let numNotch = 5;
    let numTicks = 5
  
    let notchGap = this.height / numNotch;
    let numGap = this.maxValue / numNotch;
    let tickLength = 10;
  
    stroke(100);
  
    // drawing notches on y axis line
    for (let i = 0; i < numTicks + 1; i++) {
      stroke(1);
      line(i * notchGap, 0, i * notchGap, -tickLength);
  
      noStroke();
    }
  }

  HorizontalAxis() {
    stroke(20, 50, 100);
    strokeWeight(2);
    line(0, 0, 0, this.width);
  }

}
