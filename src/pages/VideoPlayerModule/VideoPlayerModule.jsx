import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import VideoPlayerWithChat from "../../components/VideoChat/VideoPlayerWithChat";

import "./VideoPlayerModule.css";

function VideoPlayerModule() {
  const navigate = useNavigate();
  const location = useLocation();

  const [url, setUrl] = useState(
    location.state?.videoUrl || ""
  );

  const [videoId, setVideoId] = useState(
    location.state?.videoId || ""
  );

  const [videoTitle, setVideoTitle] = useState(
    location.state?.videoTitle || ""
  );

  const userId =
    location.state?.userId ||
    localStorage.getItem("userId");

  const extractVideoId = (videoUrl) => {
    const value = videoUrl.trim();

    if (!value) {
      return null;
    }

    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&]+)/,
      /(?:youtu\.be\/)([^?&]+)/,
      /(?:youtube\.com\/embed\/)([^?&]+)/,
      /(?:youtube\.com\/shorts\/)([^?&]+)/
    ];

    for (const pattern of patterns) {
      const match = value.match(pattern);

      if (match) {
        return match[1];
      }
    }

    if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
      return value;
    }

    return null;
  };

  const handleStartVideo = () => {
    const extractedId = extractVideoId(url);

    if (!extractedId) {
      alert("Please enter a valid YouTube video URL");
      return;
    }

    setVideoId(extractedId);

    if (!videoTitle.trim()) {
      setVideoTitle("Learning Video");
    }
  };

  const handleChangeVideo = () => {
    setVideoId("");
    setUrl("");
    setVideoTitle("");
  };

  return (
    <div className="video-module-page">

      <div className="video-module-header">

        <button
          className="back-button"
          onClick={() => navigate("/home")}
        >
          ← Back
        </button>

        <div>
          <h1>LearnPilot AI</h1>
          <p>Your intelligent learning companion</p>
        </div>

      </div>

      {!videoId ? (

        <div className="video-url-card">

          <h2>Start Learning with a Video</h2>

          <p>
            Paste a YouTube educational video and learn
            with AI-powered video assistance, notes,
            chat and quizzes.
          </p>

          <label>Video Title</label>

          <input
            type="text"
            placeholder="Enter video title (optional)"
            value={videoTitle}
            onChange={(event) =>
              setVideoTitle(event.target.value)
            }
          />

          <label>YouTube Video URL</label>

          <input
            type="text"
            placeholder="Paste YouTube video URL"
            value={url}
            onChange={(event) =>
              setUrl(event.target.value)
            }
          />

          <button
            className="start-video-button"
            onClick={handleStartVideo}
          >
            ▶ Start Learning
          </button>

        </div>

      ) : (

        <div className="active-video-section">

          <div className="current-video-header">

            <div>
              <h2>{videoTitle}</h2>

              <p>
                AI-powered learning session
              </p>

              <small className="current-video-url">
                https://www.youtube.com/watch?v={videoId}
              </small>
            </div>

            <button
              className="change-video-button"
              onClick={handleChangeVideo}
            >
              Change Video
            </button>

          </div>

          <VideoPlayerWithChat
            videoId={videoId}
            videoTitle={videoTitle}
            userId={userId}
          />

        </div>

      )}

    </div>
  );
}

export default VideoPlayerModule;