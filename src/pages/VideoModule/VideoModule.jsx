import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoSearch from '../../components/VideoSearch/VideoSearch';
import VideoRecommendation from '../../components/VideoRecommendation/VideoRecommendation';
import './VideoModule.css';

const VideoModule = () => {
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (videos) => {
    setSearchResults(videos);
    window.scrollTo(0, 300);
  };

  const handleVideoSelect = (videoId, title) => {
    navigate(
      `/videos-chat?v=${videoId}&title=${encodeURIComponent(title)}`
    );
  };

  return (
    <div className="video-module-page">
      <div className="video-module-header">
        <h1>📺 Video Learning Hub</h1>
        <p>Search and learn from educational videos</p>
      </div>

      <div className="video-module-container">
        <VideoSearch onSearch={handleSearch} />

        <VideoRecommendation
          videos={searchResults}
          onVideoSelect={handleVideoSelect}
        />
      </div>
    </div>
  );
};

export default VideoModule;