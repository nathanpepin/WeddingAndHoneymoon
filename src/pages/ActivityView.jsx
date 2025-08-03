import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Image as ImageIcon, Camera, Video, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { mediaData } from '../data/mediaData';
import { getDisplayPath, getThumbnailPath, getVideoFallbackPath, isImageFile, isVideoFile } from '../utils/mediaUtils';
import './ActivityView.css';

const ActivityView = () => {
  const { dayId, activityId } = useParams();
  const navigate = useNavigate();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [allMedia, setAllMedia] = useState([]);
  const [copiedMediaId, setCopiedMediaId] = useState(null);

  // Find the day data
  const dayData = mediaData[decodeURIComponent(dayId)];
  
  if (!dayData) {
    return <div className="activity-view">Day not found</div>;
  }

  // Find the activity/subfolder data
  const activity = dayData.subfolders?.find(sub => sub.name === decodeURIComponent(activityId));
  
  if (!activity) {
    return <div className="activity-view">Activity not found</div>;
  }

  const openMediaModal = (mediaItem) => {
    if (!activity.media) return;
    
    const mediaItems = activity.media.map(item => ({
      ...item,
      path: getSubfolderMediaPath(item.filename),
      contextTitle: activity.title
    }));
    
    const index = mediaItems.findIndex(item => 
      item.filename === mediaItem.filename
    );
    
    setAllMedia(mediaItems);
    setCurrentMediaIndex(index);
    setSelectedMedia(mediaItems[index]);
  };

  const navigateMedia = (direction) => {
    if (allMedia.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentMediaIndex < allMedia.length - 1 ? currentMediaIndex + 1 : 0;
    } else {
      newIndex = currentMediaIndex > 0 ? currentMediaIndex - 1 : allMedia.length - 1;
    }
    
    setCurrentMediaIndex(newIndex);
    setSelectedMedia(allMedia[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedMedia) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateMedia('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateMedia('next');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedMedia(null);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedMedia, currentMediaIndex, allMedia]);

  // Copy media ID to clipboard
  const copyMediaId = async (media) => {
    const mediaId = `${decodeURIComponent(dayId)}/${activity.title}/${media.filename}`;
    try {
      await navigator.clipboard.writeText(mediaId);
      setCopiedMediaId(mediaId);
      setTimeout(() => setCopiedMediaId(null), 2000); // Clear after 2 seconds
    } catch (err) {
      console.error('Failed to copy media ID:', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = mediaId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedMediaId(mediaId);
      setTimeout(() => setCopiedMediaId(null), 2000);
    }
  };

  const getSubfolderMediaPath = (filename) => {
    return getDisplayPath(decodeURIComponent(dayId), filename, activity.name);
  };

  const getSubfolderThumbnailPath = (filename) => {
    return getThumbnailPath(decodeURIComponent(dayId), filename, activity.name);
  };

  const MediaItem = ({ item, path, thumbnailPath, onClick }) => (
    <div className="media-item" onClick={() => onClick({ ...item, path })}>
      {item.type === 'image' ? (
        <img 
          src={path} 
          alt={item.caption}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : (
        <div className="video-container">
          <img 
            src={thumbnailPath} 
            alt={item.caption}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="video-play-button">
            <Play size={24} />
          </div>
        </div>
      )}
      
      <div className="media-placeholder" style={{ display: 'none' }}>
        {item.type === 'image' ? <ImageIcon size={32} /> : <Video size={32} />}
        <span>File: {item.filename}</span>
      </div>
      
      <div className="media-item-info">
        <div className="media-item-type">
          {item.type === 'image' ? <Camera size={16} /> : <Video size={16} />}
        </div>
      </div>
    </div>
  );

  const MediaModal = ({ media, onClose, onNavigate, currentIndex, totalCount }) => (
    <div className="media-modal" onClick={onClose}>
      <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {/* Copy Media ID button */}
        <button 
          className="copy-media-id-button"
          onClick={(e) => { e.stopPropagation(); copyMediaId(media); }}
          title="Copy Media ID for deletion"
        >
          {copiedMediaId === `${decodeURIComponent(dayId)}/${activity.title}/${media.filename}` ? 
            <Check size={18} /> : <Copy size={18} />}
        </button>
        
        {/* Navigation arrows */}
        {totalCount > 1 && (
          <>
            <button 
              className="nav-arrow nav-arrow-left" 
              onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
              title="Previous image (←)"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="nav-arrow nav-arrow-right" 
              onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
              title="Next image (→)"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        <div className="media-container">
          {media.type === 'image' ? (
            <img 
              src={media.path} 
              alt={media.caption}
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <video 
              controls
              style={{ maxWidth: '100%', maxHeight: '70vh' }}
              preload="metadata"
              onError={(e) => {
                console.error('Video error:', e.target.error);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
              onLoadStart={() => {
                console.log('Video loading started:', media.path);
              }}
              onLoadedData={() => {
                console.log('Video loaded successfully:', media.path);
              }}
            >
              <source src={media.path} type="video/mp4" />
              <source src={getVideoFallbackPath(decodeURIComponent(dayId), media.filename, activity.name)} type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="media-placeholder large" style={{ display: 'none' }}>
            {media.type === 'image' ? <ImageIcon size={64} /> : <Play size={64} />}
            <div>
              <span>File: {media.filename}</span>
              <br />
              <span style={{ fontSize: '0.8rem', color: '#666' }}>Path: {media.path}</span>
              <br />
              <span style={{ fontSize: '0.8rem', color: '#666' }}>Fallback: {getVideoFallbackPath(decodeURIComponent(dayId), media.filename, activity.name)}</span>
              <br />
              <button 
                onClick={() => window.open(media.path, '_blank')}
                style={{ marginTop: '10px', padding: '5px 10px', marginRight: '5px' }}
              >
                Try Direct Link
              </button>
              <button 
                onClick={() => window.open(getVideoFallbackPath(decodeURIComponent(dayId), media.filename, activity.name), '_blank')}
                style={{ marginTop: '10px', padding: '5px 10px' }}
              >
                Try Fallback
              </button>
            </div>
          </div>
        </div>
        
        <div className="media-info">
          <div className="media-counter">
            {currentIndex + 1} of {totalCount}
            {media.contextTitle && <span className="media-context"> • {media.contextTitle}</span>}
          </div>
          <div className="media-id-info">
            <strong>Media ID:</strong> {decodeURIComponent(dayId)}/{activity.title}/{media.filename}
          </div>
          <h3>{media.caption}</h3>
          {media.description && <p>{media.description}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="activity-view">
      <div className="activity-header">
        <button 
          className="back-button" 
          onClick={() => navigate(`/day/${encodeURIComponent(dayId)}`)}
        >
          ← Back to {dayData.title}
        </button>
        <h1>{activity.title}</h1>
        <p className="activity-subtitle">
          {dayData.title} • {dayData.date}
        </p>
      </div>

      <div className="activity-content">
        {activity.description && (
          <p className="activity-description">{activity.description}</p>
        )}
        
        {activity.media && activity.media.length > 0 ? (
          <div className="media-grid">
            {activity.media.map((item, index) => (
              <MediaItem
                key={index}
                item={item}
                path={getSubfolderMediaPath(item.filename)}
                thumbnailPath={getSubfolderThumbnailPath(item.filename)}
                onClick={openMediaModal}
              />
            ))}
          </div>
        ) : (
          <div className="no-media">
            <Camera size={48} />
            <p>No media available for this activity</p>
          </div>
        )}
      </div>

      {selectedMedia && (
        <MediaModal 
          media={selectedMedia} 
          onClose={() => setSelectedMedia(null)}
          onNavigate={navigateMedia}
          currentIndex={currentMediaIndex}
          totalCount={allMedia.length}
        />
      )}
    </div>
  );
};

export default ActivityView;
