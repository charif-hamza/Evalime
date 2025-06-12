import React from 'react';
import './LandingPage.css';

export default function LandingPage({ onStart }) {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to EvaLime MCQ</h1>
      <p className="landing-subtitle">Master Your Subjects, One Question at a Time.</p>
      <button className="landing-btn" onClick={onStart}>
        Get Started
      </button>
    </div>
  );
}
