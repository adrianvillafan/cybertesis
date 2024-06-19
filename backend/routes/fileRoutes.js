import express from 'express';
import multer from 'multer';
import { uploadFileToMinIO, getDownloadUrlFromMinIO, deleteFileFromMinIO, getViewUrlForDocument } from '../minio/controllers/minioController.js';
import { getSolicitudesByEstudianteId } from '../queries/solicitudQueries.js';
import { insertDocument } from '../queries/documentQueries.js';
import tesisRoutes from './tesisRoutes.js';  // Importa las rutas de tesis

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Límite de 10 MB

const TESIS_BUCKET_NAME = process.env.TESIS_BUCKET_NAME; // Nuevo bucket específico para tesis

// Usa las rutas de tesis
router.use('/tesis', tesisRoutes);

// Ruta para subir archivos, con caché temporal
let fileCache = {};  // Simula una caché simple en memoria
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se subió ningún archivo.');
  }
  const fileId = Date.now().toString(); // ID único basado en timestamp
  fileCache[fileId] = req.file;  // Guardar el archivo en caché
  res.send({ fileId });  // Devolver el ID al cliente
});

router.post('/confirm-upload', async (req, res) => {
  const { fileId, tipo, estudianteId, solicitudId, usuarioCargaId } = req.body;
  const file = fileCache[fileId];
  console.log(fileId, tipo, estudianteId, solicitudId, usuarioCargaId, file);

  if (!file) {
    return res.status(404).send('Archivo no encontrado o expirado.');
  }

  // Construir el nombre del archivo según la convención dada
  const filename = `${tipo}-${estudianteId}-${solicitudId}-${file.originalname}`;

  try {
    // Subir el archivo a MinIO
    const etag = await uploadFileToMinIO(file, TESIS_BUCKET_NAME, filename);

    // Insertar detalles del documento en la base de datos
    const documentDetails = {
      tipo: tipo + 1,
      urlDocumento: filename,  // Almacenamos el nombre del archivo en lugar de la URL
      estudianteId: estudianteId,
      estadoId: 1,  // Estado inicial, ajustar según la lógica de la aplicación
      tamano: file.size,
      fechaCarga: new Date(),
      usuarioCargaId: usuarioCargaId,
      ultimaModificacion: new Date(),
      solicitudId: solicitudId
    };

    insertDocument(documentDetails, (err, result) => {
      if (err) {
        console.error('Error inserting document:', err);
        // Handle the error, e.g., send a response to the client indicating failure
      } else {
        console.log('Document inserted successfully with ID:', result);
        // Continue processing or send a success response to the client
      }
    });

    res.send({ message: 'Archivo subido exitosamente', etag });
    delete fileCache[fileId];  // Limpiar la caché
  } catch (error) {
    res.status(500).send('Error al subir archivo: ' + error.message);
  }
});

// Ruta para descargar archivos
router.get('/download/:filename', async (req, res) => {
  try {
    const fileName = req.params.filename;
    const downloadUrl = await getDownloadUrlFromMinIO(TESIS_BUCKET_NAME, fileName);
    res.send({ downloadUrl });
  } catch (error) {
    res.status(500).send('Error al obtener el link de descarga: ' + error.message);
  }
});

// Ruta para obtener la URL de vista de un documento
router.get('/view/:filename', async (req, res) => {
  try {
    const blob = await getViewUrlForDocument(TESIS_BUCKET_NAME, req.params.filename);
    res.send(blob);
  } catch (error) {
    res.status(500).send('Error al obtener el blob del documento:' + error.message);
  }
});

// Ruta para eliminar archivos
router.delete('/delete/:filename', async (req, res) => {
  try {
    await deleteFileFromMinIO(TESIS_BUCKET_NAME, req.params.filename);
    await deleteDocumentByFilename(req.params.filename);
    res.send({ message: 'Archivo y registro eliminados exitosamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar el archivo y el registro: ' + error.message);
  }
});

// Endpoint para obtener las solicitudes de un estudiante por su ID
router.get('/solicitudes/:estudianteId', (req, res) => {
  const { estudianteId } = req.params;
  getSolicitudesByEstudianteId(estudianteId, (err, solicitudes) => {
    if (err) {
      res.status(500).send('Error al consultar las solicitudes del estudiante');
    } else {
      res.json(solicitudes);
    }
  });
});

export default router;
