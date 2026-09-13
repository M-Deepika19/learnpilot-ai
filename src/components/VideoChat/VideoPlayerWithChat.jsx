import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AIChat from "../AIChat/AIChat";
import SmartNotes from "../SmartNotes/SmartNotes";
import "./VideoPlayerWithChat.css";

const VideoPlayerWithChat = ({ videoId, videoTitle, userId }) => {
  const navigate = useNavigate();

  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [smartNotes, setSmartNotes] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState("");

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const apiReadyRef = useRef(false);
  const notesGeneratedRef = useRef(false);

  const formatVideoTime = (seconds) => {
    const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    setChatHistory([]);
    setSmartNotes("");
    setNotesLoading(false);
    setNotesError("");
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    notesGeneratedRef.current = false;
  }, [videoId]);

  const generateSmartNotes = useCallback(async () => {
    if (!videoId || notesGeneratedRef.current) {
      return;
    }

    notesGeneratedRef.current = true;
    setNotesLoading(true);
    setNotesError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/notes/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId,
            videoId,
            videoTitle
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate Smart Notes");
      }

      setSmartNotes(data.notes || data.smartNotes || "");
    } catch (error) {
      notesGeneratedRef.current = false;
      setNotesError(error.message || "Unable to generate Smart Notes.");
    } finally {
      setNotesLoading(false);
    }
  }, [videoId, videoTitle, userId]);

  useEffect(() => {
    if (!videoId || !playerContainerRef.current) {
      return;
    }

    let cancelled = false;

    const destroyPlayer = () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error(error);
        }

        playerRef.current = null;
      }
    };

    const createPlayer = () => {
      if (
        cancelled ||
        !window.YT ||
        !window.YT.Player ||
        !playerContainerRef.current
      ) {
        return;
      }

      destroyPlayer();

      playerRef.current = new window.YT.Player(
        playerContainerRef.current,
        {
          width: "100%",
          height: "400",
          videoId,
          playerVars: {
            autoplay: 0,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              if (cancelled) {
                return;
              }

              playerRef.current = event.target;

              setDuration(Number(event.target.getDuration()) || 0);
              setCurrentTime(Number(event.target.getCurrentTime()) || 0);
            },

            onStateChange: (event) => {
              if (cancelled) {
                return;
              }

              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              }

              if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              }

              if (event.data === window.YT.PlayerState.BUFFERING) {
                setIsPlaying(false);
              }

              if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
                setCurrentTime(Number(event.target.getDuration()) || 0);
                generateSmartNotes();
              }
            },

            onError: (event) => {
              console.error("YouTube player error:", event.data);
            }
          }
        }
      );
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const existingScript = document.getElementById("youtube-iframe-api");

      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
      }

      window.onYouTubeIframeAPIReady = () => {
        apiReadyRef.current = true;
        createPlayer();
      };
    }

    return () => {
      cancelled = true;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      destroyPlayer();
    };
  }, [videoId, generateSmartNotes]);

  useEffect(() => {
    if (!videoId) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const player = playerRef.current;

      if (
        !player ||
        typeof player.getCurrentTime !== "function" ||
        typeof player.getDuration !== "function"
      ) {
        return;
      }

      try {
        const current = Number(player.getCurrentTime()) || 0;
        const total = Number(player.getDuration()) || 0;

        setCurrentTime(current);
        setDuration(total);
      } catch (error) {
        console.error(error);
      }
    }, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [videoId]);

  const skipBackward = () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const current = Number(player.getCurrentTime()) || 0;
    const newTime = Math.max(0, current - 10);

    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const current = Number(player.getCurrentTime()) || 0;
    const total = Number(player.getDuration()) || 0;

    const newTime = Math.min(total, current + 10);

    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const togglePlayPause = () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeekBarChange = (event) => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const newTime = Number(event.target.value) || 0;

    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleSendMessage = async (message) => {
    if (!videoId || isLoading || !message.trim()) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/rag/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: message,
          videoId,
          videoTitle
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "AI request failed");
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content:
          data.answer ||
          data.aiResponse ||
          "No AI response received.",
        timestamp: new Date().toLocaleTimeString(),
        videoTimestamp: data.timestamp ?? null,
        startTime:
          data.startTime !== null &&
          data.startTime !== undefined
            ? Number(data.startTime)
            : null
      };

      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          content: "Unable to connect to LearnPilot AI. Please try again.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const jumpToTimestamp = (startTime) => {
    const player = playerRef.current;

    if (
      !player ||
      startTime === null ||
      startTime === undefined
    ) {
      return;
    }

    const seconds = Number(startTime);

    if (Number.isNaN(seconds)) {
      return;
    }

    player.seekTo(seconds, true);
    player.playVideo();

    setCurrentTime(seconds);
    setIsPlaying(true);
  };

  const handleQuiz = () => {
    navigate("/quiz", {
      state: {
        videoId,
        videoTitle,
        userId
      }
    });
  };

  const handleWorkspace = () => {
    navigate("/workspace", {
      state: {
        videoId,
        videoTitle,
        userId
      }
    });
  };

  if (!videoId) {
    return null;
  }

  return (
    <div className="video-player-with-chat">
      <div className="player-section">
        <div className="video-player-wrapper">
          <div
            ref={playerContainerRef}
            style={{
              width: "100%",
              height: "400px"
            }}
          />
        </div>

        <div className="video-controls">
          <button type="button" onClick={skipBackward}>
            ⏪ 10s
          </button>

          <button type="button" onClick={togglePlayPause}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          <button type="button" onClick={skipForward}>
            10s ⏩
          </button>

          <button type="button" onClick={handleQuiz}>
            📝 Take Quiz
          </button>

          <button type="button" onClick={handleWorkspace}>
            💻 Practice Workspace
          </button>

          <span className="video-time">
            {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
          </span>
        </div>

        <input
          type="range"
          className="video-seek-bar"
          min="0"
          max={duration || 0}
          step="1"
          value={Math.min(currentTime, duration || 0)}
          onChange={handleSeekBarChange}
        />

        <h3>{videoTitle}</h3>

        <SmartNotes
          notes={smartNotes}
          isLoading={notesLoading}
          error={notesError}
        />
      </div>

      <div className="chat-section">
        <AIChat
          chatHistory={chatHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onJumpToTimestamp={jumpToTimestamp}
        />
      </div>
    </div>
  );
};
export default VideoPlayerWithChat;