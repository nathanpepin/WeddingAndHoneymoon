# Wedding & Honeymoon Website

A beautiful React website to showcase your wedding and honeymoon photos and videos with an elegant timeline layout, captions, and descriptions.

## Features

- 📸 **Photo & Video Gallery**: Organized by days and activities
- 📅 **Timeline View**: Chronological journey through your wedding and honeymoon
- ✏️ **Editable Captions**: Easy-to-use interface for adding captions and descriptions
- 🗺️ **Map Placeholders**: Space for interactive maps for each location
- 💍 **Wedding Theme**: Elegant styling with gold and cream color scheme
- 📱 **Responsive Design**: Works beautifully on all devices

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx      # Navigation header
│   ├── Sidebar.jsx     # Day navigation sidebar
│   └── ActivitiesSidebar.jsx # Activity navigation
├── pages/              # Main pages
│   ├── Home.jsx        # Landing page
│   ├── Timeline.jsx    # Timeline view of all days
│   ├── DayView.jsx     # Detailed view of a single day
│   └── ActivityView.jsx # Activity-specific view
├── data/
│   └── mediaData.js    # Data structure for all media and descriptions
├── utils/
│   └── mediaUtils.js   # Utility functions for media handling
├── App.jsx             # Main app component
├── main.jsx           # React entry point
└── index.css          # Global styles
```

## Adding Your Photos and Videos

The website is designed to work with your media files organized in the `public/Pictures-Optimized/` directory:

```
public/Pictures-Optimized/
├── 2025-07-18_Bachelor Party/
├── 2025-07-19_Rehearsal_Bachelorette Party/
├── 2025-07-20_Wedding/
├── 2025-07-23_Trip_Hotel/
└── ... (other days)
```

### Media Organization
- Each day has its own folder named with `YYYY-MM-DD_EventName` format
- Photos and videos are stored directly in day folders or organized in subfolders
- Thumbnails are automatically generated with `_thumbnail.jpg` suffix for videos
- Both original and optimized versions are supported

## Editing Captions and Descriptions

### Using the Web Interface
1. Navigate to the "Edit" section in the website (`/edit`)
2. Select a day from the dropdown
3. Edit titles, descriptions, locations, and media captions
4. Click "Save Changes" to download an updated JSON file
5. Replace the data in `src/data/mediaData.js` with your updated content

### Direct File Editing
Edit `src/data/mediaData.js` directly to:
- Add new media files
- Update captions and descriptions  
- Modify day titles and locations
- Add map descriptions

## Customization

### Styling
- Colors and fonts are defined in CSS custom properties in `src/index.css`
- Wedding theme uses gold (`--primary-color`) and cream (`--secondary-color`)
- Easy to customize by changing these variables

### Adding New Features
- **Real Maps**: Replace map placeholders with actual map components (Google Maps, Mapbox, etc.)
- **Image Optimization**: Add image loading and optimization
- **Search**: Add search functionality across photos and days
- **Sharing**: Add social media sharing capabilities

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

## Deployment

The built website can be deployed to any static hosting service:
- Netlify
- Vercel  
- GitHub Pages
- AWS S3
- Or any web server

## Technical Notes

### Media File Handling
- Displays actual photos and videos from the `public/Pictures-Optimized/` directory
- File paths are generated based on folder structure
- Video files show play button overlay and use generated thumbnails
- Click to view media in modal overlay
- Supports both images (JPG, etc.) and videos (MP4)

### Data Structure
- All media data is stored in JavaScript objects in `src/data/mediaData.js`
- Easy to export/import for backup using the Edit interface
- Supports nested folder structures
- Extensible for additional metadata

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Uses CSS Grid and Flexbox for layouts

## Troubleshooting

### Media Files Not Showing
1. Ensure your media files are in the `public/Pictures-Optimized/` directory
2. Check file paths in the browser developer tools
3. Verify file extensions match those in `mediaData.js`
4. Ensure thumbnail files exist for videos (`filename_thumbnail.jpg`)

### Performance Issues
1. Consider image optimization for faster loading
2. Implement lazy loading for large galleries
3. Use appropriate image formats (WebP, AVIF when possible)

## Future Enhancements

- [ ] Interactive maps integration
- [ ] Photo upload interface
- [ ] Database backend for data persistence
- [ ] User authentication
- [ ] Comment system for guests
- [ ] Photo downloading capabilities
- [ ] Slideshow mode
- [ ] Search and filtering
- [ ] Social media integration

## Support

For questions or issues, refer to the React and Vite documentation:
- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)

Enjoy your beautiful wedding and honeymoon website! 💕
