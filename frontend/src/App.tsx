//D:\pitt\test-vite-app-3\frontend\src\App.tsx
import React, { useState, useEffect } from 'react';
import D3Chart from './components/D3Chart';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    // Fetch your data from your backend here
    // For demonstration, let's pretend we fetched the JSON data
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/strava');
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  const filterData = () => {
    return selectedType === "All" ? data : data.filter(item => item.type === selectedType);
  };

  return (
    <div>
      <button onClick={() => setSelectedType("All")}>All</button>
      <button onClick={() => setSelectedType("Run")}>Run</button>
      {/* Add more buttons for other types of activities here */}
      <D3Chart data={filterData()} />
    </div>
  );
};

export default App;
