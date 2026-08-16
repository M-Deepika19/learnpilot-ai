import React, { useState } from 'react';
import VideoSearch from '../../components/VideoSearch/VideoSearch';
import VideoRecommendation from '../../components/VideoRecommendation/VideoRecommendation';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import './VideoModule.css';

const VideoModule = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');

  const handleSearch = (videos) => {
    setSearchResults(videos);
    window.scrollTo(0, 300);
  };

  const handleVideoSelect = (videoId, title) => {
    setSelectedVideoId(videoId);
    setSelectedVideoTitle(title);
  };

  const handleClosePlayer = () => {
    setSelectedVideoId(null);
  };

  return (
    <div className="video-module-page">
      <div className="video-module-header">
        <h1>📺 Video Learning Hub</h1>
        <p>Search and learn from educational videos</p>
      </div>

      <div className="video-module-container">
        <VideoSearch onSearch={handleSearch} />
        
        {selectedVideoId && (
          <VideoPlayer 
            videoId={selectedVideoId}
            title={selectedVideoTitle}
            onClose={handleClosePlayer}
          />
        )}

        <VideoRecommendation 
          videos={searchResults}
          onVideoSelect={handleVideoSelect}
        />
      </div>
    </div>
  );
};

export default VideoModule;