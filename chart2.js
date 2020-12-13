let data = [{date: '2020-05-01', value: 1500000},
            {date: '2020-06-01', value: 2000000},
            {date: '2020-07-01', value: 3000000},
            {date: '2020-08-01', value: 4000000},
            {date: '2020-09-01', value: 4000000},
            {date: '2020-10-01', value: 4000000},
            {date: '2020-11-01', value: 4000000},
            {date: '2020-12-01', value: 4000000},
            {date: '2021-01-01', value: 4000000},
            {date: '2021-02-01', value: 4000000},
            {date: '2021-03-01', value: 4000000},
            {date: '2021-04-01', value: 4000000},
          ];

function splitStrDate(str_date) {
  let sd = str_date.split('-');
  
}
let size  = 100;
let width = 500;
let height = 500;
let minVal = 0;
let maxVal = 10;

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);




let container = svg.append('g')
  //.attr('transform', 'translate(' + (width / 2) + ',' + (height/2) + ')');


//let color = d3.scaleOrdinal(["blue", "red", "green"]);

/*
let pie = d3.pie()
.startAngle(-90*degree).endAngle(90*degree)
.value((d) => d.value)
.sort(null);

let pie_date = pie(data); 

*/        

let back_arc = d3.arc()
.innerRadius(66)
.outerRadius(99)

/*

container.append('g')
  .selectAll("path")
  .data(pie(data))
  .enter().append('path')
  .attr('d', (d) => arc(d))
  .attr('fill', (d, i) => color(i));
  */

let arc = d3.arc()
.innerRadius(65)
.outerRadius(100);
/*
.startAngle(-1.5707963267948966 )
.endAngle(1.5707963267948966 );
*/

container.append('path')
.attr('d', back_arc({startAngle: -1.5707963267948966, endAngle:1.5707963267948966 }))
.attr('fill', "gray");

let path_arc2 = container.append('path')
.attr('d', arc({startAngle: -1.5707963267948966, endAngle:0.785398 }))
.attr('fill', "red");

let path_text = container.append('text')
          .text('0.785398');


// d3.interpolateが0-1なので、ticksも0-1の範囲のscaleで作成する
let ticks = d3.scaleLinear
            .domain([minVal,maxVal])
            .range([0, 1])
            .

container.append('g')

let i = d3.interpolate(0.785398, -0.785398);

let tweenPie = function() {
  return function(t) {
    return arc({startAngle: -1.5707963267948966, endAngle:i(t) })
            
  }
};



path_arc2.transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attrTween('d', tweenPie)
      .styleTween('fill', function() {
        return function(t) {
          let c = "red";
          if (i(t) < 0) {
            c = "blue";
          }
          return c;
        }
      });

path_text.transition()
.duration(1000)
.ease(d3.easeLinear)
.textTween(function() {
  return function(t) {
    return i(t);
  };
});
