import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const email = localStorage.getItem("userEmail");

        if (!email) {
            navigate("/login");
            return;
        }

        axios.get(
            `http://localhost:8080/api/users/profile?email=${email}`
        )
            .then((response) => {

                setUser(response.data);
                setLoading(false);

            })
            .catch((error) => {

                console.log(error);
                alert("Unable to load profile");
                setLoading(false);

            });

    }, [navigate]);

    if (loading) {
        return <h2>Loading Profile...</h2>;
    }

    if (!user) {
        return <h2>User not found</h2>;
    }

    return (
        <div className="profile-container">

            <div className="profile-card">

                <div className="profile-icon">
                    👤
                </div>

                <h1>My Profile</h1>

                <h2>Hello, {user.name}! 👋</h2>

                <div className="profile-info">

                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>

                </div>

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>

            </div>

        </div>
    );
}

export default Profile;