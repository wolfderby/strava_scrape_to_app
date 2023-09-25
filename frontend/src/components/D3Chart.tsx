// D:\pitt\test-vite-app-3\frontend\src\components\D3Chart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Define the type for your data, assuming each data object has a distance_raw property that is a number
type DataProps = {
  distance_raw: number;
};

interface D3ChartProps {
  data: DataProps[];
}

const D3Chart: React.FC<D3ChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Clear the previous SVG if it exists
    d3.select(chartRef.current).selectAll("*").remove();

    if (data && data.length > 0) {
      const svg = d3.select(chartRef.current)
                    .append('svg')
                    .attr('width', 500)
                    .attr('height', 300);

      // Create tooltip div
      const tooltip = d3.select(chartRef.current)
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

      // Map distances to an array
      const distances: number[] = data.map(d => d.distance_raw);

      // Define scales
      const xScale = d3.scaleBand()
                       .domain(Array.from(Array(distances.length).keys()).map(String))
                       .range([0, 500])
                       .padding(0.1);
      
      const yScale = d3.scaleLinear()
                       .domain([0, d3.max(distances) as number])
                       .range([300, 0]);

      // Draw bars
      const bars = svg.selectAll('rect')
         .data(distances)
         .enter()
         .append('rect')
         .attr('x', (d, i) => xScale(String(i)) as number)
         .attr('y', d => yScale(d) as number)
         .attr('width', xScale.bandwidth())
         .attr('height', d => 300 - yScale(d) as number)
         .attr('fill', 'blue');

      // Add tooltips
      bars.on("mouseover", function (event, d) {  // Notice the 'event' argument
        tooltip.style("opacity", 1)
              .html(`Distance: ${d}`)
              .style("left", `${event.pageX}px`)
              .style("top", `${event.pageY}px`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });


      // Add click event to bars
      bars.on("click", function (d: number, i: number) {
          alert(`You clicked on bar ${i + 1} with distance ${d}`);
      });

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
