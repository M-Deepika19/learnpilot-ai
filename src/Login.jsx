import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event?.preventDefault();

        const trimmedEmail = email.trim();

        if (!trimmedEmail || !password) {
            alert("Please enter Email and Password");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:8080/api/users/login",
                {
                    email: trimmedEmail,
                    password: password
                }
            );

            const user = response.data;

            if (user?.email) {
                localStorage.setItem("userEmail", user.email);
            }

            if (user?.id) {
                localStorage.setItem("userId", user.id.toString());
            }

            if (user?.name) {
                localStorage.setItem("userName", user.name);
            }

            alert("Login Successful");

            navigate("/home");
        } catch (error) {
            console.error("Login Error:", error);

            if (error.response) {
                const message =
                    typeof error.response.data === "string"
                        ? error.response.data
                        : error.response.data?.message ||
                          "Invalid Email or Password";

                alert(message);
            } else {
                alert("Unable to connect to the server");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h1 className="title">
                    LearnPilot AI
                </h1>

                <p className="welcome-text">
                    Welcome Back
                </p>

                <form onSubmit={handleLogin}>
                    <label
                        className="label"
                        htmlFor="email"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        className="input"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        autoComplete="email"
                        required
                    />

                    <label
                        className="label"
                        htmlFor="password"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        className="input"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        required
                    />

                    <button
                        className="button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>
                </form>

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