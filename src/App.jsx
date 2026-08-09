import { BrowserRouter, Routes, Route } from "react-router-dom";

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

                <Route path="/" element={<Home />} />

                <Route path="/profile" element={<Profile />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;