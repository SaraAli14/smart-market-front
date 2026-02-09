import React from "react";
import { useNavigate } from "react-router-dom";
import { IoSparkles } from "react-icons/io5";
import "./welcomePage.css";
import robotImage from "../assets/robot.png";

export default function WelcomePage() {
  const navigate = useNavigate();

  const onLanguageSelect = (lang) => {
    navigate("/home", { state: { lang } });
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="robot-container">
          <img src={robotImage} alt="Robot" className="robot-image" />
        </div>

        <div className="welcome-card">
          <div className="text-box">
            <IoSparkles size={36} color="#7c3aed" />
            <h1 className="title">Smart Shopping</h1>
            <p className="subtitle">Your AI assistant inside the supermarket</p>
          </div>

          <div className="lang-box">
            <p className="choose">Choose your language</p>

            <button
              className="btn primary-btn"
              onClick={() => onLanguageSelect("en")}
            >
              English
            </button>

            <button
              className="btn secondary-btn"
              onClick={() => onLanguageSelect("ar")}
            >
              العربية
            </button>
          </div>
        </div>
      </div>

      <div className="hint">
        <p>🎤 Voice & Image Search</p>
        <p>🤖 Robot-guided navigation</p>
      </div>
    </div>
  );
}
