import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {

        // Check empty fields
        if (!email || !password) {
            alert("Please enter Email and Password");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:8080/api/users/login",
                {
                    email: email,
                    password: password
                }
            );

            // Check login response
            if (response.data === "Login Successfully") {

                alert("Login Successfully");

                // Save logged-in user's email
                localStorage.setItem("userEmail", email);

                // Go to Home page
                navigate("/");

            } else {

                alert("Invalid Email or Password");

            }

        } catch (error) {

            console.log("Login Error:", error);

            alert("Unable to connect to the server");

        }
    };

    return (
        <div className="container">

            <div className="card">

                <h1 className="title">
                    LearnPilotAI
                </h1>

                <h3 className="subtitle">
                    Welcome Back
                </h3>

                <label className="label">
                    Email
                </label>

                <input
                    className="input"
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                />

                <label className="label">
                    Password
                </label>

                <input
                    className="input"
                    type="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                />

                <button
                    className="button"
                    onClick={handleLogin}
                >
                    Login
                </button>

                <p className="bottom-text">
                    Don't have an account?
                </p>

                <p
                    className="link"
                    onClick={() => navigate("/register")}
                >
                    Create Account
                </p>

            </div>

        </div>
    );
}

export default Login;