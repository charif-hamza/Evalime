import { useNavigate } from 'react-router-dom';

const Layout = ({ user, theme, toggleTheme, handleLogout, children }) => {
  const navigate = useNavigate();

  const containerClass = user ? `app-container ${theme}` : '';
  return (
    <div className={containerClass}>
      {user && (
        <header className="app-header">
          <span className="header-logo" onClick={() => navigate('/dashboard')}>EvaLime MCQ</span>
          <div className="user-info">
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