import React from 'react';
import './VideoRecommendation.css';

const VideoRecommendation = ({ videos, onVideoSelect }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="no-videos">
        <p>🔍 No videos found. Try searching for something!</p>
      </div>
    );
  }

  return (
    <div className="video-results-container">
      <h3>Search Results ({videos.length} videos found)</h3>
      <div className="video-grid">
        {videos.map((video) => (
          <div 
            key={video.id.videoId} 
            className="video-card"
            onClick={() => onVideoSelect(video.id.videoId, video.snippet.title)}
          >
            <div className="video-thumbnail">
              <img 
                src={video.snippet.thumbnails.medium.url} 
                alt={video.snippet.title}
                loading="lazy"
              />
              <div className="play-icon">▶</div>
            </div>
            <div className="video-info">
              <h4>{video.snippet.title}</h4>
              <p className="channel-name">{video.snippet.channelTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoRecommendation;