import React, { useState } from "react";
import { runCode } from "../../services/compilerService";
import "./Workspace.css";

const Workspace = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(
`print("Hello, LearnPilot!")

name = input("Enter your name: ")
print("Welcome,", name)`
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  const getStarterCode = (selectedLanguage) => {
    switch (selectedLanguage) {
      case "python":
        return `print("Hello, LearnPilot!")

name = input("Enter your name: ")
print("Welcome,", name)`;

      case "javascript":
        return `const name = "LearnPilot";
console.log("Hello,", name);`;

      case "java":
        return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, LearnPilot!");
    }
}`;

      default:
        return "";
    }
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);
    setCode(getStarterCode(selectedLanguage));
    setInput("");
    setOutput("");
    setError("");
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError("Please enter some code.");
      setOutput("");
      return;
    }

    try {
      setRunning(true);
      setOutput("");
      setError("");

      const result = await runCode(
        language,
        code,
        input
      );

      if (result.success) {
        setOutput(
          result.output || "Program executed successfully."
        );
        setError("");
      } else {
        setOutput(result.output || "");
        setError(
          result.error || "Code execution failed."
        );
      }
    } catch (err) {
      setOutput("");
      setError(
        err.message || "Unable to execute code."
      );
    } finally {
      setRunning(false);
    }
  };

  const clearWorkspace = () => {
    setCode("");
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="workspace-editor">
      <div className="workspace-toolbar">
        <div className="workspace-title">
          <span>💻 Coding Workspace</span>
        </div>

        <div className="workspace-language">
          <label htmlFor="workspace-language">
            Language
          </label>

          <select
            id="workspace-language"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="workspace-actions">
          <button
            type="button"
            className="workspace-clear-button"
            onClick={clearWorkspace}
          >
            Clear
          </button>

          <button
            type="button"
            className="workspace-run-button"
            onClick={handleRunCode}
            disabled={running}
          >
            {running ? "Running..." : "▶ Run Code"}
          </button>
        </div>
      </div>

      <div className="workspace-panels">
        <div className="workspace-panel workspace-code-panel">
          <div className="workspace-panel-header">
            <span>Code Editor</span>
            <span className="workspace-language-label">
              {language}
            </span>
          </div>

          <textarea
            className="workspace-code-editor"
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            spellCheck="false"
            placeholder="Write your code here..."
          />
        </div>

        <div className="workspace-panel workspace-input-panel">
          <div className="workspace-panel-header">
            <span>Input</span>
          </div>

          <textarea
            className="workspace-input-editor"
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Enter program input here..."
          />
        </div>
      </div>

      <div className="workspace-output-panel">
        <div className="workspace-panel-header">
          <span>Output</span>
        </div>

        <div className="workspace-output-content">
          {output && (
            <pre className="workspace-output-success">
              {output}
            </pre>
          )}

          {error && (
            <pre className="workspace-output-error">
              {error}
            </pre>
          )}

          {!output && !error && (
            <span className="workspace-output-placeholder">
              Run your code to see the output here.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;