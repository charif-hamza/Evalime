import React from 'react';
import { motion } from 'framer-motion';
import './LandingPage.css';

export default function LandingPage({ onStart }) {
  return (
    <div className="landing-container">
      <header className="landing-nav">
        <span className="logo">EvaLime</span>
        <nav>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          <button className="login-btn" onClick={onStart}>Login</button>
        </nav>
      </header>

      <section className="hero">
        <motion.h1
          className="landing-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Master Your Subjects
        </motion.h1>
        <motion.p
          className="landing-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Practice MCQs and track your progress in real time.
        </motion.p>
        <motion.button
          className="landing-btn"
          onClick={onStart}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </section>

      <section id="features" className="features">
        <div className="feature-card">
          <h3>Rich Question Bank</h3>
          <p>Browse hundreds of curated evaluations for your courses.</p>
        </div>
        <div className="feature-card">
          <h3>Instant Feedback</h3>
          <p>See corrections right away and learn faster.</p>
        </div>
        <div className="feature-card">
          <h3>Track Your Stats</h3>
          <p>Monitor your performance with interactive charts.</p>
        </div>
      </section>

      <footer id="contact" className="landing-footer">
        <p>Ready to level up? <button onClick={onStart}>Join EvaLime</button></p>
      </footer>
    </div>
  );
}
