import React, { useState } from 'react';
import './Auth.css';

function AuthPage({ onAuth, mode, setMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onAuth(username, password);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {mode === 'register' ? 'Register' : 'Login'}
        </button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      <div className="auth-switch">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <button type="button" onClick={() => setMode('register')}>Register</button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button type="button" onClick={() => setMode('login')}>Login</button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
