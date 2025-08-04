import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, Video, Play, Image as ImageIcon, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { mediaData, formatDate } from '../data/mediaData';
import { getDisplayPath, getThumbnailPath, getVideoFallbackPath, isImageFile, isVideoFile } from '../utils/mediaUtils';
import './DayView.css';

const DayView = () => {
  const { dayId } = useParams();
  const dayData = mediaData[decodeURIComponent(dayId)];
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [allMedia, setAllMedia] = useState([]);
  const [copiedMediaId, setCopiedMediaId] = useState(null);
  
  if (!dayData) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>Day not found</h2>
          <Link to="/timeline" className="btn">Back to Timeline</Link>
        </div>
      </div>
    );
  }

  // Create a flat array of all media with context information
  const getAllMediaItems = () => {
    const mediaItems = [];
    
    // Add main media
    if (dayData.media) {
      dayData.media.forEach((item, index) => {
        mediaItems.push({
          ...item,
          path: getMediaPath(item.filename),
          context: 'main',
          contextTitle: 'Photos & Videos'
        });
      });
    }
    
    // Add subfolder media
    if (dayData.subfolders) {
      dayData.subfolders.forEach(subfolder => {
        if (subfolder.media) {
          subfolder.media.forEach((item, index) => {
            mediaItems.push({
              ...item,
              path: getSubfolderMediaPath(subfolder, item.filename),
              context: 'subfolder',
              contextTitle: subfolder.name
            });
          });
        }
      });
    }
    
    return mediaItems;
  };

  const openMediaModal = (mediaItem) => {
    const allMediaItems = getAllMediaItems();
    const index = allMediaItems.findIndex(item => 
      item.filename === mediaItem.filename && item.path === mediaItem.path
    );
    setAllMedia(allMediaItems);
    setCurrentMediaIndex(index);
    setSelectedMedia(allMediaItems[index]);
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
    const mediaId = `${decodeURIComponent(dayId)}/${media.context === 'subfolder' ? media.contextTitle + '/' : ''}${media.filename}`;
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

  const getMediaPath = (filename) => {
    return getDisplayPath(decodeURIComponent(dayId), filename);
  };

  const getThumbnailMediaPath = (filename) => {
    return getThumbnailPath(decodeURIComponent(dayId), filename);
  };

  const getSubfolderMediaPath = (subfolder, filename) => {
    return getDisplayPath(decodeURIComponent(dayId), filename, subfolder.name);
  };

  const getSubfolderThumbnailPath = (subfolder, filename) => {
    return getThumbnailPath(decodeURIComponent(dayId), filename, subfolder.name);
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
        // For videos, show thumbnail image with play overlay
        <div className="video-thumbnail-container">
          <img 
            src={thumbnailPath} 
            alt={item.caption}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="video-play-overlay">
            <Play size={32} color="white" />
          </div>
        </div>
      )}
      <div className="media-placeholder" style={{ display: 'none' }}>
        {item.type === 'image' ? <ImageIcon size={32} /> : <Play size={32} />}
        <span className="media-filename">{item.filename}</span>
      </div>
      <div className="media-overlay">
        <h4>{item.caption}</h4>
        {item.description && <p>{item.description}</p>}
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
          {copiedMediaId === `${decodeURIComponent(dayId)}/${media.context === 'subfolder' ? media.contextTitle + '/' : ''}${media.filename}` ? 
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
              style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <video 
              controls
              style={{ maxWidth: '100%', maxHeight: '60vh' }}
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
              <source src={getVideoFallbackPath(decodeURIComponent(dayId), media.filename, media.context === 'subfolder' ? media.contextTitle : null)} type="video/quicktime" />
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
              <span style={{ fontSize: '0.8rem', color: '#666' }}>Fallback: {getVideoFallbackPath(decodeURIComponent(dayId), media.filename, media.context === 'subfolder' ? media.contextTitle : null)}</span>
              <br />
              <button 
                onClick={() => window.open(media.path, '_blank')}
                style={{ marginTop: '10px', padding: '5px 10px', marginRight: '5px' }}
              >
                Try Direct Link
              </button>
              <button 
                onClick={() => window.open(getVideoFallbackPath(decodeURIComponent(dayId), media.filename, media.context === 'subfolder' ? media.contextTitle : null), '_blank')}
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
            <strong>Media ID:</strong> {decodeURIComponent(dayId)}/{media.context === 'subfolder' ? media.contextTitle + '/' : ''}{media.filename}
          </div>
          <h3>{media.caption}</h3>
          {media.description && <p>{media.description}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="day-view">
      <div className="container">
        <div className="day-header">
          <Link to="/timeline" className="back-link">
            <ArrowLeft size={20} />
            Back to Timeline
          </Link>
          
          <div className="day-info">
            <h1 className="day-title">{dayData.title}</h1>
            <p className="day-date">{formatDate(dayData.date)}</p>
            
            {dayData.location && (
              <div className="day-location">
                <MapPin size={16} />
                <span>{dayData.location}</span>
              </div>
            )}
            
            <p className="day-description">{dayData.description}</p>
          </div>
        </div>

        {/* Main Media */}
        {dayData.media && dayData.media.length > 0 && (
          <section id="main-media" className="media-section">
            <h2>Photos & Videos</h2>
            <div className="media-grid">
              {dayData.media.map((item, index) => (
                <MediaItem
                  key={index}
                  item={item}
                  path={getMediaPath(item.filename)}
                  thumbnailPath={getThumbnailMediaPath(item.filename)}
                  onClick={openMediaModal}
                />
              ))}
            </div>
          </section>
        )}

        {/* Subfolders */}
        {dayData.subfolders && dayData.subfolders.map((subfolder, index) => (
          <section key={index} id={`activity-${subfolder.name}`} className="subfolder-section">
            <h2 className="subfolder-title">{subfolder.title}</h2>
            <p className="subfolder-description">{subfolder.description}</p>
            
            {subfolder.media && subfolder.media.length > 0 ? (
              <div className="media-grid">
                {subfolder.media.map((item, itemIndex) => (
                  <MediaItem
                    key={itemIndex}
                    item={item}
                    path={getSubfolderMediaPath(subfolder, item.filename)}
                    thumbnailPath={getSubfolderThumbnailPath(subfolder, item.filename)}
                    onClick={openMediaModal}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-folder">
                <Camera size={48} />
                <p>Photos coming soon...</p>
              </div>
            )}
          </section>
        ))}

        {/* Media Modal */}
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
    </div>
  );
};

export default DayView;
