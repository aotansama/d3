let config = {
  root: 'div.chart1',
  r: 80,
  ringWidth: 25,
  minValue: 0,
  maxValue: 200,
  textFontFamily: 'メイリオ, Meiryo, sans-serif',
  currentValueTextFontSize: '12pt',
  tickTextFontSize: '6pt',
  tickTextMargin: 12, 
  tickLength: 4,
  tickColor: 'gray',
  activeColors: [
    "#3288BD","#ABDDA4", "#ffd700", "#F46D43", "#D53E4F"
  ],
  pointerWidth				: 10,
  pointerTailLength			: 5,
  pointerHeadLengthPercent	: 0.9,
  pointerFillColor: '#c0c0c0'  
}

let svg = d3.select(config.root).append("svg")

let degree = Math.PI/180;

let area_size = Math.floor((config.maxValue - config.minValue) / config.activeColors.length);

let pie = d3.pie()
.startAngle(-90*degree).endAngle(90*degree)
.value(() => area_size)
.sort(null);

let pie_date = pie(config.activeColors); 

let container = svg.append('g')
  .attr('transform', 'translate(' + config.r + ',' + config.r + ')');

let currentValue = config.defaultValue ? config.defaultValue : config.minValue; 


let arc = d3.arc()
.innerRadius(config.r - config.ringWidth + 1)
.outerRadius(config.r - 1)

container.selectAll("path")
  .data(pie_date)
  .enter().append('path')
  .attr('d', (d) => arc(d))
  .attr('fill', (d, i) => d.data);


let tickPosOffset = (config.r - config.ringWidth) * -1;


let tickData = pie_date.map((d) => d.endAngle *(180 / Math.PI));
tickData.unshift(pie_date[0].startAngle *(180 / Math.PI))


let ticks = container.selectAll('.tick')
  .data(tickData)
  .enter().append('g');


ticks.append('line')
.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', config.tickLength)
.attr("stroke-width",0.5)
.attr("stroke",config.tickColor)
.attr('transform', function(d) {
  return 'rotate(' + d + ') translate(0 ,' + tickPosOffset + ')'
});

let tickLabel = d3.scaleLinear()
  .domain([0, config.activeColors.length])
  .range([config.minValue, config.maxValue]);

ticks.append('text')
.attr('transform', function(d, i) {
  let textOffset = tickPosOffset + config.tickTextMargin;
  let value = tickLabel(i)
  if (value === config.minValue) {
    return 'translate(' + textOffset + ',0)'

  } else if (value === config.maxValue) {
    return 'translate(' + (textOffset * -1) + ',0)'
  }
  return 'rotate(' + d + ') translate(0 ,' + textOffset + ')'
})
.attr('fill', config.tickColor)
.attr('text-anchor', 'middle')
.attr("font-family", config.textFontFamily)
.attr("font-size", config.tickTextFontSize)
.text(function(d, i) {
  return tickLabel(i);
});

let pointerAngle = d3.scaleLinear()
.domain([config.minValue, config.maxValue])
.range([-90, 90]);

pointerHeadLength = Math.round(config.r * config.pointerHeadLengthPercent);
let pointerLineData = [ [config.pointerWidth / 2, 0], 
						[0, -pointerHeadLength],
						[-(config.pointerWidth / 2), 0],
						[0, config.pointerTailLength],
            [config.pointerWidth / 2, 0] ];

let pointerLine = d3.line().curve(d3.curveLinear);
let pointer = container.append('path')
    .attr('d', pointerLine(pointerLineData))
    .attr('transform', 'rotate(' + pointerAngle(currentValue) + ')')
    .attr('fill', config.pointerFillColor)
    .attr('fill-opacity', 0.5);


let textCurrentValue = container.append('text')
    .attr('text-anchor', 'middle')
    .attr("font-family", config.textFontFamily)
    .attr("font-size", config.currentValueTextFontSize)
    .text(currentValue);
  
        
/////////////////////////////////////////////////////////////////////////////
function update(newValue) {
  pointer.transition().duration(1000)
  .attr('transform', 'rotate(' + pointerAngle(newValue) + ')')

  let valueTextInterpolate = d3.interpolate(currentValue, newValue);

  textCurrentValue.transition()
  .duration(1000)
  .ease(d3.easeLinear)
  .textTween(function() {
  return function(t) {
    return String(valueTextInterpolate(t)).split('.')[0];
  };
  });

  currentValue = newValue;

}

setTimeout(function() {
  update(150);  
}, 1000);

setTimeout(function() {
  update(20);  
}, 2000);
