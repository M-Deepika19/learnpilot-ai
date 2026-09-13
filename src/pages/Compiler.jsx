import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Compiler() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(
`print("Hello LearnPilot")`
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    if (!code.trim()) {
      setError("Please enter code.");
      return;
    }

    setLoading(true);
    setOutput("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/compiler/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          language,
          code,
          input
        })
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.output || "Program executed successfully.");
      } else {
        setError(data.error || "Code execution failed.");
        setOutput(data.output || "");
      }
    } catch (err) {
      setError("Unable to connect to compiler service.");
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (value) => {
    setLanguage(value);

    if (value === "python") {
      setCode(`print("Hello LearnPilot")`);
    }

    if (value === "javascript") {
      setCode(`console.log("Hello LearnPilot");`);
    }

    if (value === "java") {
      setCode(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello LearnPilot");
    }
}`);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Online Compiler</h1>
          <p>Write, compile and execute your programs.</p>
        </div>
      </div>

      <div className="compiler-toolbar">
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
        </select>

        <button
          className="primary-button"
          onClick={runCode}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>

      <div className="compiler-grid">
        <div className="compiler-panel">
          <h3>Code Editor</h3>

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
        </div>

        <div className="compiler-panel">
          <h3>Program Input</h3>

          <textarea
            className="compiler-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter program input..."
          />

          <h3>Output</h3>

          <pre className="compiler-output">
            {output || error || "Run your program to see the output."}
          </pre>
        </div>
      </div>
    </div>
  );
}