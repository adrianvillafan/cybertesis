import express from 'express';
import multer from 'multer';
import { handleFileUpload, handleFileDownload } from '../minio/utils/storageHelpers.js';

// Configuración de Multer para guardar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Ruta para subir archivos
router.post('/upload', upload.single('file'), (req, res) => {
  // Aquí, req.file es el archivo cargado y almacenado en memoria
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  handleFileUpload(req, res);
});

// Ruta para descargar archivos
router.get('/download/:filename', handleFileDownload);

export default router;
