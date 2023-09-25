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
        .domain(data.map(d => String(new Date(d.start_time).toLocaleDateString())))
        .range([0, 500])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(distances) as number])
        .range([300, 0]);


      // 1. Calculate the Slope and Intercept for the Trendline
      let xMean = d3.mean(data, d => d.start_date_local_raw) as number;
      let yMean = d3.mean(data, d => {
        if (d.distance_raw === 0) {
          return 0; // or some other substitute value
        }
        return d.moving_time_raw / d.distance_raw * 1609.34;
      }) as number;
      
      let numerator = 0;
      let denominator = 0;

      console.log("Data:", data);

      data.forEach(d => {
        let x = d.start_date_local_raw;
        let y = d.moving_time_raw / d.distance_raw * 1609.34;

        // console.log(`For data point ${d}, x=${x}, y=${y}`);
        // console.log(`(x - xMean) * (y - yMean) = ${(x - xMean) * (y - yMean)}`);

          let pace = d.moving_time_raw / d.distance_raw * 1609.34;
          console.log(`Pace for data point: ${pace}`);
     
          const problematicPoints = data.filter(d => !isFinite(d.moving_time_raw / d.distance_raw * 1609.34));
          console.log('Problematic Data Points:', problematicPoints);
          if (d.distance_raw !== 0) {
            numerator += (x - xMean) * (y - yMean);
            denominator += (x - xMean) ** 2;
            console.log("Numerator: ", numerator);
            console.log("Denominator: ", denominator);
            console.log("xMean: ", xMean);
            console.log("yMean: ", yMean);
            /*
            
            */
      }

      });

      let slope = numerator / denominator;
      let intercept = yMean - (slope * xMean);


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

      // 2. Plot the Trendline
      let lineGenerator = d3.line<DataProps>()
      .x(d => {
        const xVal = xScale(new Date(d.start_time).toLocaleDateString());
        console.log("xVal: ", xVal);  // ie 416.8053244592346
        return xVal as number + xScale.bandwidth() / 2;
      })
        .y(d => {
        const yVal = slope * d.start_date_local_raw + intercept;
        console.log("slope: ", slope);  
        console.log("d.start_date_local_raw: ", d.start_date_local_raw);  // ie 1692600999
        console.log("yVal: ", yVal); 
        console.log("intercept: ", intercept); 
        return yScale(yVal);
        });

      svg.append('path')
        .datum(data)
        .attr('d', lineGenerator)
        .attr('stroke', 'red')
        .attr('fill', 'none');
    // Add overlay circles for trendline tooltips
if (isFinite(slope) && isFinite(intercept)) {  // Check if slope and intercept are finite
  svg.selectAll('.overlayCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'overlayCircle')
      .attr('cx', d => {
        const xVal = xScale(new Date(d.start_time).toLocaleDateString());
      return xVal ? xVal + xScale.bandwidth() / 2 : 0;
      })
      .attr('cy', d => {
        const yVal = slope * d.start_date_local_raw + intercept;
      return isFinite(yVal) ? yScale(yVal) : 0;  // Check if yVal is finite
      })
      .attr('r', 10) // radius of circle
      .attr('fill', 'transparent')
      .on('mouseover', function (event, d) {
        // display tooltip logic
      const estimatedPace = slope * d.start_date_local_raw + intercept;  // Your calculated pace
      if (isFinite(estimatedPace)) { // Check if estimatedPace is finite
        const paceMinutes = Math.floor(estimatedPace / 60);
        const paceSeconds = Math.round(estimatedPace % 60).toString().padStart(2, '0');
        tooltip.style("opacity", 1)
          .html(`
            <strong>Trendline data</strong><br/>
            <strong>Estimated Pace:</strong> ${paceMinutes}:${paceSeconds} / mi <br>
          `)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      }
      
      })
      .on('mouseout', function () {
        tooltip.style("opacity", 0);
      });
     }
   }
  }, [data]);

  return <div ref={chartRef}></div>;
};

export default D3Chart;
