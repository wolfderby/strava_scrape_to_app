// D:\pitt\test-vite-app-3\frontend\src\components\D3Chart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Chart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Clear the previous SVG if it exists
    d3.select(chartRef.current).selectAll("*").remove();

    if (data && data.length > 0) {
      const svg = d3.select(chartRef.current)
                    .append('svg')
                    .attr('width', 500)
                    .attr('height', 300);

      // Map distances to an array
      const distances = data.map(d => d.distance_raw);

      // Define scales
      const xScale = d3.scaleBand()
                       .domain(d3.range(distances.length))
                       .range([0, 500])
                       .padding(0.1);
      
      const yScale = d3.scaleLinear()
                       .domain([0, d3.max(distances)])
                       .range([300, 0]);

      // Draw bars
      svg.selectAll('rect')
         .data(distances)
         .enter()
         .append('rect')
         .attr('x', (d, i) => xScale(i))
         .attr('y', d => yScale(d))
         .attr('width', xScale.bandwidth())
         .attr('height', d => 300 - yScale(d))
         .attr('fill', 'blue');

      // Add X-axis label
      svg.append('text')
         .attr('x', 250)
         .attr('y', 320)
         .attr('text-anchor', 'middle')
         .text('Activity Index');

      // Add Y-axis label
      svg.append('text')
         .attr('transform', 'rotate(-90)')
         .attr('x', -150)
         .attr('y', -40)
         .attr('text-anchor', 'middle')
         .text('Distance');
    }
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default D3Chart;
