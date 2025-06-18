import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Layout = ({ user, theme, toggleTheme, handleLogout, children }) => {
  const navigate = useNavigate();

  const [hasInsights, setHasInsights] = useState(() => !!localStorage.getItem('lastInsights'));

  // Listen for other tabs updating insights
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'lastInsights') {
        setHasInsights(!!e.newValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const containerClass = user ? `app-container ${theme}` : '';
  return (
    <div className={containerClass}>
      {user && (
        <header className="app-header">
          <span className="header-logo" onClick={() => navigate('/dashboard')}>EvaLime MCQ</span>
          <div className="user-info">
            {hasInsights && (
              <button className="insights-link" onClick={() => navigate('/insights')}>
                Insights
              </button>
            )}
            <button className="theme-toggle" onClick={toggleTheme}>{theme === 'light' ? 'Dark' : 'Light'} Mode</button>
            <span>Hello, <strong>{user.username}</strong></span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </header>
      )}
      {/* Use zero padding on the unauthenticated landing page so it can stretch edge-to-edge */}
      <main className={user ? undefined : 'p-0'}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 