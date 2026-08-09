import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const response = await axios.post(
                "http://localhost:8080/api/users/register",
                {
                    name: name,
                    email: email,
                    password: password
                }
            );

            alert(response.data);

            // Go to Login after successful registration
            navigate("/login");

        } catch (error) {

            console.error("Registration Error:", error);

            alert("Registration Failed");
        }
    };

    return (
        <div className="container">

            <div className="card">

                <h1 className="title">
                    LearnPilotAI
                </h1>

                <label className="label">
                    Name
                </label>

                <input
                    className="input"
                    type="text"
                    placeholder="Enter your Name"
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

                <label className="label">
                    Confirm Password
                </label>

                <input
                    className="input"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(event.target.value)
                    }
                />

                <button
                    className="button"
                    onClick={handleRegister}
                >
                    Create Account
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