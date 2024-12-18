# Media Processor Pro

> **Note**: This repository's documentation is primarily in Spanish. Pull requests for multi-language support and English translations are welcome! 🌐

Una aplicación de escritorio para crear variaciones únicas de tus videos e imágenes, perfecta para redes sociales y contenido digital.

## ✨ Características

- 🎥 Procesamiento de videos con ajustes aleatorios
- 🖼️ Soporte para imágenes (jpg, jpeg, png, webp, gif)
- 🎬 Soporte para videos (mp4, avi, mov, mkv, wmv)
- 🎨 Modificaciones sutiles y únicas para cada archivo
- 💫 Interfaz moderna y fácil de usar
- 📊 Barra de progreso en tiempo real
- ✅ Validación de archivos

## 🚀 Modificaciones Aplicadas

### Para Videos:
- Recortes aleatorios al inicio (0-500ms)
- Ajustes de brillo
- Cambios sutiles en la velocidad
- Letterboxing aleatorio (barras negras)

### Para Imágenes:
- Ajustes de brillo
- Cambios de contraste
- Padding aleatorio

## 📥 Instalación

### Windows
1. Visita la [última versión](https://github.com/MiguVT/Media-Processor-Pro/releases/latest)
2. Descarga:
   - `MediaProcessorPro-Setup.exe` para la versión instalable
   - `MediaProcessorPro-Portable.exe` para la versión portable

### Versión Instalable
1. Ejecuta `MediaProcessorPro-Setup.exe`
2. Sigue el asistente de instalación
3. La aplicación se instalará y creará accesos directos

### Versión Portable
1. Descarga el ejecutable portable
2. Ejecuta directamente, no requiere instalación
3. Puedes moverlo a cualquier ubicación o unidad USB

## 🛠️ Compilación desde código fuente

1. Clona el repositorio:
```bash
git clone https://github.com/MiguVT/Media-Processor-Pro.git
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Inicia en modo desarrollo:
```bash
pnpm start
```

4. Para compilar:
```bash
pnpm run build
```
### 📦 Requisitos para compilación
- Node.js 14 o superior
- pnpm

## 🤝 Contribuir

Las contribuciones son bienvenidas. Especialmente:
- Soporte para múltiples idiomas
- Nuevos efectos y modificaciones
- Mejoras en la interfaz
- Correcciones de bugs

## 📄 Descripción Técnica

El proyecto está construido con:
- Electron para la aplicación de escritorio
- Tailwind CSS para el diseño
- FFmpeg para el procesamiento de videos
- Sharp para el procesamiento de imágenes
- Comunicación IPC segura entre procesos

### Estructura del Proyecto
```
media-processor-pro/
├── package.json
├── main.js
├── preload.js
└── src/
    ├── styles/
    │   └── input.css
    ├── mediaProcessor.js
    ├── validators.js
    └── ui/
        ├── index.html
        ├── styles.css
        └── renderer.js
```

## 📝 Licencia

Este proyecto está bajo una licencia personalizada que permite:
- ✅ Uso libre y gratuito
- ✅ Modificación del código
- ✅ Distribución de copias
- ✅ Creación de trabajos derivados

Con las siguientes restricciones:
- ❌ No se permite el uso comercial ni la venta
- ⚠️ Es obligatorio mantener la atribución a la autora original (miguvt)
- ⚠️ La atribución debe ser visible en la interfaz y documentación

Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♀️ Autora

Desarrollado con ❤️ por Yara([miguvt](https://github.com/miguvt))
