import React, { useState } from 'react';
import { Save, Edit3, Camera, Video, MapPin, Folder, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { mediaData, getAllDays } from '../data/mediaData';
import { getDisplayPath, getThumbnailPath } from '../utils/mediaUtils';
import './EditCaptions.css';

const EditCaptions = () => {
  const [editData, setEditData] = useState(JSON.parse(JSON.stringify(mediaData)));
  const [selectedDay, setSelectedDay] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreviews, setShowPreviews] = useState(true);
  
  const days = getAllDays();

  const handleDayDataChange = (dayKey, field, value) => {
    setEditData(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleMediaChange = (dayKey, mediaIndex, field, value, subfolderIndex = null) => {
    setEditData(prev => {
      const newData = { ...prev };
      
      if (subfolderIndex !== null) {
        newData[dayKey].subfolders[subfolderIndex].media[mediaIndex] = {
          ...newData[dayKey].subfolders[subfolderIndex].media[mediaIndex],
          [field]: value
        };
      } else {
        newData[dayKey].media[mediaIndex] = {
          ...newData[dayKey].media[mediaIndex],
          [field]: value
        };
      }
      
      return newData;
    });
    setHasChanges(true);
  };

  const handleSubfolderChange = (dayKey, subfolderIndex, field, value) => {
    setEditData(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        subfolders: prev[dayKey].subfolders.map((subfolder, index) =>
          index === subfolderIndex
            ? { ...subfolder, [field]: value }
            : subfolder
        )
      }
    }));
    setHasChanges(true);
  };

  const deleteMedia = (dayKey, mediaIndex, subfolderIndex = null) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;
    
    setEditData(prev => {
      const newData = { ...prev };
      
      if (subfolderIndex !== null) {
        newData[dayKey].subfolders[subfolderIndex].media = 
          newData[dayKey].subfolders[subfolderIndex].media.filter((_, index) => index !== mediaIndex);
      } else {
        newData[dayKey].media = newData[dayKey].media.filter((_, index) => index !== mediaIndex);
      }
      
      return newData;
    });
    setHasChanges(true);
  };

  const moveMedia = (dayKey, mediaIndex, direction, subfolderIndex = null) => {
    setEditData(prev => {
      const newData = { ...prev };
      let mediaArray;
      
      if (subfolderIndex !== null) {
        mediaArray = [...newData[dayKey].subfolders[subfolderIndex].media];
      } else {
        mediaArray = [...newData[dayKey].media];
      }
      
      const newIndex = direction === 'up' ? mediaIndex - 1 : mediaIndex + 1;
      
      if (newIndex < 0 || newIndex >= mediaArray.length) return prev;
      
      // Swap items
      [mediaArray[mediaIndex], mediaArray[newIndex]] = [mediaArray[newIndex], mediaArray[mediaIndex]];
      
      if (subfolderIndex !== null) {
        newData[dayKey].subfolders[subfolderIndex].media = mediaArray;
      } else {
        newData[dayKey].media = mediaArray;
      }
      
      return newData;
    });
    setHasChanges(true);
  };

  const getMediaPreviewPath = (dayKey, filename, subfolderName = null) => {
    return getDisplayPath(dayKey, filename, subfolderName);
  };

  const getMediaThumbnailPath = (dayKey, filename, subfolderName = null) => {
    return getThumbnailPath(dayKey, filename, subfolderName);
  };

  const handleSave = () => {
    // In a real application, this would save to a backend or local storage
    console.log('Saving data:', editData);
    
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(editData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wedding-honeymoon-data.json';
    link.click();
    URL.revokeObjectURL(url);
    
    setHasChanges(false);
    alert('Data saved successfully! Check your downloads folder for the JSON file.');
  };

  const selectedDayData = selectedDay ? editData[selectedDay] : null;

  return (
    <div className="edit-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Edit3 size={32} />
            Edit Captions & Descriptions
          </h1>
          <p className="page-subtitle">
            Add or edit captions, descriptions, and location information for your photos and videos
          </p>
          
          <div className="edit-controls">
            <button 
              onClick={() => setShowPreviews(!showPreviews)} 
              className={`btn preview-btn ${showPreviews ? 'active' : ''}`}
            >
              {showPreviews ? <EyeOff size={20} /> : <Eye size={20} />}
              {showPreviews ? 'Hide Previews' : 'Show Previews'}
            </button>
            
            {hasChanges && (
              <button onClick={handleSave} className="btn save-btn">
                <Save size={20} />
                Save Changes
              </button>
            )}
          </div>
        </div>

        <div className="edit-content">
          <div className="day-selector">
            <label htmlFor="day-select">Select a day to edit:</label>
            <select
              id="day-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="day-select"
            >
              <option value="">Choose a day...</option>
              {days.map(([dayKey, dayData]) => (
                <option key={dayKey} value={dayKey}>
                  {dayData.title} - {dayData.date}
                </option>
              ))}
            </select>
          </div>

          {selectedDayData && (
            <div className="edit-form">
              <div className="form-section">
                <h2>Day Information</h2>
                
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    value={selectedDayData.title}
                    onChange={(e) => handleDayDataChange(selectedDay, 'title', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={selectedDayData.description}
                    onChange={(e) => handleDayDataChange(selectedDay, 'description', e.target.value)}
                    placeholder="Describe what happened on this day..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={selectedDayData.location || ''}
                    onChange={(e) => handleDayDataChange(selectedDay, 'location', e.target.value)}
                    placeholder="Where did this take place?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mapPlaceholder">Map Description</label>
                  <input
                    type="text"
                    id="mapPlaceholder"
                    value={selectedDayData.mapPlaceholder}
                    onChange={(e) => handleDayDataChange(selectedDay, 'mapPlaceholder', e.target.value)}
                    placeholder="Describe what should be shown on the map..."
                  />
                </div>
              </div>

              {/* Main Media */}
              {selectedDayData.media && selectedDayData.media.length > 0 && (
                <div className="form-section">
                  <h2>Main Photos & Videos</h2>
                  {selectedDayData.media.map((item, index) => (
                    <div key={index} className="media-edit-item">
                      <div className="media-header">
                        <div className="media-info">
                          {item.type === 'image' ? <Camera size={20} /> : <Video size={20} />}
                          <span className="filename">{item.filename}</span>
                        </div>
                        
                        <div className="media-controls">
                          <button
                            onClick={() => moveMedia(selectedDay, index, 'up')}
                            disabled={index === 0}
                            className="btn-icon"
                            title="Move up"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => moveMedia(selectedDay, index, 'down')}
                            disabled={index === selectedDayData.media.length - 1}
                            className="btn-icon"
                            title="Move down"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button
                            onClick={() => deleteMedia(selectedDay, index)}
                            className="btn-icon delete-btn"
                            title="Delete media"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {showPreviews && (
                        <div className="media-preview">
                          {item.type === 'image' ? (
                            <img 
                              src={getMediaPreviewPath(selectedDay, item.filename)} 
                              alt={item.caption || item.filename}
                              className="preview-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                          ) : (
                            <video 
                              poster={getMediaThumbnailPath(selectedDay, item.filename)}
                              className="preview-video"
                              controls
                            >
                              <source src={getMediaPreviewPath(selectedDay, item.filename)} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                          <div className="preview-fallback" style={{display: 'none'}}>
                            <div className="fallback-icon">
                              {item.type === 'image' ? <Camera size={48} /> : <Video size={48} />}
                            </div>
                            <p>Preview not available</p>
                            <p className="filename-small">{item.filename}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="form-group">
                        <label>Caption</label>
                        <input
                          type="text"
                          value={item.caption}
                          onChange={(e) => handleMediaChange(selectedDay, index, 'caption', e.target.value)}
                          placeholder="Add a caption for this media..."
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleMediaChange(selectedDay, index, 'description', e.target.value)}
                          placeholder="Add a detailed description..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Subfolders */}
              {selectedDayData.subfolders && selectedDayData.subfolders.map((subfolder, subfolderIndex) => (
                <div key={subfolderIndex} className="form-section subfolder-section">
                  <h2>
                    <Folder size={24} />
                    {subfolder.title}
                  </h2>
                  
                  <div className="form-group">
                    <label>Subfolder Title</label>
                    <input
                      type="text"
                      value={subfolder.title}
                      onChange={(e) => handleSubfolderChange(selectedDay, subfolderIndex, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Subfolder Description</label>
                    <textarea
                      value={subfolder.description}
                      onChange={(e) => handleSubfolderChange(selectedDay, subfolderIndex, 'description', e.target.value)}
                      placeholder="Describe this activity or location..."
                    />
                  </div>

                  {subfolder.media && subfolder.media.length > 0 && (
                    <div className="subfolder-media">
                      <h4>Media in this folder:</h4>
                      {subfolder.media.map((item, mediaIndex) => (
                        <div key={mediaIndex} className="media-edit-item">
                          <div className="media-header">
                            <div className="media-info">
                              {item.type === 'image' ? <Camera size={16} /> : <Video size={16} />}
                              <span className="filename">{item.filename}</span>
                            </div>
                            
                            <div className="media-controls">
                              <button
                                onClick={() => moveMedia(selectedDay, mediaIndex, 'up', subfolderIndex)}
                                disabled={mediaIndex === 0}
                                className="btn-icon"
                                title="Move up"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                onClick={() => moveMedia(selectedDay, mediaIndex, 'down', subfolderIndex)}
                                disabled={mediaIndex === subfolder.media.length - 1}
                                className="btn-icon"
                                title="Move down"
                              >
                                <ChevronDown size={14} />
                              </button>
                              <button
                                onClick={() => deleteMedia(selectedDay, mediaIndex, subfolderIndex)}
                                className="btn-icon delete-btn"
                                title="Delete media"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {showPreviews && (
                            <div className="media-preview">
                              {item.type === 'image' ? (
                                <img 
                                  src={getMediaPreviewPath(selectedDay, item.filename, subfolder.name)} 
                                  alt={item.caption || item.filename}
                                  className="preview-image"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                              ) : (
                                <video 
                                  poster={getMediaThumbnailPath(selectedDay, item.filename, subfolder.name)}
                                  className="preview-video"
                                  controls
                                >
                                  <source src={getMediaPreviewPath(selectedDay, item.filename, subfolder.name)} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              )}
                              <div className="preview-fallback" style={{display: 'none'}}>
                                <div className="fallback-icon">
                                  {item.type === 'image' ? <Camera size={40} /> : <Video size={40} />}
                                </div>
                                <p>Preview not available</p>
                                <p className="filename-small">{item.filename}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="form-group">
                            <label>Caption</label>
                            <input
                              type="text"
                              value={item.caption}
                              onChange={(e) => handleMediaChange(selectedDay, mediaIndex, 'caption', e.target.value, subfolderIndex)}
                              placeholder="Add a caption..."
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              value={item.description}
                              onChange={(e) => handleMediaChange(selectedDay, mediaIndex, 'description', e.target.value, subfolderIndex)}
                              placeholder="Add a description..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCaptions;
