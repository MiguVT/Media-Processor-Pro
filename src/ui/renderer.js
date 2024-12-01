let selectedFilePath = null;
let selectedFileType = null;
let totalFiles = 0;
let processedFiles = 0;

// Obtener referencias a los elementos de la UI
const processButton = document.getElementById('processButton');
const selectFileButton = document.getElementById('selectFile');
const copiesCount = document.getElementById('copiesCount');
const copiesSlider = document.getElementById('copiesSlider');
const progressBar = document.getElementById('progressBar');
const progressPercentage = document.getElementById('progressPercentage');
const statusMessage = document.getElementById('statusMessage');
const progressSection = document.getElementById('progress');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileIcon = document.getElementById('fileIcon');
const fileType = document.getElementById('fileType');
const resultsList = document.getElementById('resultsList');
const resultsSection = document.getElementById('results');

function updateProgress(current, total) {
    const percentage = (current / total) * 100;
    progressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${Math.round(percentage)}%`;
    statusMessage.textContent = `Procesando archivo ${current}/${total}`;
}

function updateProcessButton() {
    const isValid = selectedFilePath && copiesCount.value >= 1 && copiesCount.value <= 10;
    processButton.disabled = !isValid;
    processButton.className = isValid 
        ? 'btn-primary w-full' 
        : 'btn-disabled w-full';
}

function updateFileInfo(filePath, type) {
    const name = filePath.split('\\').pop();
    fileName.textContent = name;
    fileType.textContent = type === 'video' ? 'Archivo de Video' : 'Archivo de Imagen';
    fileIcon.className = `fas fa-${type === 'video' ? 'video' : 'image'} text-blue-400`;
    fileInfo.classList.remove('hidden');
}

// Sincronización del slider y el input numérico
copiesCount.addEventListener('input', (e) => {
    copiesSlider.value = e.target.value;
    updateProcessButton();
});

copiesSlider.addEventListener('input', (e) => {
    copiesCount.value = e.target.value;
    updateProcessButton();
});

// Manejador de selección de archivo
selectFileButton.addEventListener('click', async () => {
    try {
        const filePath = await window.api.selectFile();
        if (filePath) {
            selectedFilePath = filePath;
            selectedFileType = filePath.toLowerCase().endsWith('.mp4') || 
                             filePath.toLowerCase().endsWith('.mov') || 
                             filePath.toLowerCase().endsWith('.avi') ? 'video' : 'image';
            updateFileInfo(filePath, selectedFileType);
            updateProcessButton();
        }
    } catch (error) {
        showNotification('Error al seleccionar el archivo: ' + error.message, 'error');
    }
});

// Manejador de procesamiento
processButton.addEventListener('click', async () => {
    const numberOfCopies = parseInt(copiesCount.value);
    
    if (!selectedFilePath || numberOfCopies < 1) {
        showNotification('Por favor, seleccione un archivo y especifique el número de copias', 'warning');
        return;
    }
    
    try {
        // Reiniciar contadores y guardar total
        totalFiles = numberOfCopies;
        processedFiles = 0;
        
        // UI feedback
        progressSection.classList.remove('hidden');
        processButton.disabled = true;
        selectFileButton.disabled = true;
        copiesCount.disabled = true;
        copiesSlider.disabled = true;
        
        // Inicializar progreso
        updateProgress(0, totalFiles);
        
        const result = await window.api.processVideos({
            filePath: selectedFilePath,
            numberOfCopies: totalFiles
        });
        
        if (result.success) {
            updateProgress(totalFiles, totalFiles);
            showResults(result.results);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        showNotification('Error al procesar los archivos: ' + error.message, 'error');
        updateProgress(0, totalFiles);
    } finally {
        processButton.disabled = false;
        selectFileButton.disabled = false;
        copiesCount.disabled = false;
        copiesSlider.disabled = false;
    }
});

// Escuchar eventos de progreso
window.api.onProgress((progress) => {
    processedFiles = progress.current;
    totalFiles = progress.total;
    updateProgress(processedFiles, totalFiles);
});

function showResults(results) {
    resultsList.innerHTML = '';
    resultsSection.classList.remove('hidden');
    
    results.forEach((result, index) => {
        const li = document.createElement('li');
        
        if (result.success) {
            li.innerHTML = `
                <i class="fas fa-check-circle text-green-400"></i>
                <div class="flex-grow">
                    <div class="font-medium">Archivo ${index + 1}</div>
                    <div class="text-sm text-gray-400">${result.path}</div>
                </div>
            `;
        } else {
            li.innerHTML = `
                <i class="fas fa-exclamation-circle text-red-400"></i>
                <div class="flex-grow">
                    <div class="font-medium text-red-400">Error en Archivo ${index + 1}</div>
                    <div class="text-sm text-gray-400">${result.error}</div>
                </div>
            `;
        }
        
        resultsList.appendChild(li);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg animate-fade-in ${
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}