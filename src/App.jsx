import { Routes, Route, Navigate } from "react-router-dom";
import VideoModule from "./pages/VideoModule/VideoModule";
import VideoPlayerModule from "./pages/VideoPlayerModule/VideoPlayerModule";
import QuizPage from "./components/Quiz/QuizPage";
import PracticeWorkspace from "./pages/PracticeWorkspace/PracticeWorkspace";
import ProblemSolvingWorkspace from "./pages/ProblemSolvingWorkspace/ProblemSolvingWorkspace";
import Workspace from "./components/Workspace/Workspace";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Profile from "./Profile";
import Compiler from "./pages/Compiler";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import MockInterview from "./pages/MockInterview";
import Practice from "./pages/Practice";
import SmartNotes from "./pages/SmartNotes";
import VideoQuiz from "./pages/VideoQuiz";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="/learn" element={<Learn />} />

      <Route path="/videos" element={<VideoModule />} />

      <Route
        path="/videos-chat"
        element={<VideoPlayerModule />}
      />

      <Route
        path="/video/:videoId"
        element={<VideoPlayerModule />}
      />

      <Route path="/quiz" element={<QuizPage />} />

      <Route
        path="/workspace"
        element={<PracticeWorkspace />}
      />

      <Route
        path="/workspace/coding"
        element={<Workspace />}
      />

      <Route
        path="/workspace/problem-solving"
        element={<ProblemSolvingWorkspace />}
      />

      <Route path="/compiler" element={<Compiler />} />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/mock-interview"
        element={<MockInterview />}
      />

      <Route
        path="/practice"
        element={<Practice />}
      />

      <Route
        path="/smart-notes"
        element={<SmartNotes />}
      />

      <Route
        path="/video-quiz"
        element={<VideoQuiz />}
      />

      <Route
        path="/"
        element={<Navigate to="/home" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/home" replace />}
      />
    </Routes>
  );
}

export default App;