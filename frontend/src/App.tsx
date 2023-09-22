// D:\pitt\test-vite-app-3\frontend\src\App.tsx
import React, { useState, useEffect } from 'react';
import D3Chart from './components/D3Chart';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [uniqueTypes, setUniqueTypes] = useState<string[]>(["All"]); // To store unique display_types

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/strava');
      const fetchedData = await response.json();
      setData(fetchedData);

      // Get unique display_types
      const types = Array.from(new Set(fetchedData.map((item: any) => item.display_type)));
      setUniqueTypes(["All", ...types]);
    };
    fetchData();
  }, []);

  const filterData = () => {
    return selectedType === "All" ? data : data.filter(item => item.display_type === selectedType);
  };

  return (
    <div>
      {uniqueTypes.map((type, index) => (
        <button key={index} onClick={() => setSelectedType(type)}>
          {type}
        </button>
      ))}
      <D3Chart data={filterData()} />
    </div>
  );
};

export default App;
