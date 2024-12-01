const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs').promises;

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.MOV'];

function isImage(filePath) {
    return IMAGE_EXTENSIONS.includes(path.extname(filePath).toLowerCase());
}

function isVideo(filePath) {
    return VIDEO_EXTENSIONS.includes(path.extname(filePath).toLowerCase());
}

async function validateMediaFile(filePath) {
    try {
        const ext = path.extname(filePath).toLowerCase();

        if (isImage(filePath)) {
            // Validar imagen usando sharp
            await sharp(filePath).metadata();
            return { isValid: true, type: 'image' };
        } 
        else if (isVideo(filePath)) {
            // Validar video usando ffmpeg
            const isValid = await new Promise((resolve) => {
                ffmpeg.ffprobe(filePath, (err, metadata) => {
                    if (err) {
                        resolve(false);
                        return;
                    }
                    const hasVideoStream = metadata.streams.some(stream => stream.codec_type === 'video');
                    resolve(hasVideoStream);
                });
            });
            return { isValid, type: 'video' };
        }
        
        return { isValid: false, type: 'unknown' };
    } catch (error) {
        console.error('Error validando archivo:', error);
        return { isValid: false, type: 'unknown' };
    }
}

module.exports = {
    validateMediaFile,
    isImage,
    isVideo
};
