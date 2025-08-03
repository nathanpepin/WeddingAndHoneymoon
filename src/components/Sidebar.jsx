import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, Camera, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { mediaData } from '../data/mediaData';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { dayId: paramDayId, activityId } = useParams();
  
  const isTimelinePage = location.pathname === '/timeline';
  const isDayPage = location.pathname.startsWith('/day/');
  const isActivityPage = location.pathname.startsWith('/activity/');
  
  // Extract dayId from URL path (more reliable than useParams with encoded URLs)
  const pathSegments = location.pathname.split('/');
  const dayId = paramDayId || (isDayPage ? decodeURIComponent(pathSegments[2]) : null);
  
  // Convert mediaData object to array
  const allDays = Object.keys(mediaData).map(dayKey => ({
    id: dayKey,
    ...mediaData[dayKey]
  }));
  
  // Find current day data
  const currentDayData = (isDayPage || isActivityPage) && dayId ? 
    (mediaData[dayId] || null) : null;

  const TimelineNavigation = () => (
    <div className="sidebar-section">
      <h3 className="sidebar-title">
        <Calendar size={18} />
        Timeline
      </h3>
      <div className="sidebar-items">
        {allDays.map((day) => (
          <Link
            key={day.id}
            to={`/day/${encodeURIComponent(day.id)}`}
            className="sidebar-item"
          >
            <div className="sidebar-item-content">
              <div className="sidebar-item-date">
                {day.date}
              </div>
              <div className="sidebar-item-title">
                {day.title}
              </div>
            </div>
            <ChevronRight size={16} className="sidebar-item-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );

  const DayNavigation = () => {
    if (!currentDayData) return null;

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <>
        {/* Timeline Navigation - same as Timeline page */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">
            <Calendar size={18} />
            Timeline
          </h3>
          <div className="sidebar-items">
            {allDays.map((day) => (
              <Link
                key={day.id}
                to={`/day/${encodeURIComponent(day.id)}`}
                className={`sidebar-item ${dayId && (decodeURIComponent(dayId) === day.id || dayId === day.id) ? 'active' : ''}`}
              >
                <div className="sidebar-item-content">
                  <div className="sidebar-item-date">
                    {day.date}
                  </div>
                  <div className="sidebar-item-title">
                    {day.title}
                  </div>
                </div>
                <ChevronRight size={16} className="sidebar-item-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  };

  const ActivityNavigation = () => {
    if (!currentDayData || !activityId) return null;

    const currentActivity = currentDayData.subfolders?.find(sub => sub.name === decodeURIComponent(activityId));
    
    return (
      <div className="sidebar-section">
        {/* Back to day link */}
        <Link 
          to={`/day/${encodeURIComponent(dayId)}`}
          className="sidebar-back-link"
        >
          <ArrowLeft size={16} />
          Back to {currentDayData.title}
        </Link>
        
        <h3 className="sidebar-title">
          <Camera size={18} />
          {currentActivity?.title || 'Activity'}
        </h3>
        
        <div className="sidebar-items">
          {/* Current activity (highlighted) */}
          <div className="sidebar-item active">
            <div className="sidebar-item-icon">
              <Camera size={16} />
            </div>
            <div className="sidebar-item-content">
              <div className="sidebar-item-title">
                {currentActivity?.title}
              </div>
              <div className="sidebar-item-count">
                {currentActivity?.media ? currentActivity.media.length : 0} items
              </div>
            </div>
          </div>
          
          {/* Other activities in this day */}
          {currentDayData.subfolders && currentDayData.subfolders
            .filter(subfolder => subfolder.name !== decodeURIComponent(activityId))
            .map((subfolder) => (
              <Link
                key={subfolder.name}
                to={`/activity/${encodeURIComponent(dayId)}/${encodeURIComponent(subfolder.name)}`}
                className="sidebar-item"
              >
                <div className="sidebar-item-icon">
                  <Camera size={16} />
                </div>
                <div className="sidebar-item-content">
                  <div className="sidebar-item-title">
                    {subfolder.title}
                  </div>
                  <div className="sidebar-item-count">
                    {subfolder.media ? subfolder.media.length : 0} items
                  </div>
                </div>
                <ChevronRight size={16} className="sidebar-item-arrow" />
              </Link>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        {isTimelinePage && <TimelineNavigation />}
        {isDayPage && <DayNavigation />}
        {isActivityPage && <ActivityNavigation />}
      </div>
    </div>
  );
};

export default Sidebar;
