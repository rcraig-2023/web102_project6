import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import Sidebar from './Sidebar';

function Dashboard() {
  const [breweries, setBreweries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://api.openbrewerydb.org/v1/breweries?page=1&per_page=100`;

  useEffect(() => {
    const fetchBreweries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setBreweries(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBreweries();
  }, []);

  const breweryTypes = breweries.reduce((acc, brewery) => {
    const type = brewery.brewery_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(breweryTypes).map(([type, count]) => ({
    type,
    count,
  }));

  const breweryStates = breweries.reduce((acc, brewery) => {
    const state = brewery.state || 'Unknown';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  const stateChartData = Object.entries(breweryStates).map(([state, count]) => ({
    state,
    count,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF00AA'];

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">
        <h1>Brewery Dashboard</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && !error && (
          <>
            <ul>
              {breweries.map((brewery) => (
                <li key={brewery.id}>
                  <Link to={`/detail/${brewery.id}`}>{brewery.name}</Link>
                </li>
              ))}
            </ul>

            <h2>Breweries by Type</h2>
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>

            <h2>Breweries by State</h2>
            <PieChart width={400} height={400}>
              <Pie
                data={stateChartData}
                dataKey="count"
                nameKey="state"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {stateChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;