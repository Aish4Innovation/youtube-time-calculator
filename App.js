import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "AIzaSyAnhQJ48LWE0wkKbwXtXFKdnxHG_eeqg8U"; 

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(null);
  const [adjustedTime, setAdjustedTime] = useState(null);

  // Extract YouTube Video ID
  const getVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  // Convert ISO Duration to Seconds
  const convertISOToSeconds = (isoDuration) => {
    let match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = match[1] ? parseInt(match[1]) : 0;
    let minutes = match[2] ? parseInt(match[2]) : 0;
    let seconds = match[3] ? parseInt(match[3]) : 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Fetch Video Duration from YouTube API
  const fetchDuration = async () => {
    const videoId = getVideoId(videoUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`
      );
      const isoDuration = response.data.items[0]?.contentDetails?.duration;
      const totalSeconds = convertISOToSeconds(isoDuration);
      setDuration(totalSeconds);
      setAdjustedTime(totalSeconds / speed);
    } catch (error) {
      console.error("Error fetching video duration:", error);
      alert("Error fetching video duration. Check API Key.");
    }
  };

  // Recalculate Adjusted Time
  const calculateTime = () => {
    if (!duration || speed <= 0) return;
    setAdjustedTime(duration / speed);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-6">YouTube Time Calculator</h1>

        {/* YouTube URL Input */}
        <input
          type="text"
          placeholder="Paste YouTube URL here"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        <button
          onClick={fetchDuration}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
        >
          Get Duration
        </button>

        {/* Playback Speed Selector */}
        <div className="mt-6">
          <label className="font-semibold">Playback Speed: </label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="p-2 border rounded ml-2"
          >
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="1">1x (Normal)</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
          <button
            onClick={calculateTime}
            className="bg-green-500 text-white px-4 py-2 rounded ml-2 hover:bg-green-600"
          >
            Calculate
          </button>
        </div>

        {/* Display Results */}
        {duration && (
          <div className="mt-6 text-lg">
            <p>
              <strong>Original Duration:</strong> {Math.floor(duration / 60)} min {duration % 60} sec
            </p>
            <p>
              <strong>Adjusted Duration:</strong> {Math.floor(adjustedTime / 60)} min {adjustedTime % 60} sec
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
