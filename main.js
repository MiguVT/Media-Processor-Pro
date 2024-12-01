const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const MediaProcessor = require('./src/mediaProcessor');
const { validateMediaFile } = require('./src/validators');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 650,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: true
        }
    });

    const htmlPath = path.join(__dirname, 'src', 'ui', 'index.html');
    console.log('Loading HTML from:', htmlPath);
    mainWindow.loadFile(htmlPath);

    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

function setupApplication() {
    ipcMain.handle('select-file', async () => {
        try {
            const result = await dialog.showOpenDialog(mainWindow, {
                properties: ['openFile'],
                filters: [
                    { 
                        name: 'Media Files', 
                        extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'avi', 'mov', 'MOV', 'mkv', 'wmv'] 
                    }
                ]
            });

            if (!result.canceled && result.filePaths.length > 0) {
                const filePath = result.filePaths[0];
                console.log('Archivo seleccionado:', filePath);

                const validation = await validateMediaFile(filePath);
                console.log('Resultado de validación:', validation);

                if (!validation.isValid) {
                    throw new Error('El archivo seleccionado no es un archivo multimedia válido');
                }

                return filePath;
            }
            return null;
        } catch (error) {
            console.error('Error en select-file:', error);
            throw error;
        }
    });

    ipcMain.handle('process-videos', async (event, { filePath, numberOfCopies }) => {
        try {
            console.log('Iniciando procesamiento:', { filePath, numberOfCopies });
            
            const processor = new MediaProcessor(filePath);
            
            processor.on('progress', (current) => {
                mainWindow.webContents.send('progress-update', {
                    current,
                    total: numberOfCopies
                });
            });
            
            const results = await processor.generateVariants(numberOfCopies);
            return { success: true, results };
        } catch (error) {
            console.error('Error en process-media:', error);
            return { success: false, error: error.message };
        }
    });
}

app.whenReady().then(() => {
    setupApplication();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
