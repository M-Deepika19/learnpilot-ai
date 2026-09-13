import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName || !trimmedEmail || !password) {
            alert("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:8080/api/users/register",
                {
                    name: trimmedName,
                    email: trimmedEmail,
                    password: password
                }
            );

            const message =
                typeof response.data === "string"
                    ? response.data
                    : response.data?.message || "Registration successful";

            alert(message);

            localStorage.setItem("userName", trimmedName);
            localStorage.setItem("userEmail", trimmedEmail);

            navigate("/login");
        } catch (error) {
            console.error("Registration Error:", error);

            if (error.response) {
                const message =
                    typeof error.response.data === "string"
                        ? error.response.data
                        : error.response.data?.message ||
                          "Registration failed";

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

                <p className="subtitle">
                    AI-Powered Personalized Learning Platform
                </p>

                <label className="label">
                    Name
                </label>

                <input
                    className="input"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                />

                <label className="label">
                    Email
                </label>

                <input
                    className="input"
                    type="email"
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                />

                <button
                    className="button"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="bottom-text">
                    Already have an account?
                </p>

                <p
                    className="link"
                    onClick={() => navigate("/login")}
                >
                    Login
                </p>
            </div>
        </div>
    );
}

export default Register;