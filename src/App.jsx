// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { login, register } from './services/api';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MCQPage from './pages/MCQPage';

import './App.css';

function App() {
  // User state remains central to manage authentication
  const [user, setUser] = useState(null); // Example: { username: 'test', token: '...' }
  const [mode, setMode] = useState('login'); // Add mode state
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  const handleLogin = async (username, password) => {
    const result = await login(username, password);
    setUser({ username, token: result.token });
    navigate('/dashboard'); // Redirect to dashboard on successful login
  };
  
  const handleRegister = async (username, password) => {
    const result = await register(username, password);
    setUser({ username, token: result.token });
    navigate('/dashboard'); // Redirect to dashboard on successful registration
  };
  
  const handleLogout = () => {
    setUser(null);
    navigate('/login'); // Redirect to login page on logout
  };

  // Auth handler based on mode
  const handleAuth = (username, password) => {
    if (mode === 'register') {
      return handleRegister(username, password);
    } else {
      return handleLogin(username, password);
    }
  };

  return (
    <Layout user={user} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <LandingPage onStart={() => { setMode('login'); navigate('/login'); }} /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <AuthPage onAuth={handleAuth} mode={mode} setMode={setMode} /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mcq/:evaluationId"
          element={
            <ProtectedRoute user={user}>
              <MCQPage />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </Layout>
  );
}

export default App;