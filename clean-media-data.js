import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current media data
const mediaDataPath = 'src/data/mediaData.js';
const mediaDataContent = fs.readFileSync(mediaDataPath, 'utf8');

// Extract the media data object from the module
const mediaDataMatch = mediaDataContent.match(/export const mediaData = ({[\s\S]*});/);
if (!mediaDataMatch) {
    console.error('Could not parse media data');
    process.exit(1);
}

const mediaData = eval('(' + mediaDataMatch[1] + ')');

// Base path for media files
const basePath = 'public/Pictures-Optimized';

let totalFiles = 0;
let missingFiles = 0;
let removedFiles = 0;

// Function to check if a file exists
function fileExists(dayKey, filename, subfolderName = null) {
    let filePath;
    if (subfolderName) {
        filePath = path.join(basePath, dayKey, subfolderName, filename);
    } else {
        filePath = path.join(basePath, dayKey, filename);
    }
    
    return fs.existsSync(filePath);
}

// Clean up media data
console.log('🔍 Scanning for missing media files...\n');

for (const [dayKey, dayData] of Object.entries(mediaData)) {
    console.log(`📅 Checking ${dayKey}...`);
    
    // Check main media array
    if (dayData.media && Array.isArray(dayData.media)) {
        const originalCount = dayData.media.length;
        dayData.media = dayData.media.filter(item => {
            totalFiles++;
            if (!fileExists(dayKey, item.filename)) {
                console.log(`  ❌ Missing: ${item.filename}`);
                missingFiles++;
                removedFiles++;
                return false;
            }
            return true;
        });
        
        if (dayData.media.length < originalCount) {
            console.log(`  🗑️ Removed ${originalCount - dayData.media.length} missing files from main folder`);
        }
    }
    
    // Check subfolder media arrays
    if (dayData.subfolders && Array.isArray(dayData.subfolders)) {
        dayData.subfolders.forEach(subfolder => {
            if (subfolder.media && Array.isArray(subfolder.media)) {
                const originalCount = subfolder.media.length;
                subfolder.media = subfolder.media.filter(item => {
                    totalFiles++;
                    if (!fileExists(dayKey, item.filename, subfolder.name)) {
                        console.log(`  ❌ Missing: ${subfolder.name}/${item.filename}`);
                        missingFiles++;
                        removedFiles++;
                        return false;
                    }
                    return true;
                });
                
                if (subfolder.media.length < originalCount) {
                    console.log(`  🗑️ Removed ${originalCount - subfolder.media.length} missing files from ${subfolder.name}`);
                }
            }
        });
    }
}

console.log(`\n📊 Summary:`);
console.log(`Total files referenced: ${totalFiles}`);
console.log(`Missing files found: ${missingFiles}`);
console.log(`Files removed from data: ${removedFiles}`);

if (removedFiles > 0) {
    // Write the cleaned media data back
    const newContent = `// Wedding and Honeymoon Media Data
// This file contains all the media information for the photo gallery

export const mediaData = ${JSON.stringify(mediaData, null, 2)};
`;

    // Backup the original file
    fs.copyFileSync(mediaDataPath, mediaDataPath + '.backup');
    console.log(`\n💾 Backup created: ${mediaDataPath}.backup`);
    
    // Write the cleaned data
    fs.writeFileSync(mediaDataPath, newContent);
    console.log(`✅ Cleaned media data written to ${mediaDataPath}`);
    console.log(`\n🎉 Media data cleanup complete!`);
} else {
    console.log(`\n✅ No missing files found - media data is clean!`);
}
