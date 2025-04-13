import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

function DetailView() {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrewery = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${id}`);
        if (!response.ok) throw new Error('Failed to fetch brewery details');
        const data = await response.json();
        setBrewery(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrewery();
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">
        <h1>{brewery.name}</h1>
        <p><strong>Type:</strong> {brewery.brewery_type}</p>
        <p><strong>State:</strong> {brewery.state}</p>
        <p><strong>City:</strong> {brewery.city}</p>
        <p><strong>Address:</strong> {brewery.street || 'N/A'}</p>
        <p><strong>Phone:</strong> {brewery.phone || 'N/A'}</p>
        <p>
          <strong>Website:</strong>{' '}
          {brewery.website_url ? (
            <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">
              {brewery.website_url}
            </a>
          ) : (
            'N/A'
          )}
        </p>
        <Link to="/">Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default DetailView;