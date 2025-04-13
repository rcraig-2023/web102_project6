// import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   // State variables
//   const [breweries, setBreweries] = useState([]); // Renamed state for breweries
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // State for filters and search
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedType, setSelectedType] = useState('All'); // Filter by brewery_type
//   const [selectedState, setSelectedState] = useState('All'); // Filter by state (stretch feature)
//   const [filterHasWebsite, setFilterHasWebsite] = useState(false); // Filter by website (stretch feature)

//   // API Configuration (Simpler - No Token Needed)
//   const API_URL = `https://api.openbrewerydb.org/v1/breweries?page=1&per_page=100`;

//   // Effect hook for fetching data on component mount
//   useEffect(() => {
//     const fetchBreweries = async () => {
//       setIsLoading(true);
//       setError(null);
//       setBreweries([]); // Clear previous results

//       console.log("Fetching data from:", API_URL);

//       try {
//         const response = await fetch(API_URL);
//         console.log("API Response Status:", response.status, response.statusText);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log("API Success Response Body:", data);

//         if (data && Array.isArray(data)) {
//           setBreweries(data);
//           if (data.length === 0) {
//               console.warn("API returned successfully but with 0 breweries.");
//           }
//         } else {
//           console.warn("Received unexpected data structure:", data);
//           setError("Received unexpected data structure from API.");
//           setBreweries([]);
//         }

//       } catch (e) {
//         console.error("Fetching breweries failed:", e);
//         setError(`Failed to fetch breweries: ${e.message}. Check console & network tab.`);
//         setBreweries([]); // Clear breweries on error
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBreweries();
//   }, [API_URL]); // Dependency array includes API_URL

//   // --- Calculations for Summary Statistics & Filters (Derived State) ---

//   const totalItems = breweries.length;
//   const uniqueTypes = ['All', ...new Set(breweries.map(b => b.brewery_type).filter(Boolean).sort())];
//   const numberOfUniqueTypes = uniqueTypes.length - 1; // Exclude 'All'
//   const breweriesWithWebsites = breweries.filter(b => b.website_url).length;
//   const uniqueStates = ['All', ...new Set(breweries.map(b => b.state_province).filter(Boolean).sort())];
//   const numberOfUniqueStates = uniqueStates.length - 1; // Calculate the count, excluding 'All'


//   // --- Filtering Logic ---
//   const filteredBreweries = breweries.filter(brewery => {
//     const typeMatch = selectedType === 'All' || brewery.brewery_type === selectedType;
//     const nameMatch = brewery.name
//       ? brewery.name.toLowerCase().includes(searchTerm.toLowerCase())
//       : searchTerm === '';
//     const stateMatch = selectedState === 'All' || brewery.state_province === selectedState;
//     const websiteMatch = !filterHasWebsite || (brewery.website_url && brewery.website_url.trim() !== '');
//     return typeMatch && nameMatch && stateMatch && websiteMatch;
//   });

//   // --- JSX Rendering ---
//   return (
//     <div className="App">
//       <h1>Open Brewery DB Dashboard</h1>

//       {/* Loading State */}
//       {isLoading && <p className="loading-message">Loading breweries...</p>}

//       {/* Error State */}
//       {error && <p className="error-message">Error: {error}</p>}

//       {/* Dashboard Content */}
//       {!isLoading && (
//         <div className="dashboard">

//           {/* Summary Statistics */}
//           {breweries.length > 0 && (
//             <div className="summary-stats">
//               <h2>Data Summary (Total Fetched: {totalItems})</h2>
//               <p>Number of Unique Brewery Types: {numberOfUniqueTypes}</p>
//               <p>Breweries with Websites: {breweriesWithWebsites}</p>
//               {/* --- Display the new statistic --- */}
//               <p>Number of Unique States Represented: {numberOfUniqueStates}</p>
//             </div>
//           )}

//           {/* Controls for Search and Filtering */}
//           {breweries.length > 0 && (
//             <div className="controls">
//               {/* Search Input */}
//               <input
//                 type="text"
//                 placeholder="Search by name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 aria-label="Search breweries by name"
//               />

//               {/* Brewery Type Filter Dropdown */}
//               <select
//                 value={selectedType}
//                 onChange={(e) => setSelectedType(e.target.value)}
//                 aria-label="Filter by brewery type"
//               >
//                 {uniqueTypes.map(type => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>

//               {/* State Filter Dropdown (Stretch) */}
//               <select
//                  value={selectedState}
//                  onChange={(e) => setSelectedState(e.target.value)}
//                  aria-label="Filter by state"
//               >
//                  {uniqueStates.map(state => (
//                    <option key={state} value={state}>
//                      {state}
//                    </option>
//                  ))}
//                </select>

//               {/* "Has Website" Checkbox Filter (Stretch) */}
//               <label>
//                 <input
//                   type="checkbox"
//                   checked={filterHasWebsite}
//                   onChange={(e) => setFilterHasWebsite(e.target.checked)}
//                 />
//                 Has Website
//               </label>
//             </div>
//           )}

//           {/* Breweries List - Table Format */}
//           <h2>Breweries ({filteredBreweries.length} items showing)</h2>
//           {breweries.length > 0 ? (
//                 filteredBreweries.length > 0 ? (
//                   <div className="table-container">
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>Name</th>
//                           <th>Type</th>
//                           <th>Location</th>
//                           <th>Address</th>
//                           <th>Website</th>
//                           <th>Phone</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {filteredBreweries.map((brewery) => (
//                           <tr key={brewery.id}>
//                             <td>{brewery.name || 'N/A'}</td>
//                             <td>{brewery.brewery_type || 'N/A'}</td>
//                             <td>{brewery.city || 'N/A'}, {brewery.state_province || 'N/A'}</td>
//                             <td>{brewery.address_1 || 'N/A'}</td>
//                             <td>
//                               {brewery.website_url ? (
//                                 <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">Link</a>
//                               ) : ('N/A')}
//                             </td>
//                             <td>{brewery.phone || 'N/A'}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                  <p className="no-results-message">No breweries match your current search and filter criteria.</p>
//                 )
//           ) : (
//              !error && <p className="no-results-message">No breweries found from the API.</p>
//           )}
//         </div>
//       )} {/* End of !isLoading conditional rendering */}
//     </div> // End of App div
//   );
// }

// export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import DetailView from './DetailView';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Route for the Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Route for the Detail View */}
        <Route path="/detail/:id" element={<DetailView />} />
      </Routes>
    </div>
  );
}

export default App;