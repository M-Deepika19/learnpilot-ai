import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VideoModule from "./pages/VideoModule/VideoModule";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Profile from "./Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/videos" element={<VideoModule />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;