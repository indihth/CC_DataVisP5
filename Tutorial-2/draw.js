let table;
let charts = [];
let chart2;
function preload() {
	table = loadTable("langData/langReport.csv", "csv", "header");
}

function setup() {
	pixelDensity(3);
	createCanvas(1200, 1200);
	// _data, _width, _height, _xPos, _yPos, _ticks, _labels, _name, _xValue, _yValue, _lineValue

	charts.push(
		new BarChart({
			_data: table,
			_width: 400,
			_height: 400,
			_xPos: 100,
			_yPos: 500,
			_ticks: 7,
			_labels: 1,
			_name: "All Pupils",
			_xValue: "Year",
			_yValue: "AllPupils",
			_lineValue: "ForeignTongue"
		})
	);
	charts.push(
		new HbarChart({
			_data: table,
			_width: 500,
			_height: 500,
			_xPos: 600,
			_yPos: 600,
			_ticks: 8,
			_labels: 1,
			_name: "English Irish",
			_xValue: "Year",
			_yValue: "ForeignTongue",
		})
	);
	charts.push(
		new StackedChart({
			_data: table,
			_width: 400,
			_height: 400,
			_xPos: 100,
			_yPos: 500,
			_ticks: 7,
			_labels: 1,
			_name: "Stacked Chart",
			_xValue: "Year",
			_yValue: ["EnglishIrish","NotEnglishIrish","NotKnown"],
			_yTotal: "AllPupils",
		})
	);
}

function draw() {
	background(193, 212, 210);
	for (let x = 0; x < charts.length; x++) {
		charts[x].render();
	}
}
