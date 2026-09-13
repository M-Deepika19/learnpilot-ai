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
        {videos.map((video) => {
          const videoId = video?.id?.videoId;
          const title = video?.snippet?.title || 'Untitled Video';
          const thumbnail =
            video?.snippet?.thumbnails?.medium?.url ||
            video?.snippet?.thumbnails?.default?.url;
          const channelName = video?.snippet?.channelTitle || '';

          if (!videoId) {
            return null;
          }

          return (
            <div key={videoId} className="video-card">
              <div className="video-thumbnail">
                <img
                  src={thumbnail}
                  alt={title}
                  loading="lazy"
                />

                <div className="play-icon">▶</div>
              </div>

              <div className="video-info">
                <h4>{title}</h4>

                <p className="channel-name">
                  {channelName}
                </p>

                <button
                  onClick={() => onVideoSelect(videoId, title)}
                >
                  ▶ Watch + Ask AI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoRecommendation;