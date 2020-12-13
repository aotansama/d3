let config = {
  root: 'div.chart1',
  r: 80,
  minValue: 0,
  margin: [18,28,15,28], //T, R, B, L
  featuresLevel: 5,
  features: [
    { name: '評価A', value: 4 },
    { name: '評価B', value: 2 },
    { name: '評価C', value: 4 },
    { name: '評価D', value: 5 },
    { name: '評価E', value: 3 },
  ],
  vertexPointR: 1,
  faceLineWidth: 0.5,
  vertexColor: '#c0c0c0',
  valueFillColor: '#add8e6',
  textFontFamily: 'メイリオ, Meiryo, sans-serif',
  textFontSize: '8pt',
}

// レーダーチャート , スパイダー

let svg = d3.select(config.root).append("svg") 
  .attr('width', config.r * 2 + (config.margin[1] + config.margin[3]))
  .attr('height', config.r * 2 + (config.margin[0] + config.margin[2]))

let container = svg.append('g')
  .attr('transform', 'translate(' + (config.r + config.margin[1]) + ',' + (config.r + config.margin[0]) + ')');

let verticesData = [];
//角数
let cornerCount = config.features.length;
//中心角
let centerAngle = Math.PI * 2.0 / cornerCount;

function radian(theta) {
  return theta * (Math.PI / 180);
}

function theta(radian) {
  return radian / (Math.PI / 180);
}

function floatComp(f1, f2) {
  let diff = Math.abs(f1 - f2);
  return diff < 0.001 ? 0 : (f1 - f2) < 0 ? -1 : 1; 
}

//回転(ラアン)
let rotate = radian(-90);

let aaa = theta(centerAngle);

for (let l = 0; l < config.featuresLevel; l += 1) {
  let r = config.r / config.featuresLevel * (l + 1);
  let vertices = [];
  for (let n =0; n < cornerCount; n += 1) {
    // x = cos(中心角 * n) * r
    // y = sin(中心角 * n) * r
    let x = Math.cos(centerAngle * n) * r;
    let y = Math.sin(centerAngle * n) * r;
    pos = {
      x1: (Math.cos(rotate) * x) - (Math.sin(rotate) * y),
      y1: (Math.sin(rotate) * x) + (Math.cos(rotate) * y),
      };
    vertices.push(pos);
    if (n > 0) {
        vertices[n - 1].x2 = pos.x1; 
        vertices[n - 1].y2 = pos.y1; 
    }
  }
  vertices[vertices.length -1].x2 = vertices[0].x1; 
  vertices[vertices.length -1].y2 = vertices[0].y1; 

  verticesData.push(vertices);
}

container.append('circle')
  .attr('r', config.vertexPointR)
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('fill', config.vertexColor);

let edge = container.selectAll('.edge')
  .data(verticesData)
  .enter().append('g')

edge.selectAll('.vertices')
  .data((vertices) => vertices)
  .enter().append('circle')
  .attr('r', config.vertexPointR)
  .attr('cx', (d) => d.x1)
  .attr('cy', (d) => d.y1)
  .attr('fill', config.vertexColor);

edge.selectAll('.face')
.data((vertices) => vertices )
.enter().append('line')
.attr('x1', (d) => d.x1)
.attr('y1', (d) => d.y1)
.attr('x2', (d) => d.x2)
.attr('y2', (d) => d.y2)
.attr("stroke-width",config.faceLineWidth)
.attr("stroke", config.vertexColor)


container.selectAll('.feature_text')
.data(verticesData[verticesData.length - 1])
.enter().append('text')
.text((d, i) => config.features[i].name)
.attr('x', (d) => {
  let x_loc = floatComp(d.x1, 0.0);
  let offset =  config.vertexPointR * 2;
  if (x_loc < 0) {
    return d.x1 - offset;
  } else if (x_loc > 0) {
    return d.x1 + offset;
  }
  return d.x1;

})
.attr('y', (d) => {
  let y_loc = floatComp(d.y1, 0.0);
  let offset =  config.vertexPointR * 2;
  if (y_loc < 0) {
    return d.y1 - offset;
  } else if (y_loc > 0) {
    return d.y1 + offset;
  }
  return d.y1;
})
.attr('text-anchor', (d) => {
  x_loc = floatComp(d.x1, 0.0);
  if ( x_loc === 0) {
    return 'middle';
  } else if (x_loc < 0) {
    return 'end';
  }
  return 'start';
})
.attr('alignment-baseline', (d) => {
  let y_loc = floatComp(d.y1, 0.0);
  if (y_loc < 0) {
    return 'baseline';
  } else if (y_loc > 0) {
    return 'hanging';
  }
  return 'middle';
})
.attr("font-family", config.textFontFamily)
.attr("font-size", config.textFontSize)


//Active
let polygonData = [];
for (let i = 0; i < config.features.length; i += 1) {
  if (config.features[i].value == 0) {
    polygonData.push('0,0');
  } else {
    let vertex = verticesData[config.features[i].value - 1][i];
    polygonData.push(vertex.x1 + ',' + vertex.y1);
  }
}

container.append('polygon')
  .attr('points', polygonData.join(' '))
  .attr('fill', config.valueFillColor)
  .attr('fill-opacity', 0.5)

