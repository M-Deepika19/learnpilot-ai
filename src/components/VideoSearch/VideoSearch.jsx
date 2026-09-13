import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VideoSearch.css";

const VideoSearch = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a topic to search.");
      return;
    }

    setLoading(true);
    setError("");
    setVideos([]);

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
          searchQuery
        )}&maxResults=12&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch videos.");
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        setVideos(data.items);
      } else {
        setError(
          "No learning videos found. Try a different topic."
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while searching."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (videoId, videoTitle) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    localStorage.setItem(
      "learnpilot_video",
      JSON.stringify({
        videoId,
        videoUrl,
        videoTitle
      })
    );

    navigate("/videos-chat", {
      state: {
        videoId,
        videoTitle,
        videoUrl,
        userId: localStorage.getItem("userId")
      }
    });
  };

  return (
    <div className="video-search-page">

      <header className="video-search-header">

        <div className="video-search-brand">
          <div className="video-search-logo">
            LP
          </div>

          <span>LearnPilot AI</span>
        </div>

        <button
          className="video-search-back"
          onClick={() => navigate("/home")}
        >
          ← Home
        </button>

      </header>

      <main className="video-search-main">

        <section className="video-search-hero">

          <div className="video-search-badge">
            AI LEARNING LIBRARY
          </div>

          <h1>
            Find something worth
            <span> learning today.</span>
          </h1>

          <p>
            Search thousands of educational videos and
            start learning instantly with AI-powered
            chat, notes, quizzes and practice.
          </p>

          <form
            onSubmit={handleSearch}
            className="video-search-form"
          >

            <div className="video-search-input-wrap">

              <span className="search-input-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search topics like Java Arrays, Python, React..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError("");
                }}
              />

            </div>

            <button
              type="submit"
              className="video-search-button"
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search Videos"}
            </button>

          </form>

          <div className="search-suggestions">
            <span>Try:</span>

            <button
              onClick={() => setSearchQuery("Java Arrays")}
            >
              Java Arrays
            </button>

            <button
              onClick={() =>
                setSearchQuery("Python Basics")
              }
            >
              Python Basics
            </button>

            <button
              onClick={() =>
                setSearchQuery("React Tutorial")
              }
            >
              React Tutorial
            </button>

            <button
              onClick={() =>
                setSearchQuery("Data Structures")
              }
            >
              Data Structures
            </button>
          </div>

        </section>

        {error && (
          <div className="video-search-error">
            <span>!</span>
            {error}
          </div>
        )}

        {loading && (
          <div className="video-search-loading">
            <span className="search-spinner"></span>
            <p>Finding the best learning videos...</p>
          </div>
        )}

        {!loading && videos.length > 0 && (

          <section className="video-results-section">

            <div className="video-results-header">

              <div>
                <span>SEARCH RESULTS</span>

                <h2>
                  Videos for “{searchQuery}”
                </h2>
              </div>

              <div className="results-count">
                {videos.length} videos
              </div>

            </div>

            <div className="videos-grid">

              {videos.map((video) => {

                const videoId = video.id.videoId;
                const title = video.snippet.title;
                const thumbnail =
                  video.snippet.thumbnails.high?.url ||
                  video.snippet.thumbnails.medium?.url;

                return (
                  <article
                    key={videoId}
                    className="video-result-card"
                    onClick={() =>
                      handleVideoClick(
                        videoId,
                        title
                      )
                    }
                  >

                    <div className="video-thumbnail">

                      <img
                        src={thumbnail}
                        alt={title}
                      />

                      <div className="thumbnail-overlay">
                        <div className="play-circle">
                          ▶
                        </div>
                      </div>

                    </div>

                    <div className="video-result-content">

                      <h3>
                        {title}
                      </h3>

                      <p className="video-channel">
                        {video.snippet.channelTitle}
                      </p>

                      <div className="video-card-footer">

                        <span>
                          🎓 Educational Video
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();

                            handleVideoClick(
                              videoId,
                              title
                            );
                          }}
                        >
                          Start Learning →
                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          </section>
        )}

        {!loading &&
          videos.length === 0 &&
          !error && (

            <section className="video-empty-state">

              <div className="empty-illustration">
                🎓
              </div>

              <h2>
                What would you like to learn?
              </h2>

              <p>
                Search for a topic and discover
                educational videos to start your
                learning journey.
              </p>

              <div className="empty-features">

                <div>
                  <span>🎥</span>
                  <strong>Watch</strong>
                  <small>
                    Learn from videos
                  </small>
                </div>

                <div>
                  <span>💬</span>
                  <strong>Ask AI</strong>
                  <small>
                    Ask questions while learning
                  </small>
                </div>

                <div>
                  <span>📝</span>
                  <strong>Take Notes</strong>
                  <small>
                    Generate smart notes
                  </small>
                </div>

                <div>
                  <span>🧠</span>
                  <strong>Take Quiz</strong>
                  <small>
                    Test your knowledge
                  </small>
                </div>

              </div>

            </section>
          )}

      </main>

    </div>
  );
};

export default VideoSearch;