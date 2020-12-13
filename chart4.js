let config = {
  root: 'div.chart1',
  width: 200,
  boxHeight: 30,
  boxWidth: 7,
  boxMargin: 1,
  minValue: 0,
  maxValue: 200,
  activeColors: [
    "#3288BD","#ABDDA4", "#E6F598", "#F46D43", "#D53E4F"
  ],
  boxColor:'#dcdcdc',
  xAxisCount: 3,
  xAxisTextFontFamily: 'メイリオ, Meiryo, sans-serif',
  xAxisTextFontSize: '8pt',
  xAxisTextColor: '#808080' 
}

let svg = d3.select(config.root).append("svg")

let container = svg.append('g')

let currentValue = config.defaultValue ? config.defaultValue : config.minValue; 

//BOXの数を計算
let boxData = [];
for(let x = 0;  (x + config.boxWidth) < config.width; x += (config.boxWidth + config.boxMargin)) {
  boxData.push({
    x:x
  });
}

let boxColors = d3.scaleQuantize()
  .domain([0, boxData.length])
  .range(config.activeColors);

let boxes = container.append('g')
  .attr('class', 'box_frame')
  .selectAll('.box')
  .data(boxData)
  .enter().append('rect')
  .attr('x', (d) => d.x)
  .attr('y', 0)
  .attr('width', config.boxWidth)
  .attr('height', config.boxHeight)
  .attr('fill', config.boxColor)
  .attr('class', (d, i) => 'box_id_' + i);

let boxScale = d3.scaleLinear()
  .domain([config.minValue, config.maxValue])
  .rangeRound([0, boxData.length - 1]);

let xAxisScale = d3.scaleLinear()
  .domain([0, config.xAxisCount -1])
  .rangeRound([0, boxData.length - 1])

let xAxisData = [];
let xAxisTextOffset = Math.floor(config.boxWidth / 2);
for (let i = 0; i < config.xAxisCount; i += 1) {
  xAxisData.push ({
    x: boxData[xAxisScale(i)].x + xAxisTextOffset,
    value: Math.floor(boxScale.invert(xAxisScale(i))), 
  })
}

container.selectAll('text')
  .data(xAxisData)
  .enter().append('text')
  .text((d) => d.value)
  .attr('x', (d) => d.x)
  .attr('y', config.boxHeight + 1)
  .attr('font-family', config.xAxisTextFontFamily)
  .attr('font-size', config.xAxisTextFontSize)
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'hanging')
  .attr('fill', config.xAxisTextColor);
  
/////////////////////////////////////////////////////////////////////////////
function update(newValue) {

  let boxInterpolate = d3.interpolateRound(boxScale(currentValue), boxScale(newValue));
  let newBoxIndex = boxScale(newValue);
  let box_frame = container.select('g.box_frame');

  box_frame.transition()
  .duration(1000)
  .ease(d3.easeLinear)
  .tween('attr.fill', function(){
    return function(t) {
      let box_id = boxInterpolate(t);
      box_frame.select('rect.box_id_' + box_id)
        .attr('fill', function() {
          if (box_id < newBoxIndex) {
            return boxColors(box_id);
          }
          return config.boxColor;   
        })
    }
  });

  currentValue = newValue;
}
setTimeout(function() {
  update(180);  
}, 2000);

setTimeout(function() {
  update(50);  
}, 4000);

/*
setTimeout(function() {
  update(20);  
}, 2000);
*/