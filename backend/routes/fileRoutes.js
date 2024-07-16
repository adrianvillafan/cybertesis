import express from 'express';
import multer from 'multer';
import { uploadFileToMinIO, getDownloadUrlFromMinIO, deleteFileFromMinIO, getViewUrlForDocument } from '../minio/controllers/minioController.js';
import { createOrFetchDocumentos } from '../queries/documentQueries.js';
import { insertTesis, deleteTesisById, getTesisById, getTesisByStudentId } from '../queries/tesisQueries.js';
import { getSolicitudesByEstudianteId } from '../queries/solicitudQueries.js';
import { insertActaSustentacion, deleteActaSustentacionById, getActaSustentacionById } from '../queries/actaQueries.js';
import { insertMetadata,
  deleteMetadataById,
  getMetadataById,
  getLineasInvestigacion, 
  getGruposInvestigacion, 
  getDisciplinasOCDE
} from '../queries/metadataQueries.js';
import { insertCertificadoSimilitud, deleteCertificadoSimilitudById, getCertificadoSimilitudById } from '../queries/certificadosQueries.js';
import { insertAutoCyber, deleteAutoCyberById, getAutoCyberById } from '../queries/autocyberQueries.js';
import { insertReporteTurnitin, deleteReporteTurnitinById, getReporteTurnitinById } from '../queries/turnitinQueries.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });

const BUCKETS = {
  TESIS: process.env.BUCKET_TESIS,
  ACTAS: process.env.BUCKET_ACTAS,
  CERTIFICADOS: process.env.BUCKET_CERTIFICADOS,
  CYBER: process.env.BUCKET_AUTOCYBER,
  METADATOS: process.env.BUCKET_METADATOS,
  TURNITIN: process.env.BUCKET_TURNITIN
};

const getBucketName = (type) => BUCKETS[type];

router.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;
  const { type } = req.body;

  console.log('file', file);
  console.log('type', type);
  console.log('BUCKETS', getBucketName(type));

  if (!file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  try {
    const bucketName = getBucketName(type);
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
    res.status (500).send('Error al obtener las tesis del estudiante: ' + error.message);
  }
});

// ------------------ Acta Sustentacion Routes ------------------

router.post('/acta/insert', async (req, res) => {
  const actaDetails = req.body;
  console.log('actaDetails', actaDetails);
  try {
    insertActaSustentacion(actaDetails, (err, actaId) => {
      if (err) {
        res.status(500).send('Error al insertar acta de sustentación: ' + err.message);
      } else {
        res.json({ message: 'Acta de sustentación insertada correctamente', actaId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar acta de sustentación: ' + error.message);
  }
});

router.delete('/acta/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const acta = await new Promise((resolve, reject) => {
      getActaSustentacionById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!acta) {
      return res.status(404).send('Acta de sustentación no encontrada.');
    }

    await deleteFileFromMinIO(BUCKETS.ACTAS, acta.file_url);
    await new Promise((resolve, reject) => {
      deleteActaSustentacionById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.json({ message: 'Acta de sustentación eliminada correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar acta de sustentación: ' + error.message);
  }
});

router.get('/acta/:id', async (req, res) => {
  const { id } = req.params;

  try {
    getActaSustentacionById(id, async (err, acta) => {
      if (err) {
        res.status(500).send('Error al obtener detalles de acta de sustentación: ' + err.message);
      } else if (!acta) {
        res.status(404).send('Acta de sustentación no encontrada.');
      } else {
        try {
          const fileUrl = await getDownloadUrlFromMinIO('actas', acta.file_url);
          acta.file_url = fileUrl;
          res.json(acta);
        } catch (fileError) {
          res.status(500).send('Error al obtener la URL del archivo: ' + fileError.message);
        }
      }
    });
  } catch (error) {
    res.status(500).send('Error al obtener detalles de acta de sustentación: ' + error.message);
  }
});

// ------------------ Metadata Routes ------------------

router.post('/metadata/insert', async (req, res) => {
  const metadataDetails = req.body;
  console.log('metadataDetails', metadataDetails);
  try {
    insertMetadata(metadataDetails, (err, metadataId) => {
      if (err) {
        res.status(500).send('Error al insertar metadata: ' + err.message);
      } else {
        res.json({ message: 'Metadata insertada correctamente', metadataId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar metadata: ' + error.message);
  }
});

router.delete('/metadata/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const metadata = await new Promise((resolve, reject) => {
      getMetadataById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!metadata) {
      return res.status(404).send('Metadata no encontrada.');
    }

    if (metadata.file_url) {
      await deleteFileFromMinIO('metadatos', metadata.file_url);
    }

    await new Promise((resolve, reject) => {
      deleteMetadataById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.json({ message: 'Metadata eliminada correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar metadata: ' + error.message);
  }
});

router.get('/metadata/:id', async (req, res) => {
  const { id } = req.params;

  try {
    getMetadataById(id, async (err, metadata) => {
      if (err) {
        res.status(500).send('Error al obtener detalles de metadata: ' + err.message);
      } else if (!metadata) {
        res.status(404).send('Metadata no encontrada.');
      } else {
        try {
          const fileUrl = await getDownloadUrlFromMinIO('metadatos', metadata.file_url);
          metadata.file_url = fileUrl;
          res.json(metadata);
        } catch (fileError) {
          res.status(500).send('Error al obtener la URL del archivo: ' + fileError.message);
        }
      }
    });
  } catch (error) {
    res.status(500).send('Error al obtener detalles de metadata: ' + error.message);
  }
});

router.get('/lineas-investigacion/:facultadId', (req, res) => {
  const { facultadId } = req.params;
  getLineasInvestigacion(facultadId,(err, lineas) => {
    if (err) {
      res.status(500).send('Error al obtener líneas de investigación: ' + err.message);
    } else {
      res.json(lineas);
    }
  });
});

router.get('/grupos-investigacion/:facultadId', (req, res) => {
  const { facultadId } = req.params;
  getGruposInvestigacion(facultadId, (err, grupos) => {
    if (err) {
      res.status(500).send('Error al obtener grupos de investigación: ' + err.message);
    } else {
      res.json(grupos);
    }
  });
});

router.get('/disciplinas-ocde', (req, res) => {
  getDisciplinasOCDE((err, disciplinas) => {
    if (err) {
      res.status(500).send('Error al obtener disciplinas OCDE: ' + err.message);
    } else {
      res.json(disciplinas);
    }
  });
});

// ------------------ Certificado Similitud Routes ------------------

router.post('/certificado/insert', async (req, res) => {
  const certificadoDetails = req.body;
  console.log('certificadoDetails', certificadoDetails);
  try {
    insertCertificadoSimilitud(certificadoDetails, (err, certificadoId) => {
      if (err) {
        res.status(500).send('Error al insertar certificado de similitud: ' + err.message);
      } else {
        res.json({ message: 'Certificado de similitud insertado correctamente', certificadoId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar certificado de similitud: ' + error.message);
  }
});


router.get('/certificado/:id', async (req, res) => {
  const { id } = req.params;
  getCertificadoSimilitudById(id, async (err, certificado) => {
    if (err) {
      res.status(500).send('Error al obtener detalles de certificado de similitud: ' + err.message);
    } else if (!certificado) {
      res.status(404).send('Certificado de similitud no encontrado.');
    } else {
      try {
        const fileUrl = await getDownloadUrlFromMinIO('certificados', certificado.file_url);
        certificado.file_url = fileUrl;
        res.json(certificado);
      } catch (fileError) {
        res.status(500).send('Error al obtener la URL del archivo: ' + fileError.message);
      }
    }
  });
});

router.delete('/certificado/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const certificado = await new Promise((resolve, reject) => {
      getCertificadoSimilitudById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!certificado) {
      return res.status(404).send('Certificado de similitud no encontrado.');
    }

    await deleteFileFromMinIO(BUCKETS.CERTIFICADOS, certificado.file_url);
    await new Promise((resolve, reject) => {
      deleteCertificadoSimilitudById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.json({ message: 'Certificado de similitud eliminado correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar certificado de similitud: ' + error.message);
  }
});

// ------------------ AutoCyber Routes ------------------

router.post('/autocyber/insert', async (req, res) => {
  const autoCyberDetails = req.body;
  console.log('autoCyberDetails', autoCyberDetails);
  try {
    insertAutoCyber(autoCyberDetails, (err, autoCyberId) => {
      if (err) {
        res.status(500).send('Error al insertar AutoCyber: ' + err.message);
      } else {
        res.json({ message: 'AutoCyber insertado correctamente', autoCyberId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar AutoCyber: ' + error.message);
  }
});

router.delete('/autocyber/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const autoCyber = await new Promise((resolve, reject) => {
      getAutoCyberById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!autoCyber) {
      return res.status(404).send('AutoCyber no encontrado.');
    }

    await deleteFileFromMinIO(BUCKET_AUTOCYBER, autoCyber.file_url);
    await new Promise((resolve, reject) => {
      deleteAutoCyberById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.json({ message: 'AutoCyber eliminado correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar AutoCyber: ' + error.message);
  }
});

router.get('/autocyber/:id', async (req, res) => {
  const { id } = req.params;

  try {
    getAutoCyberById(id, async (err, autoCyber) => {
      if (err) {
        res.status(500).send('Error al obtener detalles de AutoCyber: ' + err.message);
      } else if (!autoCyber) {
        res.status(404).send('AutoCyber no encontrado.');
      } else {
        try {
          const fileUrl = await getDownloadUrlFromMinIO('autocyber', autoCyber.file_url);
          autoCyber.file_url = fileUrl;
          res.json(autoCyber);
        } catch (fileError) {
          res.status(500).send('Error al obtener la URL del archivo: ' + fileError.message);
        }
      }
    });
  } catch (error) {
    res.status(500).send('Error al obtener detalles de AutoCyber: ' + error.message);
  }
});

// ------------------ Reporte Turnitin Routes ------------------

router.post('/reporte-turnitin/insert', async (req, res) => {
  const reporteDetails = req.body;
  console.log('reporteDetails', reporteDetails);
  try {
    insertReporteTurnitin(reporteDetails, (err, reporteId) => {
      if (err) {
        res.status(500).send('Error al insertar reporte de Turnitin: ' + err.message);
      } else {
        res.json({ message: 'Reporte de Turnitin insertado correctamente', reporteId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar reporte de Turnitin: ' + error.message);
  }
});

router.get('/reporte-turnitin/:id', async (req, res) => {
  const { id } = req.params;
  getReporteTurnitinById(id, async (err, reporte) => {
    if (err) {
      res.status (500).send('Error al obtener detalles de reporte de Turnitin: ' + err.message);
    } else if (!reporte) {
      res.status(404).send('Reporte de Turnitin no encontrado.');
    } else {
      try {
        const fileUrl = await getDownloadUrlFromMinIO('turnitin', reporte.file_url);
        reporte.file_url = fileUrl;
        res.json(reporte);
      } catch (fileError) {
        res.status(500).send('Error al obtener la URL del archivo: ' + fileError.message);
      }
    }
  });
});

router.delete('/reporte-turnitin/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const reporte = await new Promise((resolve, reject) => {
      getReporteTurnitinById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!reporte) {
      return res.status(404).send('Reporte de Turnitin no encontrado.');
    }

    await deleteFileFromMinIO(BUCKETS.TURNITIN, reporte.file_url);
    await new Promise((resolve, reject) => {
      deleteReporteTurnitinById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.json({ message: 'Reporte de Turnitin eliminado correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar reporte de Turnitin: ' + error.message);
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
