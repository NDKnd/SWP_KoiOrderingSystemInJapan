import { useEffect, useState } from "react";
import { Card } from "antd";
import api from "./../../services/axios";
import "./FeedbackView.css";

function FeedbackView() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const fetchFeedback = async () => {
            if (isLoggedIn) {
                try {
                    const res = await api.get("/feedback");
                    setFeedbacks(res.data);
                } catch (error) {
                    console.log("Error fetching feedback:", error);
                }
            }
        };
        fetchFeedback();
    }, [isLoggedIn]);

    return (
        <Card style={{ height: "300px", overflow: "hidden", width: "100%" }}>
            {isLoggedIn ? (
                <div className="scroll-container">
                    <div className="scroll-content">
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <div key={feedback.id} className="feedback-item">
                                    <p><strong>From:</strong> {feedback.customer.username}</p>
                                    <p><strong>Rating:</strong> {feedback.rating}</p>
                                    <p><strong>Date:</strong> {feedback.createAt}</p>
                                    <p><strong>Comment:</strong> {feedback.comment}</p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <div className="feedback-text">
                                <h3>No feedback available.</h3>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="feedback-text">
                    <h3>Please log in to view feedback.</h3>
                </div>
            )}
        </Card>
    );
}

export default FeedbackView;