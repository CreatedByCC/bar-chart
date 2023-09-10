import * as d3 from "d3";

// variables
const api_url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let dataset = [];

const drawGraph = () => {
  // dimensions
  const width = 800;
  const height = 450;
  const padding = 50;
  const barWidth = ((width - (2 * padding)) / dataset.length);
  
  const svg = d3.select('#chart')
    .attr('width', width)
    .attr('height', height)
  
  svg.append('text')    // y-axis header
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', 70)
    .text('Gross Domestic Product')
    .style('font-size', '0.7rem');
  
  // draw scales
  const xScale = d3.scaleLinear()
    .domain([0, dataset.length - 1])
    .range([padding, width - padding]);
  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, height - ( 2 * padding)]);
  
  // tooltip
  const tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden');
  
  // draw bars
  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('width', barWidth)
    .attr('height', (d) => yScale(d[1]))
    .attr('x', (d, i) => xScale(i))
    .attr('y', (d) => height - padding - yScale(d[1]))
    .on('mouseover', (d, i) => {
      tooltip.transition().style('visibility', 'visible')
      tooltip
        .html(`Date: ${i[0]} <br> Billions: $${i[1]}`)
      document.querySelector('#tooltip').setAttribute('data-date', i[0])
  })
    .on('mouseout', (d) => {
      tooltip.transition().style('visibility', 'hidden')
  });    
  
  // draw axis scale
  const datesArr = dataset.map((d) => {
    return new Date(d[0]);
  })
  //console.log(datesArr);
  
  const xAxisScale = d3.scaleTime()
    .domain([d3.min(datesArr), d3.max(datesArr)])
    .range([padding, width - padding]);
  
  const yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height - padding, padding]);
  
  // draw axis
  const xAxis = d3.axisBottom(xAxisScale);
  const yAxis = d3.axisLeft(yAxisScale)
  
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);
  
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

};

async function getData() {
    const response = await fetch(api_url);
    const data = await response.json();
    dataset = data.data;
    //console.log(dataset);
    drawGraph();
}

getData();