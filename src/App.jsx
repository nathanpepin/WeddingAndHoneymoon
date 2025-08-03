import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ActivitiesSidebar from './components/ActivitiesSidebar';
import Home from './pages/Home';
import Timeline from './pages/Timeline';
import DayView from './pages/DayView';
import ActivityView from './pages/ActivityView';
import EditCaptions from './pages/EditCaptions';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isActivitiesSidebarOpen, setIsActivitiesSidebarOpen] = useState(window.innerWidth > 768);
  
  const showSidebar = location.pathname === '/timeline' || 
                    location.pathname.startsWith('/day/') || 
                    location.pathname.startsWith('/activity/');
                    
  const showActivitiesSidebar = location.pathname.startsWith('/day/') || 
                               location.pathname.startsWith('/activity/');

  // Ensure sidebars are open on desktop by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
        setIsActivitiesSidebarOpen(true);
      }
    };

    // Set sidebars open on desktop when component mounts or route changes
    if (window.innerWidth > 768) {
      setIsSidebarOpen(true);
      setIsActivitiesSidebarOpen(true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleActivitiesSidebar = () => {
    setIsActivitiesSidebarOpen(!isActivitiesSidebarOpen);
  };

  // Determine main content classes
  const getMainClasses = () => {
    if (showSidebar && showActivitiesSidebar && window.innerWidth > 768) {
      return 'main-with-both-sidebars';
    } else if (showSidebar) {
      return 'main-with-sidebar';
    } else if (showActivitiesSidebar) {
      return 'main-with-activities-sidebar';
    }
    return '';
  };

  return (
    <div className="App">
      <Header 
        onSidebarToggle={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
        onActivitiesSidebarToggle={toggleActivitiesSidebar}
        isActivitiesSidebarOpen={isActivitiesSidebarOpen}
        showActivitiesToggle={showActivitiesSidebar}
      />
      {showSidebar && <Sidebar isOpen={isSidebarOpen} />}
      {showActivitiesSidebar && <ActivitiesSidebar isOpen={isActivitiesSidebarOpen} />}
      <main className={getMainClasses()}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/day/:dayId" element={<DayView />} />
          <Route path="/activity/:dayId/:activityId" element={<ActivityView />} />
          <Route path="/edit" element={<EditCaptions />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
