import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Video, ChevronRight } from 'lucide-react';
import { getAllDays, formatDate } from '../data/mediaData';
import './Timeline.css';

const Timeline = () => {
  const days = getAllDays();

  const getMediaCount = (day) => {
    let imageCount = 0;
    let videoCount = 0;
    
    // Count media in main folder
    day.media?.forEach(item => {
      if (item.type === 'image') imageCount++;
      else if (item.type === 'video') videoCount++;
    });
    
    // Count media in subfolders
    day.subfolders?.forEach(subfolder => {
      subfolder.media?.forEach(item => {
        if (item.type === 'image') imageCount++;
        else if (item.type === 'video') videoCount++;
      });
    });
    
    return { imageCount, videoCount };
  };

  return (
    <div className="timeline-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Our Journey Timeline</h1>
          <p className="page-subtitle">
            Follow our incredible wedding and honeymoon adventure day by day
          </p>
        </div>

        <div className="timeline-container">
          <div className="timeline">
            {days.map(([dayKey, dayData]) => {
              const { imageCount, videoCount } = getMediaCount(dayData);
              
              return (
                <div key={dayKey} className="timeline-item">
                  <div className="timeline-card">
                    <div className="day-header">
                      <h2 className="day-title">{dayData.title}</h2>
                      <p className="day-date">{formatDate(dayData.date)}</p>
                    </div>
                    
                    {dayData.location && (
                      <div className="day-location">
                        <MapPin size={16} />
                        <span>{dayData.location}</span>
                      </div>
                    )}
                    
                    <p className="day-description">{dayData.description}</p>
                    
                    <div className="media-stats">
                      <div className="media-stat">
                        <Camera size={16} />
                        <span>{imageCount} Photos</span>
                      </div>
                      <div className="media-stat">
                        <Video size={16} />
                        <span>{videoCount} Videos</span>
                      </div>
                    </div>
                    
                    {dayData.subfolders && dayData.subfolders.length > 0 && (
                      <div className="subfolders-preview">
                        <h4>Activities:</h4>
                        <div className="subfolder-tags">
                          {dayData.subfolders.map((subfolder, index) => (
                            <span key={index} className="subfolder-tag">
                              {subfolder.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="card-actions">
                      <Link 
                        to={`/day/${encodeURIComponent(dayKey)}`} 
                        className="btn"
                      >
                        View Details
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
