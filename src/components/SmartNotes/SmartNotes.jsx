import React from 'react';
import './SmartNotes.css';

const SmartNotes = ({
  notes,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <section className="smart-notes-section">
        <div className="notes-header">
          <div>
            <h2>📝 Smart Notes</h2>
            <p>Creating organized study notes from this video...</p>
          </div>

          <span className="notes-badge">
            AI Generated
          </span>
        </div>

        <div className="notes-loading">
          <div className="spinner"></div>

          <h3>Creating your Smart Notes...</h3>

          <p>
            Analyzing the video and organizing important concepts.
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="smart-notes-section">
        <div className="notes-header">
          <div>
            <h2>📝 Smart Notes</h2>
            <p>Unable to create notes.</p>
          </div>
        </div>

        <div className="notes-error">
          ❌ {error}
        </div>
      </section>
    );
  }

  if (!notes) {
    return (
      <section className="smart-notes-section">
        <div className="notes-header">
          <div>
            <h2>📝 Smart Notes</h2>
            <p>
              Your study notes will appear here after the video finishes.
            </p>
          </div>

          <span className="notes-badge">
            Based on this video
          </span>
        </div>

        <div className="notes-empty">
          <div className="notes-empty-icon">
            📝
          </div>

          <h3>
            Smart Notes are ready to be generated
          </h3>

          <p>
            LearnPilot will organize the important concepts,
            examples, and summary from the video.
          </p>
        </div>
      </section>
    );
  }

  let parsedNotes = notes;

  if (typeof notes === 'string') {
    try {
      parsedNotes = JSON.parse(notes);
    } catch {
      parsedNotes = {
        mainTopics: [notes],
        importantConcepts: [],
        keyPoints: [],
        examples: [],
        summary: ''
      };
    }
  }

  return (
    <section className="smart-notes-section">

      <div className="notes-header">

        <div>
          <h2>📝 Smart Notes</h2>

          <p>
            Organized study notes from this video
          </p>
        </div>

        <span className="notes-badge">
          📚 Video Notes
        </span>

      </div>


      <div className="notes-body">

        <div className="notes-card">

          <div className="notes-card-title">
            📌 Main Topics
          </div>

          <ul>
            {(parsedNotes.mainTopics || []).map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>

        </div>


        <div className="notes-card">

          <div className="notes-card-title">
            💡 Important Concepts
          </div>

          <div className="concept-list">

            {(parsedNotes.importantConcepts || []).map(
              (item, index) => {

                if (
                  typeof item === 'string'
                ) {
                  return (
                    <div
                      className="concept-item"
                      key={index}
                    >
                      <span className="concept-icon">
                        ✓
                      </span>

                      <p>
                        {item}
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    className="concept-item"
                    key={index}
                  >
                    <span className="concept-icon">
                      ✓
                    </span>

                    <div>
                      <h4>
                        {item.title}
                      </h4>

                      <p>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              }
            )}

          </div>

        </div>


        <div className="notes-card">

          <div className="notes-card-title">
            ⭐ Key Points
          </div>

          <ul className="key-points-list">
            {(parsedNotes.keyPoints || []).map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>

        </div>


        <div className="notes-card">

          <div className="notes-card-title">
            💻 Examples
          </div>

          <div className="examples-list">

            {(parsedNotes.examples || []).map(
              (item, index) => {

                if (
                  typeof item === 'string'
                ) {
                  return (
                    <div
                      className="example-item"
                      key={index}
                    >
                      <p>
                        {item}
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    className="example-item"
                    key={index}
                  >

                    {item.title && (
                      <h4>
                        {item.title}
                      </h4>
                    )}

                    {item.description && (
                      <p>
                        {item.description}
                      </p>
                    )}

                    {item.code && (
                      <pre>
                        <code>
                          {item.code}
                        </code>
                      </pre>
                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>


        <div className="notes-card summary-card">

          <div className="notes-card-title">
            📖 Summary
          </div>

          <p className="summary-text">
            {parsedNotes.summary}
          </p>

        </div>

      </div>


      <div className="notes-actions">

        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(
              JSON.stringify(
                parsedNotes,
                null,
                2
              )
            );
          }}
        >
          📋 Copy Notes
        </button>

        <button
          type="button"
          onClick={() => {
            window.print();
          }}
        >
          🖨️ Print Notes
        </button>

        <button
          type="button"
        >
          💾 Save Notes
        </button>

        <button
          type="button"
        >
          🧠 Take Quiz
        </button>

      </div>

    </section>
  );
};

export default SmartNotes;