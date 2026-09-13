import React, {
  useState,
  useRef,
  useEffect
} from 'react';

import './AIChat.css';

const AIChat = ({
  chatHistory,
  onSendMessage,
  isLoading,
  onJumpToTimestamp
}) => {

  const [inputMessage, setInputMessage] =
    useState('');

  const messagesEndRef =
    useRef(null);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });

  }, [chatHistory, isLoading]);


  const handleSend = () => {

    if (
      !inputMessage.trim() ||
      isLoading
    ) {
      return;
    }

    onSendMessage(
      inputMessage.trim()
    );

    setInputMessage('');

  };


  const handleKeyDown = (e) => {

    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {

      e.preventDefault();

      handleSend();

    }

  };


  const handleTimestampClick = (
    startTime
  ) => {

    if (
      onJumpToTimestamp &&
      startTime !== null &&
      startTime !== undefined
    ) {

      onJumpToTimestamp(
        startTime
      );

    }

  };


  return (

    <div className="ai-chat-container">

      <div className="chat-header">

        <h3>
          🤖 Ask AI
        </h3>

        <p>
          Ask questions about this video
        </p>

      </div>


      <div className="chat-messages">

        {chatHistory.length === 0 &&
          !isLoading && (

          <div className="no-messages">

            <p>
              💬 Ask your first question!
            </p>

            <p>
              Example:
              "Why do arrays start from 0?"
            </p>

          </div>

        )}


        {chatHistory.map((message) => (

          <div
            key={message.id}
            className={
              `message ${message.type}`
            }
          >

            <span className="message-icon">

              {message.type === 'user'
                ? '👤'
                : '🤖'}

            </span>


            <div className="message-content">

              <p>
                {message.content}
              </p>


              {message.type === 'ai' &&
                message.videoTimestamp &&
                message.startTime !== null &&
                message.startTime !== undefined && (

                <div className="video-timestamp">

                  <div className="timestamp-text">

                    📍 Found in video at{' '}

                    <strong>
                      {message.videoTimestamp}
                    </strong>

                  </div>


                  <button
                    type="button"
                    className="timestamp-button"
                    onClick={() =>
                      handleTimestampClick(
                        message.startTime
                      )
                    }
                  >

                    ▶ Go to timestamp

                  </button>

                </div>

              )}


              <small className="message-time">

                {message.timestamp}

              </small>

            </div>

          </div>

        ))}


        {isLoading && (

          <div className="message ai loading">

            <span className="message-icon">

              🤖

            </span>


            <div className="message-content">

              <div className="typing-indicator">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>

          </div>

        )}


        <div
          ref={messagesEndRef}
        />

      </div>


      <div className="chat-input-area">

        <textarea
          value={inputMessage}
          onChange={(e) =>
            setInputMessage(
              e.target.value
            )
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this video..."
          className="chat-input"
          rows="3"
          disabled={isLoading}
        />


        <button
          onClick={handleSend}
          className="send-button"
          disabled={
            isLoading ||
            !inputMessage.trim()
          }
        >

          {isLoading
            ? 'Thinking...'
            : 'Send'}

        </button>

      </div>

    </div>

  );

};

export default AIChat;