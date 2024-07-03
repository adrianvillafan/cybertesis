import express from 'express';
import multer from 'multer';
import { uploadFileToMinIO, getDownloadUrlFromMinIO, deleteFileFromMinIO, getViewUrlForDocument } from '../minio/controllers/minioController.js';
import { createOrFetchDocumentos } from '../queries/documentQueries.js';
import { insertTesis, deleteTesisById, getTesisById, getTesisByStudentId } from '../queries/tesisQueries.js';
import { getSolicitudesByEstudianteId } from '../queries/solicitudQueries.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });

const BUCKETS = {
  TESIS: process.env.BUCKET_TESIS,
  ACTAS: process.env.BUCKET_ACTAS,
  CERTIFICADOS: process.env.BUCKET_CERTIFICADOS,
  CYBER: process.env.BUCKET_CYBER,
  METADATOS: process.env.BUCKET_METADATOS,
  TURNITIN: process.env.BUCKET_TURNITIN
};

const getBucketName = (type) => BUCKETS[type];

router.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;
  const { type } = req.body;

  console.log('file', file);
  console.log('type', type);

  if (!file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  try {
    const bucketName = getBucketName(type);
    console.log('bucketNameReal', process.env.BUCKET_TESIS);
    console.log('bucketName', bucketName);

    if (!bucketName) {
      throw new Error('No se proporcionó un bucket válido.');
    }

    const uploadResult = await uploadFileToMinIO(file, bucketName, file.originalname);
    res.json({ message: uploadResult, fileName: file.originalname });
  } catch (error) {
    res.status(500).send('Error al subir el archivo: ' + error.message);
  }
});

router.get('/download/:type/:filename', async (req, res) => {
  const { type, filename } = req.params;

  try {
    const bucketName = getBucketName(type);
    const downloadUrl = await getDownloadUrlFromMinIO(bucketName, filename);
    res.send({ downloadUrl });
  } catch (error) {
    res.status(500).send('Error al obtener el link de descarga: ' + error.message);
  }
});

router.get('/view/:type/:filename', async (req, res) => {
  const { type, filename } = req.params;

  try {
    const bucketName = getBucketName(type);
    const blob = await getViewUrlForDocument(bucketName, filename);
    res.send(blob);
  } catch (error) {
    res.status(500).send('Error al obtener el blob del documento:' + error.message);
  }
});

router.delete('/delete/:type/:filename', async (req, res) => {
  const { type, filename } = req.params;

  try {
    const bucketName = getBucketName(type);
    await deleteFileFromMinIO(bucketName, filename);
    res.send({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar el archivo: ' + error.message);
  }
});

// ------------------ Tesis Routes ------------------

router.post('/tesis/insert', async (req, res) => {
  const tesisDetails = req.body;
  console.log('tesisDetails', tesisDetails);
  try {
    insertTesis(tesisDetails, (err, tesisId) => {
      if (err) {
        res.status(500).send('Error al insertar tesis: ' + err.message);
      } else {
        res.json({ message: 'Tesis insertada correctamente', tesisId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar tesis: ' + error.message);
  }
});

router.put('/tesis/update/:id', async (req, res) => {
  const { id } = req.params;
  const tesisDetails = req.body;

  try {
    updateTesis(id, tesisDetails, (err, result) => {
      if (err) {
        res.status(500).send('Error al actualizar tesis: ' + err.message);
      } else {
        res.json({ message: 'Tesis actualizada correctamente' });
      }
    });
  } catch (error) {
    res.status(500).send('Error al actualizar tesis: ' + error.message);
  }
});

router.delete('/tesis/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tesis = await new Promise((resolve, reject) => {
      getTesisById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!tesis) {
      return res.status(404).send('Tesis no encontrada.');
    }

    await deleteFileFromMinIO(BUCKETS.TESIS, tesis.file_url);
    await new Promise((resolve, reject) => {
      deleteTesisById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.json({ message: 'Tesis eliminada correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar tesis: ' + error.message);
  }
});

router.get('/tesis/:id', async (req, res) => {
  const { id } = req.params;

  try {
    getTesisById(id, async (err, tesis) => {
      if (err) {
        res.status(500).send('Error al obtener detalles de tesis: ' + err.message);
      } else if (!tesis) {
        res.status(404).send('Tesis no encontrada.');
      } else {
        try {
          const fileUrl = await getDownloadUrlFromMinIO('tesis', tesis.file_url);
          tesis.file_url = fileUrl;
          res.json(tesis);
        } catch (fileError) {
          res.status(500).send('Error al obtener la URL del archivo: ' + fileError.message);
        }
      }
    });
  } catch (error) {
    res.status(500).send('Error al obtener detalles de tesis: ' + error.message);
  }
});

router.get('/tesis/student/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    getTesisByStudentId(studentId, (err, tesisList) => {
      if (err) {
        res.status(500).send('Error al obtener las tesis del estudiante: ' + err.message);
      } else {
        res.json(tesisList);
      }
    });
  } catch (error) {
    res.status(500).send('Error al obtener las tesis del estudiante: ' + error.message);
  }
});

// ------------------ Document Handling Routes ------------------

router.post('/create-or-fetch', (req, res) => {
  const { gradeId, studentId, userId } = req.body;
  createOrFetchDocumentos(gradeId, studentId, userId, (error, documentos) => {
    if (error) {
      console.error('Error al crear o recuperar documentos:', error);
      res.status(500).json({ message: 'Error al crear o recuperar documentos', error: error.toString() });
    } else {
      res.json(documentos);
    }
  });
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
