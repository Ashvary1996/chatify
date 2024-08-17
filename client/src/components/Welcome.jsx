import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Welcome = () => {
  const [username, setUsername] = useState(
    sessionStorage.getItem("username") || ""
  );
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [isServerRunning, setIsServerRunning] = useState(false);
  const navigate = useNavigate();

  const checkBackend = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_HOST_URL}/status`
      );
      setBackendStatus(response.data.message);
      setIsServerRunning(true);
    } catch (error) {
      if (error.response) {
        setBackendStatus("Backend server is not responding");
      } else {
        setBackendStatus("Error connecting to backend server");
      }
      setIsServerRunning(false);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      sessionStorage.setItem("username", username.trim());
      navigate("/chat");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-teal-600 text-white p-4">
      <h2 className="text-4xl font-bold mb-4">Welcome to Chatify</h2>
      <p className="text-lg mb-8">
        Chatify is a real-time chat application that allows you to communicate
        with others seamlessly. You can send text messages, share files, and
        enjoy a smooth and responsive chat experience.
      </p>
      {!isServerRunning && (
        <div className="mb-4 text-center text-orange-400   font-semibold">
          <p>{backendStatus}</p>

          {backendStatus !== "Checking..." ? (
            <span
              className="cursor-pointer"
              onClick={() => window.location.reload()}
            >
              "Server is Starting . Please Refresh Page after 40 seconds"
            </span>
          ) : null}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-sm"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="p-2 rounded-md text-gray-800 w-full"
        />
        <button
          type="submit"
          className={`bg-white text-teal-600 px-4 py-2 rounded-md font-bold ${
            !isServerRunning ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isServerRunning}
        >
          Join Chat
        </button>
      </form>
    </div>
  );
};

export default Welcome;
