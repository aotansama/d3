let config = {
  root: 'body',
  size: 100,
  ringWidth: 35,
  minValue: 0,
  maxValue: 200,
  tickCount: 5,
}

let svg = d3.select("body").append("svg")
  .attr('width', 500)
  .attr('height', 500)

let degree = Math.PI/180;

let container = svg.append('g')
//.attr('transform', 'translate(' + config.size + ',' + config.size + ')');

let circle = container.append('circle')
  .attr('cx', 200)
  .attr('cy', 200)
  .attr('r', 100)
  .attr('fill', 'blue');


container.append('g')
  .attr('transform', 'translate(200, 200)')
  .append('text')
  .attr('x', 0)
  .attr('y', -100)
  .attr('text-anchor', 'middle')
  .text('1234')
  .attr('transform', 'rotate(90)');


/*
text.transition()
  .duration(2000)
  .attr('transform', 'rotate(20) translate(200, 100)')
*/


//let color = d3.scaleOrdinal(["blue", "red", "green"]);

/*
let pie = d3.pie()
.startAngle(-90*degree).endAngle(90*degree)
.value((d) => d.value)
.sort(null);

let pie_date = pie(data); 
*/
