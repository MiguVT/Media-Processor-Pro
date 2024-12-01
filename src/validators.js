const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const path = require('path');
const { app } = require('electron');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');

// Función para obtener las rutas de FFmpeg
function getFfmpegPaths() {
    if (app.isPackaged) {
        // Versión compilada
        const resourcePath = process.resourcesPath;
        return {
            ffmpeg: path.join(resourcePath, 'bin', 'ffmpeg.exe'),
            ffprobe: path.join(resourcePath, 'bin', 'ffprobe.exe')
        };
    } else {
        // Versión de desarrollo
        return {
            ffmpeg: ffmpegStatic,
            ffprobe: ffprobeStatic.path
        };
    }
}

const { ffmpeg: ffmpegPath, ffprobe: ffprobePath } = getFfmpegPaths();

console.log('Is Packaged:', app.isPackaged);
console.log('FFmpeg Path:', ffmpegPath);
console.log('FFprobe Path:', ffprobePath);

// Configurar FFmpeg con las rutas correctas
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

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
        console.log('Validando archivo:', filePath);
        const ext = path.extname(filePath).toLowerCase();

        if (isImage(filePath)) {
            try {
                await sharp(filePath).metadata();
                return { isValid: true, type: 'image' };
            } catch (error) {
                console.error('Error validando imagen:', error);
                return { isValid: false, type: 'unknown' };
            }
        } 
        
        if (isVideo(filePath)) {
            return new Promise((resolve) => {
                ffmpeg.ffprobe(filePath, (err, metadata) => {
                    if (err) {
                        console.error('Error en ffprobe:', err);
                        resolve({ isValid: false, type: 'unknown' });
                        return;
                    }

                    const hasVideoStream = metadata.streams.some(stream => stream.codec_type === 'video');
                    console.log('Streams encontrados:', metadata.streams.length);
                    console.log('¿Tiene stream de video?:', hasVideoStream);

                    resolve({ isValid: hasVideoStream, type: 'video' });
                });
            });
        }
        
        return { isValid: false, type: 'unknown' };
    } catch (error) {
        console.error('Error en validación:', error);
        return { isValid: false, type: 'unknown' };
    }
}

module.exports = {
    validateMediaFile,
    isImage,
    isVideo,
    getFfmpegPaths
};