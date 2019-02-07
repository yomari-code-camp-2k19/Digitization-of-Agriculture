var width = Math.max(document.documentElement.clientWidth,window.innerWidth || 0),
	height = Math.max(document.documentHeight.clientWidth,window.innerHeight || 0);

var svg = d3.select("body")
	.append("svg")
	.style("cursor","move");

svg.attr("viewBox","50 10"+width+""+height)
	.attr("preserveAspectRatio","xMinYMin");


var map = svg.append("g")
	.attr("class","map");

