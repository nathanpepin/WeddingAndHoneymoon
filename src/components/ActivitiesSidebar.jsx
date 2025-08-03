import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { MapPin, Camera, Image as ImageIcon } from 'lucide-react';
import { mediaData } from '../data/mediaData';
import './ActivitiesSidebar.css';

const ActivitiesSidebar = ({ isOpen }) => {
  const location = useLocation();
  const { dayId: paramDayId, activityId } = useParams();
  
  const isDayPage = location.pathname.startsWith('/day/');
  const isActivityPage = location.pathname.startsWith('/activity/');
  
  // Extract dayId from URL path (more reliable than useParams with encoded URLs)
  const pathSegments = location.pathname.split('/');
  const dayId = paramDayId || (isDayPage ? decodeURIComponent(pathSegments[2]) : null);
  
  // Find current day data
  const currentDayData = (isDayPage || isActivityPage) && dayId ? 
    (mediaData[dayId] || null) : null;

  if (!currentDayData || (!isDayPage && !isActivityPage)) {
    return null;
  }

  const getMediaCount = (media) => {
    if (!media) return { images: 0, videos: 0 };
    
    let images = 0;
    let videos = 0;
    
    media.forEach(item => {
      if (item.type === 'image') images++;
      else if (item.type === 'video') videos++;
    });
    
    return { images, videos };
  };

  const scrollToActivity = (activityName) => {
    const element = document.getElementById(`activity-${activityName}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`activities-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="activities-sidebar-content">
        <div className="activities-header">
          <MapPin size={20} />
          <h3>Activities</h3>
        </div>
        
        {currentDayData.subfolders && currentDayData.subfolders.length > 0 ? (
          <div className="activities-list">
            {currentDayData.subfolders.map((subfolder, index) => {
              const isCurrentActivity = activityId === subfolder.name;
              
              return (
                <button
                  key={index}
                  onClick={() => scrollToActivity(subfolder.name)}
                  className={`activity-button ${isCurrentActivity ? 'active' : ''}`}
                >
                  {subfolder.title}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="no-activities">
            <p>No activities for this day</p>
          </div>
        )}
        
        {/* Back to top button */}
        <div className="activities-footer">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-top"
          >
            ↑ Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesSidebar;
