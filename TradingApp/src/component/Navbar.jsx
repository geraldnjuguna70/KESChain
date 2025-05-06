import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-content">
        <h1>Stock Dashboard</h1>
        <div className="theme-toggle">
          <label>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="toggle-input"
            />
            <span className={`toggle-slider ${theme}`}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;