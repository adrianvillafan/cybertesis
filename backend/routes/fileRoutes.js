import express from 'express';
import multer from 'multer';
import { handleFileUpload, handleFileDownload } from '../minio/utils/storageHelpers.js';

// Configuración de Multer para guardar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Ruta temporal para previsualizar el archivo
router.post('/preview', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  // Devolver el buffer del archivo directamente (útil para previsualizar si es una imagen o texto)
  res.send(req.file.buffer);
});

// Ruta para subir archivos, con caché temporal
let fileCache = {};  // Simula una caché simple en memoria
router.post('/upload', upload.single('file'), (req, res) => {
  //console.log('Subiendo archivo:', req.file.originalname);
  console.log(req.file);
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  const fileId = Date.now().toString(); // ID único basado en timestamp
  fileCache[fileId] = req.file;  // Guardar el archivo en caché
  res.send({ fileId });  // Devolver el ID al cliente
});

// Ruta para confirmar la subida del archivo a MinIO
router.post('/confirm-upload', (req, res) => {
  const fileId = req.body.fileId;
  const file = fileCache[fileId];

  if (!file) {
    return res.status(404).send('Archivo no encontrado o expirado.');
  }

  // Proceder con la subida del archivo desde la caché a MinIO
  handleFileUpload({ file: file }, res);

  // Eliminar el archivo de la caché
  delete fileCache[fileId];
});

// Ruta para descargar archivos
router.get('/download/:filename', handleFileDownload);

export default router;
