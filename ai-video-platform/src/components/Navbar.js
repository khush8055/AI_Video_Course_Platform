import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../firebase';

const Navbar = ({ user }) => {
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setIsMenuOpen(false); // Close menu on route change
  }, [location]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    position: 'sticky',
    top: 0,
    background: 'var(--nav-bg)',
    backdropFilter: 'blur(10px)',
    zIndex: 1000,
    borderBottom: '1px solid var(--border)',
    marginBottom: '2rem'
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      textDecoration: 'none',
      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
      fontWeight: isActive ? '700' : '500',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      background: isActive ? 'var(--bg-subtle)' : 'transparent',
      transition: 'all 0.2s ease',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    };
  };

  const mobileMenuStyles = {
    display: isMenuOpen ? 'flex' : 'none',
    flexDirection: 'column',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'var(--bg-card)',
    padding: '1.5rem',
    borderBottom: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 999,
    gap: '1rem'
  };

  if (!user) return (
    <nav style={navStyle}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '800', fontSize: '1.4rem', color: 'var(--primary)' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-play" style={{ color: 'var(--bg)', fontSize: '0.9rem' }}></i>
        </div>
        AI Video
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <button onClick={toggleTheme} className="theme-toggle" style={{ fontSize: '1rem' }}>
          <i className={theme === 'light' ? "fas fa-moon" : "fas fa-sun"} style={{ color: theme === 'dark' ? '#fbbf24' : 'inherit' }}></i>
        </button>
        <Link to="/login" className="hidden-mobile" style={{ fontWeight: '600', color: 'var(--text)' }}>Login</Link>
        <Link to="/signup"><button style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Join Now</button></Link>
      </div>
    </nav>
  );

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-play" style={{ color: 'var(--bg)', fontSize: '0.8rem' }}></i>
          </div>
          AI Video
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden-mobile" style={{ display: 'flex', gap: '0.25rem' }}>
          <Link to="/" style={getLinkStyle('/')}>
            <i className="fas fa-home"></i> Home
          </Link>
          <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
            <i className="fas fa-compass"></i> Browse
          </Link>
          <Link to="/my-courses" style={getLinkStyle('/my-courses')}>
            <i className="fas fa-book-open"></i> My Learning
          </Link>
          <Link to="/upload" style={getLinkStyle('/upload')}>
            <i className="fas fa-cloud-upload-alt"></i> Upload
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={toggleTheme} className="theme-toggle" style={{ fontSize: '1rem' }}>
          <i className={theme === 'light' ? "fas fa-moon" : "fas fa-sun"} style={{ color: theme === 'dark' ? '#fbbf24' : 'inherit' }}></i>
        </button>

        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: "var(--text)", fontWeight: "500", fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <i className="fas fa-user-circle" style={{ opacity: 0.6 }}></i>
             <span style={{ fontWeight: "700" }}>{user.displayName || user.email?.split('@')[0]}</span>
          </span>
          <button 
            onClick={() => auth.signOut()} 
            style={{ 
              background: 'transparent', 
              color: '#ef4444', 
              border: '1px solid var(--border)', 
              padding: '0.4rem 1rem',
              boxShadow: 'none',
              fontSize: '0.85rem',
              borderRadius: '8px'
            }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="visible-mobile theme-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ background: 'transparent', border: 'none' }}
        >
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"} style={{ fontSize: '1.2rem' }}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={mobileMenuStyles}>
        <Link to="/" style={getLinkStyle('/')}>
          <i className="fas fa-home"></i> Home
        </Link>
        <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
          <i className="fas fa-compass"></i> Browse
        </Link>
        <Link to="/my-courses" style={getLinkStyle('/my-courses')}>
          <i className="fas fa-book-open"></i> My Learning
        </Link>
        <Link to="/upload" style={getLinkStyle('/upload')}>
          <i className="fas fa-cloud-upload-alt"></i> Upload
        </Link>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <div style={{ marginBottom: '1rem', fontWeight: '700', fontSize: '0.9rem' }}>
            {user.displayName || user.email}
          </div>
          <button 
            onClick={() => auth.signOut()} 
            style={{ width: '100%', background: '#fee2e2', color: '#ef4444', border: 'none' }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
