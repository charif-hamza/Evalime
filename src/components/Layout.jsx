import { useNavigate } from 'react-router-dom';

const Layout = ({ user, theme, toggleTheme, handleLogout, children }) => {
  const navigate = useNavigate();

  return (
    <div className={`app-container ${theme}`}>
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
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout; 