import ApexCharts from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const SimpleChart: React.FC = () => {
  console.log("Inside SimpleChart.tsx"); // <-- This is your log statement
  const series = [
    {
      name: "Series 1",
      data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: 'line'
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
    }
  };

  return <ApexCharts options={options} series={series} type="line" />;
};

export default SimpleChart;
