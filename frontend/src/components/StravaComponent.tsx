//D:\pitt\test-vite-app-3\frontend\src\components\StravaComponent.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const StravaComponent: React.FC = () => {
  const [options, _setOptions] = useState({
    chart: {
      type: 'line' as 'line',
    },
  });

  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/strava')
      .then(response => {
        console.log("Fetched data:", response.data);
        setSeries([
          {
            name: 'Distance',
            data: response.data.map((item: any) => parseFloat(item.distance)),
          },
        ]);
      })
      .catch(error => console.error('There was an error!', error));
  }, []);

  return (
    <div>
      <ReactApexChart options={options} series={series} type="line" />
    </div>
  );
};

export default StravaComponent;
