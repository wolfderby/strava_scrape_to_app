// D:\pitt\test-vite-app-3\frontend\src\components\D3Chart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Define the type for your data, assuming each data object has a distance_raw property that is a number
type DataProps = {
  distance_raw: number;
  date: string;
  start_date: string;
  start_date_local_raw: number;
  start_time: string;
  moving_time: string;
  moving_time_raw: number;
  distance: string;
};

interface D3ChartProps {
  data: DataProps[];
}


const D3Chart: React.FC<D3ChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    // Sort the data by date
    data.sort((a, b) => a.start_date_local_raw - b.start_date_local_raw);

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
        .domain(data.map((d, i) => String(new Date(d.start_time).toLocaleDateString())))
        .range([0, 500])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(distances) as number])
        .range([300, 0]);

      // Draw bars
      const bars = svg.selectAll('rect')
        .data(data) // Use data directly instead of distances
        .enter()
        .append('rect')
        .attr('x', (d) => xScale(new Date(d.start_time).toLocaleDateString()) as number)
        .attr('y', d => yScale(d.distance_raw) as number)
        .attr('width', xScale.bandwidth())
        .attr('height', d => 300 - yScale(d.distance_raw) as number)
        .attr('fill', 'blue');


      // Add tooltips
      bars.on("mouseover", function (event, d) {
        // Calculate pace in MM:SS/mi
        const pace = (d.moving_time_raw / d.distance_raw * 1609.34); // pace in seconds per mile
        const paceMinutes = Math.floor(pace / 60);
        const paceSeconds = Math.round(pace % 60).toString().padStart(2, '0');

        tooltip.style("opacity", 1)
          .html(`
          <strong>Date:</strong> ${d.start_date} <br>
          <strong>Time:</strong> ${new Date(d.start_time).toLocaleTimeString()} <br>
          <strong>Duration:</strong> ${d.moving_time} <br>
          <strong>Distance:</strong> ${d.distance} miles <br>
          <strong>Pace:</strong> ${paceMinutes}:${paceSeconds} / mi
          `)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
        .on("mouseout", function () {
          tooltip.style("opacity", 0);
        });


      // Add click event to bars
      bars.on("click", function (_event: any, d: DataProps) {
        alert(`You clicked on bar with distance ${d.distance_raw}`);
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
