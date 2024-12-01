const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const path = require('path');
const { EventEmitter } = require('events');
const { app } = require('electron');
const { getFfmpegPaths } = require('./validators')

class MediaProcessor extends EventEmitter {
    constructor(inputPath) {
        super();
        this.inputPath = inputPath;
        this.outputDir = path.dirname(inputPath);
        
        // Configurar FFmpeg
        const { ffmpeg: ffmpegbin, ffprobe: ffprobebin } = getFfmpegPaths();
        
        console.log('FFmpeg Path:', ffmpegbin);
        console.log('FFprobe Path:', ffprobebin);
        
        ffmpeg.setFfmpegPath(ffmpegbin);
        ffmpeg.setFfprobePath(ffprobebin);
    }

    async generateVariants(count) {
        const results = [];
        
        for (let i = 0; i < count; i++) {
            try {
                const result = await this.processMedia(i + 1);
                results.push(result);
                this.emit('progress', i + 1);
            } catch (error) {
                console.error('Error procesando media:', error);
                results.push({
                    success: false,
                    error: error.message
                });
                this.emit('progress', i + 1);
            }
        }
        
        return results;
    }

    async processMedia(index) {
        if (this.isImage) {
            return this.processImage(index);
        }
        return this.processVideo(index);
    }

    async processImage(index) {
        const outputPath = path.join(this.outputDir, `output_image_${index}${path.extname(this.inputPath)}`);
        
        try {
            const image = sharp(this.inputPath);
            const metadata = await image.metadata();

            // Aplicar modificaciones aleatorias
            const brightness = -0.1 + Math.random() * 0.2;
            const contrast = 0.9 + Math.random() * 0.2;
            const padding = Math.floor(Math.random() * 30);

            await image
                .modulate({ brightness: 1 + brightness })
                .linear(contrast, 0)
                .extend({
                    top: padding,
                    bottom: padding,
                    background: { r: 0, g: 0, b: 0, alpha: 1 }
                })
                .toFile(outputPath);

            return {
                success: true,
                path: outputPath
            };
        } catch (error) {
            throw new Error(`Error procesando imagen: ${error.message}`);
        }
    }

    async processVideo(index) {
        const outputPath = path.join(this.outputDir, `output_video_${index}.mp4`);
        
        return new Promise((resolve, reject) => {
            const command = ffmpeg(this.inputPath);
            this.applyRandomVideoModifications(command);
            
            command
                .output(outputPath)
                .on('end', () => {
                    resolve({
                        success: true,
                        path: outputPath
                    });
                })
                .on('error', (err) => {
                    reject(new Error(`Error procesando video: ${err.message}`));
                })
                .run();
        });
    }

    applyRandomVideoModifications(command) {
        const startTrim = Math.random() * 0.5;
        const brightness = -0.1 + Math.random() * 0.2;
        const speed = 0.95 + Math.random() * 0.1;
        const padding = Math.floor(Math.random() * 30);

        command
            .setStartTime(startTrim)
            .videoFilters([
                `eq=brightness=${brightness}`,
                `setpts=${1/speed}*PTS`,
                `pad=iw:ih+${padding}*2:0:${padding}:black`
            ])
            .audioFilters([`atempo=${speed}`]);
    }
}

module.exports = MediaProcessor;