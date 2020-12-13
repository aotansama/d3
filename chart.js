let config = {
  root: 'div.chart1',
  r: 80,
  ringWidth: 25,
  minValue: 0,
  maxValue: 200,
  tickCount: 5,
  textFontFamily: 'メイリオ, Meiryo, sans-serif',
  currentValueTextFontSize: '12pt',
  tickTextFontSize: '6pt',
  tickTextMargin: 12, 
  tickLength: 4,
  tickColor: 'gray',
  activeColors: [
    "#3288BD","#ABDDA4", "#ffd700", "#F46D43", "#D53E4F"
  ] 
}

let svg = d3.select(config.root).append("svg")

let degree = Math.PI/180;
let startArcAngle = -90 * degree;
let endArcAngle = 90 * degree;


let colorArc = d3.scaleQuantize()
    .domain([config.minValue, config.maxValue])
    .range(config.activeColors);

let dataAngle = d3.scaleLinear()
  .domain([config.minValue, config.maxValue])
  .range([startArcAngle, endArcAngle])

let container = svg.append('g')
  .attr('transform', 'translate(' + config.r + ',' + config.r + ')');

let currentValue = config.defaultValue ? config.defaultValue : config.minValue; 


let backArc = d3.arc()
.innerRadius(config.r - config.ringWidth + 1)
.outerRadius(config.r - 1)

let activeArc = d3.arc()
.innerRadius(config.r - config.ringWidth)
.outerRadius(config.r);

container.append('path')
.attr('d', backArc({startAngle: startArcAngle, endAngle:endArcAngle }))
.attr('fill', "gray");

let pathActiveArc = container.append('path')
.attr('d', activeArc({startAngle: startArcAngle, endAngle:dataAngle(currentValue) }))
.attr('fill', "red");

let textCurrentValue = container.append('text')
  .attr('text-anchor', 'middle')
  .attr("font-family", config.textFontFamily)
  .attr("font-size", config.currentValueTextFontSize)
  .text(currentValue);

let tickLabel = d3.scaleLinear()
  .domain([0, config.tickCount])
  .range([config.minValue, config.maxValue]);

let tickAngle = d3.scaleLinear()
.domain([config.minValue, config.maxValue])
.range([-90, 90]);

let tickData = d3.range(config.tickCount + 1).map((d, i) => tickLabel(i));

let tickPosOffset = (config.r - config.ringWidth) * -1;

let ticks = container.selectAll('.tick')
  .data(tickData)
  .enter().append('g');

ticks.append('line')
.attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', config.tickLength)
.attr("stroke-width",0.5)
.attr("stroke",config.tickColor)
.attr('transform', function(d) {
  return 'rotate(' + tickAngle(d) + ') translate(0 ,' + tickPosOffset + ')'
});


ticks.append('text')
.attr('transform', function(d) {
  let textOffset = tickPosOffset + config.tickTextMargin;
  if (d === config.minValue) {
    return 'translate(' + textOffset + ',0)'

  } else if (d === config.maxValue) {
    return 'translate(' + (textOffset * -1) + ',0)'
  }
  return 'rotate(' + tickAngle(d) + ') translate(0 ,' + textOffset + ')'
})
.attr('fill', config.tickColor)
.attr('text-anchor', 'middle')
.attr("font-family", config.textFontFamily)
.attr("font-size", config.tickTextFontSize)
.text(function(d) {
  return d;
});


/////////////////////////////////////////////////////////////////////////////
function update(newValue) {
  let angleInterpolate = d3.interpolate(dataAngle(currentValue), dataAngle(newValue));
  let valueTextInterpolate = d3.interpolate(currentValue, newValue);

  let tweenPie = function() {
    return function(t) {
      return activeArc({startAngle: startArcAngle, endAngle:angleInterpolate(t) })
              
    }
  };
  
  pathActiveArc.transition()
  .duration(1000)
  .ease(d3.easeLinear)
  .attrTween('d', tweenPie)
  .styleTween('fill', function() {
    return function(t) {
      return colorArc(valueTextInterpolate(t));
    }
  });

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
  update(180);  
}, 1000);

setTimeout(function() {
  update(40);  
}, 3000);

