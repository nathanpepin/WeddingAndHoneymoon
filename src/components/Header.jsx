import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Calendar, Edit3, Home, Menu, X, MapPin } from 'lucide-react';
import './Header.css';

const Header = ({ 
  onSidebarToggle, 
  isSidebarOpen, 
  onActivitiesSidebarToggle, 
  isActivitiesSidebarOpen, 
  showActivitiesToggle 
}) => {
  const location = useLocation();
  const showSidebar = location.pathname === '/timeline' || location.pathname.startsWith('/day/');

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            {showSidebar && (
              <button 
                className="sidebar-toggle mobile-only"
                onClick={onSidebarToggle}
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            <Link to="/" className="logo">
              <Heart className="logo-icon" />
              <div className="logo-content">
                <span className="logo-text script-font">Our Journey</span>
                <span className="logo-subtitle">Laura & Nathan Pepin</span>
              </div>
            </Link>
          </div>
          
          <nav className="nav">
            <Link to="/" className={isActive('/')}>
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/timeline" className={isActive('/timeline')}>
              <Calendar size={18} />
              <span>Timeline</span>
            </Link>
            <Link to="/edit" className={isActive('/edit')}>
              <Edit3 size={18} />
              <span>Edit</span>
            </Link>
          </nav>
          
          <div className="header-right">
            {/* Activities sidebar toggle - only show on day/activity pages */}
            {showActivitiesToggle && (
              <button 
                className="sidebar-toggle activities-toggle"
                onClick={onActivitiesSidebarToggle}
                aria-label="Toggle activities sidebar"
                title="Toggle Activities"
              >
                <MapPin size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
