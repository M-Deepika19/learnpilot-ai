import React, { useState } from 'react';
import './VideoSearch.css';

const VideoSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    
    try {
      const API_KEY =import.meta.env.VITE_YOUTUBE_API_KEY;
      console.log('API Key:', API_KEY);
      
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=12&key=${API_KEY}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('API Response:', data);
      
      onSearch(data.items || []);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-search-container">
      <h2>Search Videos</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search educational videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default VideoSearch;