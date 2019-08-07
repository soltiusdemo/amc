jQuery.sap.require("sap/ui/thirdparty/d3");
jQuery.sap.declare("ZANA_01.LineCart");
sap.ui.core.Element.extend("ZANA_01.LineChartItem", {
	metadata: {
		properties: {
			"dim1": {
				type: "string",
				group: "Misc",
				defaultValue: null
			},
		}
	}
});

sap.ui.core.Control.extend("ZANA_01.LineChart", {
	metadata: {
		properties: {
			"title": {
				type: "string",
				group: "Misc",
				defaultValue: "Line Chart Title"
			}
		},
		aggregations: {
			"items": {
				type: "com.soltiusme.ZAMC1.LineChartItem",
				multiple: true,
				singularName: "item"
			}
		},
		defaultAggregation: "items",
		events: {
			"onPress": {},
			"onChange": {}
		}
	},

	init: function() {
		console.log("Line chart Init");
		this.sParentId = "";
		this.chartData = [];
	},

	setData: function(data) {
		this.chartData = data;
		console.log(data);
	},

	createLineChart: function() {
		/*
		 * Called from renderer
		 */
		console.log("Line Chart createLineChart()");
		var oLineChartLayout = new sap.m.VBox({
			alignItems: sap.m.FlexAlignItems.Center,
			justifyContent: sap.m.FlexJustifyContent.Center
		});
		var oLineChartFlexBox = new sap.m.FlexBox({
			height: "auto",
			alignItems: sap.m.FlexAlignItems.Center
		});
		/* ATTENTION: Important
		 * This is where the magic happens: we need a handle for our SVG to attach to. We can get this using .getIdForLabel()
		 * Check this in the 'Elements' section of the Chrome Devtools: 
		 * By creating the layout and the Flexbox, we create elements specific for this control, and SAPUI5 takes care of 
		 * ID naming. With this ID, we can append an SVG tag inside the FlexBox
		 */
		this.sParentId = oLineChartFlexBox.getIdForLabel();
		oLineChartLayout.addItem(oLineChartFlexBox);

		return oLineChartLayout;
	},

	/**
	 * The renderer render calls all the functions which are necessary to create the control,
	 * then it call the renderer of the vertical layout 
	 * @param oRm {RenderManager}
	 * @param oControl {Control}
	 */

	renderer: function(oRm, oControl) {
		var layout = oControl.createLineChart();

		oRm.write("<div");
		oRm.writeControlData(layout); // writes the Control ID and enables event handling - important!
		oRm.writeClasses(); // there is no class to write, but this enables 
		// support for ColorBoxContainer.addStyleClass(...)

		oRm.write(">");
		oRm.renderControl(layout);
		oRm.addClass('verticalAlignment');

		oRm.write("</div>");

	},

	// onAfterRendering: function () {
	// 	console.log("Linechart.onAfterRendering()");
	// 	console.log(this.sParentId);
	// 	var main_margin = {
	// 			top: 20,
	// 			right: 80,
	// 			bottom: 20,
	// 			left: 40
	// 		},
	// 		mini_margin = {
	// 			top: 10,
	// 			right: 80,
	// 			bottom: 20,
	// 			left: 40
	// 		},
	// 		legend_width = 80,
	// 		popup_left = 65,
	// 		width = 1080,
	// 		main_width = width - main_margin.left - main_margin.right - legend_width,
	// 		main_height = 200 - main_margin.top - main_margin.bottom,
	// 		mini_height = 60 - mini_margin.top - mini_margin.bottom;
	// 	//Date formatter variable
	// 	var formatDate = d3.time.format("%Y-%m-%d"),
	// 		parseDate = formatDate.parse,
	// 		bisectDate = d3.bisector(function (d) {
	// 			return d.Date;
	// 		}).left;
	// 	//D3.js Scales function objects
	// 	var main_x = d3.time.scale.utc()
	// 		.range([0, main_width]),
	// 		mini_x = d3.time.scale()
	// 		.range([0, main_width]);
	// 	//Create the SVG
	// 	var svg = d3.select("#" + this.sParentId).append("svg")
	// 		.attr("width", main_width + main_margin.left + main_margin.right + legend_width)
	// 		.attr("height", main_height + main_margin.top + main_margin.bottom);

	// 	svg.append("defs").append("clipPath")
	// 		.attr("id", "clip")
	// 		.append("rect")
	// 		.attr("width", main_width)
	// 		.attr("height", main_height);
	// 	//Create the main Line chart
	// 	var main = svg.append("g")
	// 		.attr("transform", "translate(" + main_margin.left + "," + main_margin.top + ")");
	// 	//Create the right-hand side chart lengend area, where we can switch the lines.    
	// 	var legend = svg.append("g")
	// 		.attr("transform", "translate(" + (width - legend_width) + "," + main_margin.top + ")");
	// 	//Create the bottom mini chart area, where we place the chart brush
	// 	var mini = svg.append("g")
	// 		.attr("transform", "translate(" + mini_margin.left + "," + mini_margin.top + ")");

	// 	var oRootPath = jQuery.sap.getModulePath("ZANA_01");
	// 	var csvPath = oRootPath + "/model/ASX.csv";

	// 	d3.csv(csvPath, function (error, data) {
	// 		//we need to convert the type of data variable to float or date
	// 		data.forEach(function (d) {
	// 			d.Date = parseDate(d.Date);
	// 			d.Close = parseFloat(d.Close);
	// 			d.Volume = parseInt(d.Volume);
	// 			d.High = parseFloat(d.High);
	// 			d.Low = parseFloat(d.Low)
	// 		});
	// 		//we need to sort those data in ascending order by date
	// 		data.sort(function (a, b) {
	// 			return a.Date - b.Date;
	// 		});
	// 		//Initial Time Extent
	// 		var initDate = [data[data.length - 200].Date, data[data.length - 1].Date];
	// 		//Create the brush
	// 		var brush = d3.svg.brush()
	// 			.x(mini_x)
	// 			.on("brush", brushed);
	// 		//The set the maximum value of left Y axis as the Hightest price and the lowest value as the minimum prices 
	// 		var maxY = d3.max(data, function (d) { // Return max price value
	// 			return d.High;
	// 		});
	// 		var minY = d3.min(data, function (d) {
	// 			return d.Low;
	// 		});
	// 		//Create left Y axis and right Y axis. Left Y axis is the price and right axis is the volume
	// 		var scaleY1 = d3.scale.sqrt().range([main_height, 0]).domain([minY, maxY]);
	// 		var scaleY2 = d3.scale.sqrt().range([main_height, 0]).domain(d3.extent(data, function (d) {
	// 			return d.Volume;
	// 		}));
	// 		//Left Y axis and right Y axis have their own scale individually
	// 		var miniScaleY1 = d3.scale.sqrt().range([mini_height, 0]).domain(scaleY1.domain());
	// 		var miniScaleY2 = d3.scale.sqrt().range([mini_height, 0]).domain(scaleY2.domain());
	// 		//Create the lines path array, where store all line settings
	// 		var pathes = [{
	// 			name: 'High',
	// 			visible: false,
	// 			pathClass: "line high",
	// 			x: 'Date',
	// 			y: 'High',
	// 			scale: scaleY1,
	// 			miniScale: miniScaleY1,
	// 			focusClass: 'y0'
	// 		}, {
	// 			name: 'Low',
	// 			visible: false,
	// 			pathClass: "line low",
	// 			x: 'Date',
	// 			y: 'Low',
	// 			scale: scaleY1,
	// 			miniScale: miniScaleY1,
	// 			focusClass: 'y0'
	// 		}, {
	// 			name: 'Close',
	// 			visible: true,
	// 			pathClass: "line close",
	// 			x: 'Date',
	// 			y: 'Close',
	// 			scale: scaleY1,
	// 			miniScale: miniScaleY1,
	// 			focusClass: 'y0'
	// 		}, {
	// 			name: 'Volume',
	// 			visible: true,
	// 			pathClass: "line volume",
	// 			x: 'Date',
	// 			y: 'Volume',
	// 			scale: scaleY2,
	// 			miniScale: miniScaleY2,
	// 			focusClass: 'y1'
	// 		}];
	// 		//Create the main lines accessor function object
	// 		var main_line = function (path) {

	// 				var accessor = d3.svg.line()
	// 					.interpolate("cardinal")
	// 					.x(function (d) {
	// 						return main_x(d[path.x]);
	// 					})
	// 					.y(function (d) {
	// 						return path.scale(d[path.y]);
	// 					});

	// 				return accessor(data);
	// 			}
	// 			//Create the mini lines accessor function object
	// 		var mini_line = function (path) {
	// 				var accessor = d3.svg.line()
	// 					.x(function (d) {
	// 						return mini_x(d[path.x]);
	// 					})
	// 					.y(function (d) {
	// 						return path.miniScale(d[path.y]);
	// 					});

	// 				return accessor(data);
	// 			}
	// 			//Set lines domain
	// 		main_x.domain(initDate);
	// 		mini_x.domain([data[0].Date, data[data.length - 1].Date]);

	// 		//Axis variables
	// 		var main_xAxis = d3.svg.axis()
	// 			.scale(main_x)
	// 			.tickFormat(d3.time.format("%d/%m/%y"))
	// 			.orient("bottom");
	// 		var mini_xAxis = d3.svg.axis()
	// 			.scale(mini_x)
	// 			.tickFormat(d3.time.format("%d/%m/%y"))
	// 			.orient("bottom");
	// 		var main_yAxisLeft = d3.svg.axis()
	// 			.scale(scaleY1)
	// 			.orient("left");
	// 		main_yAxisRight = d3.svg.axis()
	// 			.scale(scaleY2)
	// 			.orient("right");
	// 		//Create a overlay rect to catch the mouse movement when it move over the chart
	// 		main.append("rect")
	// 			.attr("class", "overlay")
	// 			.attr("width", main_width)
	// 			.attr("height", main_height)
	// 			.on("mouseover", function () {
	// 				focus.style("display", null);
	// 				popup.style("opacity", 1)
	// 					.style("left", popup_left + "px")
	// 					.style("top", "80px");
	// 			})
	// 			.on("mouseout", function () {
	// 				focus.style("display", "none");
	// 				popup.style("opacity", 0);
	// 			})
	// 			.on("mousemove", mousemove);
	// 		//Create the path attribute of main lines
	// 		var main_lines = main.selectAll("path")
	// 			.data(pathes) // Select nested data and append to new svg group elements
	// 			.enter().append("path")
	// 			.attr("clip-path", "url(#clip)")
	// 			.attr("class", function (d) {
	// 				return d.pathClass;
	// 			})
	// 			.attr("pointer-events", "none")
	// 			.attr("d", function (d) {
	// 				return d.visible ? main_line(d) : null;
	// 			});

	// 		/* Add 'curtain' rectangle to hide entire grapth for the curtain effect */
	// 		var curtain = main.append('rect')
	// 			.attr('x', -1 * main_width)
	// 			.attr('y', -1 * main_height)
	// 			.attr('height', main_height)
	// 			.attr('width', main_width)
	// 			.attr('class', 'curtain')
	// 			.attr("pointer-events", "none")
	// 			.attr('transform', 'rotate(180)')
	// 			.style('fill', '#000');
	// 		//Add the main axis to main chart area
	// 		main.append("g")
	// 			.attr("class", "x axis")
	// 			.attr("transform", "translate(0," + main_height + ")")
	// 			.call(main_xAxis);
	// 		//Add the Y axises to main chart area
	// 		main.append("g")
	// 			.attr("class", "y axis axisLeft")
	// 			.call(main_yAxisLeft)
	// 			.append("text")
	// 			.attr("transform", "rotate(-90)")
	// 			.attr("y", 6)
	// 			.attr("dy", ".71em")
	// 			.style("text-anchor", "end")
	// 			.text("Price ($)");
	// 		//Only display the right Y axis if the volume data is present
	// 		if (pathes[3].visible) {
	// 			// main.append("g")
	// 			// 	.attr("class", "y axis axisRight")
	// 			// 	.attr("transform", "translate(" + main_width + ", 0)")
	// 			// 	.call(main_yAxisRight)
	// 			// 	.append("text")
	// 			// 	.attr("transform", "rotate(-90)")
	// 			// 	.attr("y", -12)
	// 			// 	.attr("dy", ".71em")
	// 			// 	.style("text-anchor", "end")
	// 			// 	.text("Volume");
	// 		}
	// 		//Add the x axis to the mini chart area
	// 		mini.append("g")
	// 			.attr("class", "x axis")
	// 			.attr("transform", "translate(0," + mini_height + ")")
	// 			.call(mini_xAxis);
	// 		//Set up the d attribute of mini lines
	// 		var mini_lines = mini.selectAll("path")
	// 			.data(pathes, function (d, i) {
	// 				return d.name
	// 			})
	// 			.enter().append("path")
	// 			.attr("class", 'line')
	// 			.attr("d", function (d) {
	// 				return d.visible ? mini_line(d) : null;
	// 			});
	// 		//Add the brush to mini line chart area
	// 		mini.append("g")
	// 			.attr("class", "x brush")
	// 			.call(brush)
	// 			.selectAll("rect")
	// 			.attr("y", -6)
	// 			.attr("height", mini_height + 7);
	// 		//Set the brush extent to Initial date
	// 		brush.extent(initDate)
	// 			//now draw the brush to match our extent
	// 		brush(d3.select(".brush").transition());
	// 		//Add the focus line which will show up when mouse move over the main chart
	// 		var focus = main.append("g")
	// 			.attr("class", "focus")
	// 			.style("display", "none");
	// 		focus.append("line")
	// 			.attr("class", "x")
	// 			.attr("y1", scaleY2(0))
	// 			.attr("y2", scaleY2(0) - main_height)
	// 			.attr("pointer-events", "none");

	// 		//Create the popup text area on the left top
	// 		var popup = d3.select('body').append('div').attr('id', "popup").attr("opacity", 0).style("left", "200px")
	// 			.style("top", "200px");
	// 		popup.append("text").attr("class", "popup date").attr("x", 20).attr("y", 27);
	// 		//Create the legend text area on the right top
	// 		var legend_text = legend.selectAll('g')
	// 			.data(pathes)
	// 			.enter()
	// 			.append('g')
	// 			.attr('class', 'legend');
	// 		//Create the switch button for each line.
	// 		legend_text.append("rect")
	// 			.attr("width", 10)
	// 			.attr("height", 10)
	// 			.attr('x', 0)
	// 			.attr('y', function (d, n) {
	// 				return (33 + n * 15);
	// 			})
	// 			.attr("class", function (d) {
	// 				return d.visible ? 'legend ' + d.name : 'invisible';
	// 			})
	// 			.on("click", function (d) { // On click make d.visible 
	// 				d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true
	// 				//Switch on or off the right-hand Y axis
	// 				if (d.name == 'Volume') {
	// 					d.visible ? main.select('.axisRight').attr('opacity', 1) : main.select('.axisRight').attr('opacity', 0);
	// 				}
	// 				//Open the curtain
	// 				curtain.attr('width', main_width);
	// 				//Redraw the lines in the main chart area
	// 				main.selectAll("path")
	// 					.attr("d", function (d) {
	// 						return d.visible ? main_line(d) : null;
	// 					});
	// 				//Reset the legend text color
	// 				legend_text.select("rect")
	// 					.attr("class", function (d) {
	// 						return d.visible ? 'legend ' + d.name : 'invisible';
	// 					});
	// 				legend_text.select("text")
	// 					.attr("class", function (d) {
	// 						return d.visible ? 'legend ' + d.name : 'invisible';
	// 					});
	// 				//Reset the popup text color
	// 				// setPopupClass();
	// 				//Close the curtain gradually
	// 				t = curtain.transition()
	// 					.delay(750)
	// 					.duration(6000)
	// 					.ease('linear');

	// 				t.attr('width', 0);

	// 			});
	// 		//Add the legend text
	// 		legend_text.append('text')
	// 			.attr('class', function (d) {
	// 				return d.visible ? 'legend ' + d.name : 'invisible';
	// 			})
	// 			.attr('x', 20)
	// 			.attr('y', function (d, n) {
	// 				return (42 + n * 15);
	// 			})
	// 			.text(function (d) {
	// 				return d.name;
	// 			});
	// 		//Close the curtain gradually
	// 		var t = curtain.transition()
	// 			.delay(750)
	// 			.duration(6000)
	// 			.ease('linear');
	// 		t.attr('width', 0);
	// 		//Mouse movement handling function
	// 		function mousemove() {
	// 			var x0 = main_x.invert(d3.mouse(this)[0]),
	// 				i = 0,
	// 				d = data[bisectDate(data, x0, 1)];

	// 			var left = d3.mouse(this)[0];
	// 			if (left > main_width - 128) {
	// 				left = main_width - (128 * 3);
	// 			} else {
	// 				if (left < 60) {
	// 					left = 60;
	// 				}
	// 			}
	// 			popup.style("left", left + "px")
	// 				.style("top", "80px");

	// 			var tipHtml = '<div style="color: orange;">' + formatDate(d.Date) + '</div>';
	// 			pathes.forEach(function (path) {
	// 				if (path.visible) {
	// 					tipHtml += '<div class="summary ' + path.name + '">' + path.name + ": " + d[path.y] + '</div>';
	// 				//tipHtml += '<div class="summary ' + "Vital1" + '">' + "Vital1" + ": " + d[path.y] + '</div>';
	// 				}
	// 			});

	// 			popup.html(tipHtml);
	// 			focus.select(".x").attr("transform", "translate(" + main_x(d.Date) + ",0)");
	// 		}
	// 		//Brush handling function
	// 		function brushed() {
	// 			main_x.domain(brush.empty() ? main_x.domain() : brush.extent());
	// 			main.selectAll(".line").attr("d", function (d) {
	// 				return d.visible ? main_line(d) : null;
	// 			});
	// 			//Reset the main X axis
	// 			main.select(".x.axis").call(main_xAxis);

	// 		}
	// 	});

	// }

	onAfterRendering: function() {
			console.log("Linechart.onAfterRendering()");
			console.log(this.sParentId);

			//This set of code can be removed/modified Trial 1

			// Set the dimensions of the canvas / graph
			if (this.chartData) {
				var margin = {
						top: 10,
						right: 170,
						bottom: 50,
						left: 50
					},
					width = 1000 - margin.left - margin.right,
					height = 200 - margin.top - margin.bottom,
					mini_height = 30;
				// Parse the date / time
				var dateformat = "%Y-%m-%d";
				var data = this.chartData;
				var parseDate = d3.time.format(dateformat).parse,
					formatDate = d3.time.format(dateformat),
					bisectDate = d3.bisector(function(d) {
						return d.date;
					}).left;

				// Set the ranges
				var x = d3.time.scale().range([0, width]);
				//Context Scale
				var xMin = d3.time.scale().range([0, width]);
				var y = d3.scale.linear().range([height, 0]);

				// Define the axes
				var axisForm = "%H:%M:%S";
				var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(12).tickFormat(function(d) {
					return d.getDate() < 10 ? "0" + d.getDate() + ":00" : d.getDate() + ":00";
				});

				var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
				// Define the line
				var valueline = d3.svg.line()
					.x(function(d) {
						return x(d.date);
					})
					.y(function(d) {
						return y(d.value);
					});

				var svg = d3.select("#" + this.sParentId).append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var miniChart = svg.append("g")
					.attr("transform", "translate(" + margin.left + "," + 130 + ")");

				var lineSvg = svg.append("g");

				var focus = svg.append("g").style("display", "none");
				//var color = d3.scale.category10();
				var colorScale = ["#DB009F", "#EE830A", "#86FF2B", "#189EFE"];

				//color function pulls from array of colors stored in color.js
				var color = d3.scale.ordinal().range(colorScale);
				color.domain(d3.keys(data[0]).filter(function(key) {
					if(key == "date" || key == "vitalName"){
						return false;
					}
					else{
						return true;
					}
					//return key !== "date";
				}));

				var emotions;
				if (color.domain().length > 1) {
					data.forEach(function(d) {
						d.date = (d.date instanceof Date) ? d.date : parseDate(d.date);
						//						d.value = +d.value;
					});
					emotions = color.domain().map(function(name) {
						return {
							name: name,
							values: data.map(function(d) {
								return {
									date: d.date,
									value: +d[name]
								};
							})
						};
					});
					x.domain(d3.extent(data, function(d) {
						return d.date;
					}));
					y.domain([
						d3.min(emotions, function(c) {
							return d3.min(c.values, function(v) {
								return v.value;
							});
						}),
						d3.max(emotions, function(c) {
							return d3.max(c.values, function(v) {
								return v.value;
							});
						})
					]);

					// Add the X Axis
					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					// Add the Y Axis
					svg.append("g")
						.attr("class", "y axis")
						.call(yAxis);
					var emotion = svg.selectAll(".emotion")
						.data(emotions)
						.enter().append("g")
						.attr("class", "emotion");
					emotion.append("path")
						.attr("class", "line")
						.attr("d", function(d) {
							return valueline(d.values);
						})
						.style("stroke", function(d) {
							return color(d.name);
						});

					focus.append("line")
						.attr("class", "x")
						.style("stroke", "blue")
						.style("stroke-dasharray", "3,3")
						.style("opacity", 0.5)
						.attr("y1", 0)
						.attr("y2", height);

					// append the y line
					focus.append("line")
						.attr("class", "y")
						.style("stroke", "blue")
						.style("stroke-dasharray", "3,3")
						.style("opacity", 0.5)
						.attr("x1", width)
						.attr("x2", width);

					// append the circle at the intersection
					focus.append("circle")
						.attr("class", "y")
						.style("fill", "none")
						.style("stroke", "blue")
						.attr("r", 4);

					// place the value at the intersection
					focus.append("text")
						.attr("class", "y1")
						.style("stroke", "white")
						.style("stroke-width", "3.5px")
						.style("opacity", 0.8)
						.attr("dx", 8)
						.attr("dy", "-.3em");
					focus.append("text")
						.attr("class", "y2")
						.attr("dx", 8)
						.attr("dy", "-.3em");

					// place the date at the intersection
					focus.append("text")
						.attr("class", "y3")
						.style("stroke", "white")
						.style("stroke-width", "3.5px")
						.style("opacity", 0.8)
						.attr("dx", 8)
						.attr("dy", "1em");
					focus.append("text")
						.attr("class", "y4")
						.attr("dx", 8)
						.attr("dy", "1em");

					//This is for tooltip
					focus.append("rect")
						.attr("class", "tooltip")
						.attr("width", 100)
						.attr("height", 50)
						.attr("x", 10)
						.attr("y", -10) //-22)
						.attr("rx", 4)
						.attr("ry", 4);
					focus.append("text")
						.attr("x", 18)
						.attr("y", 10)
						.text("Time:"); //-2);

					focus.append("text")
						.attr("class", "tooltip-date")
						.attr("x", 65)
						.attr("y", 10); //-2);	

					focus.append("text")
						.attr("x", 18)
						.attr("y", 30) //18)
						.text("Value:");

					focus.append("text")
						.attr("class", "tooltip-likes")
						.attr("x", 65)
						.attr("y", 30); //18);

					//Tooltip ends here           	

					// append the rectangle to capture mouse
					svg.append("rect")
						.attr("width", width)
						.attr("height", height)
						.style("fill", "none")
						.style("pointer-events", "all")
						.on("mouseover", function() {
							focus.style("display", null);
						})
						.on("mouseout", function() {
							focus.style("display", "none");
						})
						.on("mousemove", function() {
							var x0 = x.invert(d3.mouse(this)[0]),
								i = bisectDate(data, x0, 1),
								d0 = data[i - 1],
								d1 = data[i],
								d = x0 - d0.date > d1.date - x0 ? d1 : d0;
							focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
							let dtlbl = d.date.getDate() < 10 ? "0" + d.date.getDate() + ":00" : d.date.getDate() + ":00";

							focus.select(".tooltip-date").text(dtlbl); //dateFormatter(d.date));
							focus.select(".tooltip-likes").text(d.value.toFixed(2));
							focus.select(".tooltip-likes").text(d.value1.toFixed(2));
							focus.select(".tooltip-likes").text(d.value2.toFixed(2));
							focus.select(".tooltip-likes").text(d.value3.toFixed(2));
						});

				} else {
					data.forEach(function(d) {
						d.date = (d.date instanceof Date) ? d.date : parseDate(d.date);
						d.value = +d.value;
					});
					x.domain(d3.extent(data, function(d) {
						return d.date;
					}));
					y.domain([0, d3.max(data, function(d) {
						return d.value;
					})]);
					lineSvg.append("path")
						.attr("class", "line")
						.attr("d", valueline(data));

					// Add the X Axis
					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					// Add the Y Axis
					svg.append("g")
						.attr("class", "y axis")
						.call(yAxis);

					// append the x line
					focus.append("line")
						.attr("class", "x")
						.style("stroke", "blue")
						.style("stroke-dasharray", "3,3")
						.style("opacity", 0.5)
						.attr("y1", 0)
						.attr("y2", height);

					// append the y line
					focus.append("line")
						.attr("class", "y")
						.style("stroke", "blue")
						.style("stroke-dasharray", "3,3")
						.style("opacity", 0.5)
						.attr("x1", width)
						.attr("x2", width);

					// append the circle at the intersection
					focus.append("circle")
						.attr("class", "y")
						.style("fill", "none")
						.style("stroke", "blue")
						.attr("r", 4);

					// place the value at the intersection
					focus.append("text")
						.attr("class", "y1")
						.style("stroke", "white")
						.style("stroke-width", "3.5px")
						.style("opacity", 0.8)
						.attr("dx", 8)
						.attr("dy", "-.3em");
					focus.append("text")
						.attr("class", "y2")
						.attr("dx", 8)
						.attr("dy", "-.3em");

					// place the date at the intersection
					focus.append("text")
						.attr("class", "y3")
						.style("stroke", "white")
						.style("stroke-width", "3.5px")
						.style("opacity", 0.8)
						.attr("dx", 8)
						.attr("dy", "1em");
					focus.append("text")
						.attr("class", "y4")
						.attr("dx", 8)
						.attr("dy", "1em");
					//This is for tooltip
					focus.append("rect")
						.attr("class", "tooltip")
						.attr("width", 100)
						.attr("height", 50)
						.attr("x", 10)
						.attr("y", -10) //-22)
						.attr("rx", 4)
						.attr("ry", 4);
					focus.append("text")
						.attr("x", 18)
						.attr("y", 10)
						.text("Time:"); //-2);

					focus.append("text")
						.attr("class", "tooltip-date")
						.attr("x", 65)
						.attr("y", 10); //-2);	

					// focus.append("text")
					// 	.attr("x", 18)
					// 	.attr("y", 30) //18)
					// 	.text("Value:");

					focus.append("text")
						.attr("class", "tooltip-likes")
						.attr("x", 18)
						.attr("y", 30); //18);

					//Tooltip ends here            

					// append the rectangle to capture mouse
					svg.append("rect")
						.attr("width", width)
						.attr("height", height)
						.style("fill", "none")
						.style("pointer-events", "all")
						.on("mouseover", function() {
							focus.style("display", null);
						})
						.on("mouseout", function() {
							focus.style("display", "none");
						})
						.on("mousemove", mousemove);
				}

				function mousemove() {
					//debugger;
					var x0 = x.invert(d3.mouse(this)[0]),
						i = bisectDate(data, x0, 1),
						d0 = data[i - 1],
						d1 = data[i],
						d = x0 - d0.date > d1.date - x0 ? d1 : d0;
					focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
					let dtlbl = d.date.getDate() < 10 ? "0" + d.date.getDate() + ":00" : d.date.getDate() + ":00";

					focus.select(".tooltip-date").text(dtlbl); //dateFormatter(d.date));
					focus.select(".tooltip-likes").text(d.vitalName + ":" + d.value.toFixed(2));
				}

			}

		}
		/*This set of code can be removed/modified Trial 1*/

});