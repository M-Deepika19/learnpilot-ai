import React from "react";
import { useNavigate } from "react-router-dom";
import "./PracticeWorkspace.css";

const PracticeWorkspace = () => {
  const navigate = useNavigate();

  return (
    <div className="practice-workspace-page">
      <header className="practice-navbar">
        <div className="practice-brand">
          <div className="practice-brand-icon">
            LP
          </div>

          <div className="practice-brand-text">
            <h2>LearnPilot</h2>
            <span>Practice Workspace</span>
          </div>
        </div>

        <button
          type="button"
          className="practice-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </header>

      <main className="practice-content">
        <section className="practice-hero">
          <h1>Practice Workspace</h1>

          <p>
            Build your problem-solving and programming skills
            in one focused learning environment.
          </p>
        </section>

        <section className="workspace-options">
          <div className="workspace-card">
            <div className="workspace-icon">
              📝
            </div>

            <span className="workspace-type">
              PROBLEM SOLVING
            </span>

            <h2>Problem Solving</h2>

            <p>
              Practice aptitude, mathematics, logical reasoning
              and problem-solving questions.
            </p>

            <button
              type="button"
              className="workspace-button problem-button"
              onClick={() =>
                navigate("/workspace/problem-solving")
              }
            >
              Start Practicing →
            </button>
          </div>

          <div className="workspace-card">
            <div className="workspace-icon">
              💻
            </div>

            <span className="workspace-type">
              PYTHON LAB
            </span>

            <h2>Python Coding Workspace</h2>

            <p>
              Write Python code, run programs and test your
              solutions.
            </p>

            <button
              type="button"
              className="workspace-button coding-button"
              onClick={() =>
                navigate("/workspace/coding")
              }
            >
              Start Coding →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PracticeWorkspace;