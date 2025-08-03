#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PICTURES_DIR = './public/Pictures-Optimized';
const MAX_FILE_SIZE_MB = 95; // Target 95MB to stay safely under 100MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

console.log('🎬 Optimizing Large Video Files');
console.log('================================');
console.log(`Target max size: ${MAX_FILE_SIZE_MB}MB`);
console.log('');

// Check if ffmpeg is available
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
} catch (error) {
  console.log('❌ FFmpeg not found. Please install FFmpeg first.');
  console.log('   Download from: https://ffmpeg.org/download.html');
  console.log('   Or install with: winget install FFmpeg');
  process.exit(1);
}

function getAllVideoFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllVideoFiles(fullPath));
    } else if (path.extname(item).toLowerCase() === '.mp4') {
      files.push(fullPath);
    }
  }
  
  return files;
}

function formatFileSize(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
}

function compressVideo(inputPath, targetSizeMB = MAX_FILE_SIZE_MB) {
  const inputSize = fs.statSync(inputPath).size;
  const inputSizeMB = inputSize / (1024 * 1024);
  
  // Create backup of original
  const backupPath = inputPath.replace('.mp4', '_original.mp4');
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
    console.log(`   📋 Backup created: ${path.basename(backupPath)}`);
  }
  
  // Calculate target bitrate (leaving some headroom)
  const tempPath = inputPath.replace('.mp4', '_temp.mp4');
  
  // Get video duration first
  try {
    const durationCmd = `ffprobe -v quiet -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputPath}"`;
    const duration = parseFloat(execSync(durationCmd, { encoding: 'utf8' }).trim());
    
    if (!duration || duration <= 0) {
      console.log(`   ⚠️  Could not determine duration for ${path.basename(inputPath)}`);
      return false;
    }
    
    // Calculate target bitrate (80% of max to leave headroom)
    const targetSizeBytes = targetSizeMB * 1024 * 1024 * 0.8;
    const targetBitrate = Math.floor((targetSizeBytes * 8) / duration / 1000); // kbps
    
    console.log(`   🎯 Target bitrate: ${targetBitrate}k (duration: ${duration.toFixed(1)}s)`);
    
    // Compress video with calculated bitrate
    const ffmpegCmd = [
      'ffmpeg',
      '-i', `"${inputPath}"`,
      '-c:v libx264',
      '-b:v', `${targetBitrate}k`,
      '-maxrate', `${targetBitrate * 1.2}k`,
      '-bufsize', `${targetBitrate * 2}k`,
      '-c:a aac',
      '-b:a 128k',
      '-movflags +faststart',
      '-y',
      `"${tempPath}"`
    ].join(' ');
    
    console.log(`   🔄 Compressing...`);
    execSync(ffmpegCmd, { stdio: 'ignore' });
    
    // Check if compression was successful
    if (fs.existsSync(tempPath)) {
      const newSize = fs.statSync(tempPath).size;
      const newSizeMB = newSize / (1024 * 1024);
      
      if (newSize < inputSize && newSizeMB <= targetSizeMB) {
        // Replace original with compressed version
        fs.unlinkSync(inputPath);
        fs.renameSync(tempPath, inputPath);
        
        const savings = ((inputSize - newSize) / inputSize * 100).toFixed(1);
        console.log(`   ✅ Compressed: ${formatFileSize(inputSize)} → ${formatFileSize(newSize)} (${savings}% smaller)`);
        return true;
      } else {
        // Compression didn't help enough, keep original
        fs.unlinkSync(tempPath);
        console.log(`   ⚠️  Compression didn't achieve target size: ${formatFileSize(newSize)}`);
        return false;
      }
    } else {
      console.log(`   ❌ Compression failed`);
      return false;
    }
    
  } catch (error) {
    console.log(`   ❌ Error compressing: ${error.message}`);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    return false;
  }
}

async function main() {
  const videoFiles = getAllVideoFiles(PICTURES_DIR);
  const largeFiles = videoFiles.filter(file => {
    const size = fs.statSync(file).size;
    return size > MAX_FILE_SIZE_BYTES;
  });
  
  console.log(`Found ${largeFiles.length} video files over ${MAX_FILE_SIZE_MB}MB:`);
  console.log('');
  
  if (largeFiles.length === 0) {
    console.log('🎉 No files need optimization!');
    return;
  }
  
  // Sort by size (largest first)
  largeFiles.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);
  
  let successCount = 0;
  
  for (let i = 0; i < largeFiles.length; i++) {
    const file = largeFiles[i];
    const size = fs.statSync(file).size;
    const sizeMB = formatFileSize(size);
    
    console.log(`${i + 1}/${largeFiles.length}. ${path.basename(file)} (${sizeMB})`);
    
    if (compressVideo(file)) {
      successCount++;
    }
    
    console.log('');
  }
  
  console.log('🎉 Optimization Complete!');
  console.log(`   ✅ ${successCount}/${largeFiles.length} files successfully compressed`);
  console.log(`   📁 Original files backed up with '_original.mp4' suffix`);
  console.log('');
  console.log('💡 Note: If you need to restore originals, rename the _original.mp4 files back to .mp4');
}

main().catch(console.error);
