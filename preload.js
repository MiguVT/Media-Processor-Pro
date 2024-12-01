const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    selectFile: () => ipcRenderer.invoke('select-file'),
    processVideos: (options) => ipcRenderer.invoke('process-videos', options),
    onProgress: (callback) => {
        ipcRenderer.on('progress-update', (_, value) => callback(value));
    },
    removeProgressListener: (callback) => {
        ipcRenderer.removeListener('progress-update', callback);
    }
});