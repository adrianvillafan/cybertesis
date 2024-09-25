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
import { insertAutoCyber, deleteAutoCyberById, getAutoCyberById } from '../queries/autoCyberQueries.js';
import { insertReporteTurnitin, deleteReporteTurnitinById, getReporteTurnitinById } from '../queries/turnitinQueries.js';
import { insertPostergacionPublicacion, getPostergacionPublicacionById, deletePostergacionPublicacionById } from '../queries/postergacionQueries.js';
import { insertConsentimientoInformado, getConsentimientoInformadoById, deleteConsentimientoInformadoById } from '../queries/consentimientoQueries.js';
import { insertEvento } from '../queries/eventosQueries.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });

const BUCKETS = {
  TESIS: process.env.BUCKET_TESIS,
  ACTAS: process.env.BUCKET_ACTAS,
  CERTIFICADOS: process.env.BUCKET_CERTIFICADOS,
  CYBER: process.env.BUCKET_AUTOCYBER,
  METADATOS: process.env.BUCKET_METADATOS,
  TURNITIN: process.env.BUCKET_TURNITIN,
  CONSENTIMIENTO: process.env.BUCKET_CONSENTIMIENTO,
  POSTERGACION: process.env.BUCKET_POSTERGACION
};

const getBucketName = (type) => BUCKETS[type];

router.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;
  const { type, actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, document_id, tipo_documento_id, action_type, event_description, is_notificacion } = req.body;

  if (!file) {
    return res.status(400).send('No se subió ningún archivo.');
  }

  try {
    const bucketName = getBucketName(type);

    if (!bucketName) {
      throw new Error('No se proporcionó un bucket válido.');
    }

    const uploadResult = await uploadFileToMinIO(file, bucketName, file.originalname);
    
    // Aquí es donde insertarías el evento después de una subida exitosa
    const eventoDetails = {
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type,
      document_id,
      tipo_documento_id,
      event_description,
      is_notificacion
    };
    
    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento:', err);
      } else {
        console.log('Evento registrado con ID:', eventId);
      }
    });

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
  const { actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, document_id, tipo_documento_id } = req.body; // Datos adicionales para el evento

  try {
    const bucketName = getBucketName(type);
    
    // Eliminar el archivo de MinIO
    await deleteFileFromMinIO(bucketName, filename);

    // Después de eliminar el archivo, registra el evento
    const eventoDetails = {
      actor_user_id: actor_user_id,                 // Usuario que realiza la acción (quién eliminó)
      actor_tipo_user_id: actor_tipo_user_id,       // Tipo de usuario que elimina el archivo
      target_user_id: target_user_id || null,       // Usuario afectado por la acción (opcional)
      target_tipo_user_id: target_tipo_user_id || null, // Tipo de usuario afectado (opcional)
      action_type: 'Eliminación de archivo',        // Acción realizada
      document_id: document_id || null,             // ID del documento relacionado (si aplica)
      tipo_documento_id: tipo_documento_id || null, // Tipo de documento (si aplica)
      event_description: `El usuario ${actor_user_id} eliminó el archivo ${filename}.`,
      is_notificacion: 1                            // Definir si se muestra como notificación (1 o 0)
    };

    // Insertar el evento
    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento de eliminación:', err);
      } else {
        console.log('Evento registrado con ID:', eventId);
      }
    });

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
        // Después de insertar la tesis, registra el evento de inserción
        const eventoDetails = {
          actor_user_id: tesisDetails.actor_user_id,  // Usuario que hizo la inserción
          actor_tipo_user_id: tesisDetails.actor_tipo_user_id,  // Tipo de usuario que hizo la inserción
          target_user_id: tesisDetails.target_user_id || null,  // Usuario target, si aplica
          target_tipo_user_id: tesisDetails.target_tipo_user_id || null,  // Tipo de usuario target, si aplica
          action_type: 'Registro de tesis',  // Acción realizada
          document_id: tesisId,  // ID del documento recién insertado
          tipo_documento_id: tesisDetails.tipo_documento_id,  // Tipo de documento
          event_description: `Se registró la tesis ${tesisDetails.titulo || 'sin título'}.`,  // Descripción del evento
          is_notificacion: tesisDetails.is_notificacion  // Si debe aparecer en notificaciones
        };

        insertEvento(eventoDetails, (err, eventId) => {
          if (err) {
            console.error('Error al registrar evento:', err);
          } else {
            console.log('Evento de registro de tesis registrado con ID:', eventId);
          }
        });

        res.json({ message: 'Tesis insertada correctamente', tesisId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar tesis: ' + error.message);
  }
});



router.delete('/tesis/delete/:id', async (req, res) => {
  const { id } = req.params;
  const {
    actor_user_id,
    actor_tipo_user_id,
    target_user_id,
    target_tipo_user_id,
    document_id,
    tipo_documento_id,
    action_type,
    event_description,
    is_notificacion
  } = req.body; // Recibe los datos enviados desde el frontend

  try {
    // Buscar la tesis para obtener el filename y eliminarla de MinIO
    const tesis = await new Promise((resolve, reject) => {
      getTesisById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!tesis) {
      return res.status(404).send('Tesis no encontrada.');
    }

    // Eliminar el archivo de MinIO
    await deleteFileFromMinIO(BUCKETS.TESIS, tesis.file_url);

    // Registrar el evento usando los datos recibidos desde el frontend
    const eventoDetails = {
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type,
      document_id: id, // Usa el document_id del frontend o el id de la tesis
      tipo_documento_id: tipo_documento_id || 1, // Tipo de documento (tesis)
      event_description,
      is_notificacion
    };

    // Insertar el evento
    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento de eliminación:', err);
      } else {
        console.log('Evento registrado con ID:', eventId);
      }
    });

    // Eliminar la tesis de la base de datos
    await new Promise((resolve, reject) => {
      deleteTesisById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    res.send({ message: 'Tesis eliminada correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar la tesis: ' + error.message);
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

  // Extraer los detalles del evento desde el frontend
  const {
    actor_user_id,
    actor_tipo_user_id,
    target_user_id,
    target_tipo_user_id,
    tipo_documento_id,  // El tipo de documento lo recibimos del frontend (opcional)
    event_description,
    is_notificacion
  } = req.body;

  console.log('actaDetails', actaDetails);

  try {
    // Insertar el acta en la base de datos
    insertActaSustentacion(actaDetails, (err, actaId) => {
      if (err) {
        res.status(500).send('Error al insertar acta de sustentación: ' + err.message);
      } else {
        // Después de insertar el acta, usamos el actaId generado como el document_id
        const eventoDetails = {
          actor_user_id,
          actor_tipo_user_id,
          target_user_id,
          target_tipo_user_id,
          action_type: 'Registro de acta de sustentación',  // Acción específica
          document_id: actaId,  // Usamos el actaId generado como el document_id
          tipo_documento_id: tipo_documento_id || 2,  // Asumimos tipo acta (ID 2), si no se pasa otro
          event_description: event_description || `Se registró el acta de sustentación con ID ${actaId}.`,
          is_notificacion
        };

        // Registrar el evento después de la inserción exitosa del acta
        insertEvento(eventoDetails, (err, eventId) => {
          if (err) {
            console.error('Error al registrar evento:', err);
          } else {
            console.log('Evento registrado con ID:', eventId);
          }
        });

        res.json({ message: 'Acta de sustentación insertada correctamente', actaId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar acta de sustentación: ' + error.message);
  }
});



router.delete('/acta/delete/:id', async (req, res) => {
  const { id } = req.params;  // ID del acta que se eliminará
  const {
    actor_user_id,
    actor_tipo_user_id,
    target_user_id,
    target_tipo_user_id,
    tipo_documento_id,
    action_type = 'Eliminación de acta de sustentación',  // Asignamos un valor por defecto
    event_description = `Se eliminó el acta de sustentación con ID ${id}.`,
    is_notificacion = 1
  } = req.body;  // Detalles del evento

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

    // Eliminar el archivo de MinIO
    await deleteFileFromMinIO(BUCKETS.ACTAS, acta.file_url);

    // Eliminar el registro de la base de datos
    await new Promise((resolve, reject) => {
      deleteActaSustentacionById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // Registrar el evento de eliminación del acta
    const eventoDetails = {
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type,
      document_id: id,  // Usamos el ID del acta como document_id
      tipo_documento_id,
      event_description,
      is_notificacion
    };

    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento de eliminación:', err);
      } else {
        console.log('Evento de eliminación registrado con ID:', eventId);
      }
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
    // Insertar los metadatos en la base de datos
    insertMetadata(metadataDetails, (err, metadataId) => {
      if (err) {
        res.status(500).send('Error al insertar metadata: ' + err.message);
      } else {
        // Detalles del evento para la inserción de metadatos
        const eventoDetails = {
          actor_user_id: metadataDetails.actor_user_id,
          actor_tipo_user_id: metadataDetails.actor_tipo_user_id,
          target_user_id: metadataDetails.target_user_id,
          target_tipo_user_id: metadataDetails.target_tipo_user_id,
          action_type: metadataDetails.action_type || 'Inserción de metadatos', // Valor predeterminado si no se proporciona
          document_id: metadataId,  // Usar el ID del metadato insertado
          tipo_documento_id: metadataDetails.tipo_documento_id || 5,  // Asignar un valor predeterminado si es necesario
          event_description: metadataDetails.event_description || `Se insertaron metadatos con ID ${metadataId}`, // Descripción del evento
          is_notificacion: metadataDetails.is_notificacion || 0  // Valor predeterminado si no se proporciona
        };

        // Registrar el evento en la base de datos
        insertEvento(eventoDetails, (err, eventId) => {
          if (err) {
            console.error('Error al registrar evento:', err);
          } else {
            console.log('Evento registrado con ID:', eventId);
          }
        });

        res.json({ message: 'Metadata insertada correctamente', metadataId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar metadata: ' + error.message);
  }
});



router.delete('/metadata/delete/:id', async (req, res) => {
  const { id } = req.params;
  const { actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, action_type, event_description, is_notificacion } = req.body; // Datos del evento

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

    // Registrar evento de eliminación de metadatos
    const eventoDetails = {
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type: action_type || 'Eliminación de metadatos', // Acción predeterminada si no se proporciona
      document_id: id,  // Asignar el ID de los metadatos eliminados como document_id
      tipo_documento_id: 5, // Tipo de documento para metadatos
      event_description: event_description || `Se eliminaron los metadatos con ID ${id}`, // Descripción predeterminada
      is_notificacion: is_notificacion || 0 // Valor predeterminado para la notificación
    };

    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento de eliminación:', err);
      } else {
        console.log('Evento de eliminación registrado con ID:', eventId);
      }
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
        // Después de la inserción, registrar el evento
        const eventoDetails = {
          actor_user_id: certificadoDetails.actor_user_id,
          actor_tipo_user_id: certificadoDetails.actor_tipo_user_id,
          target_user_id: certificadoDetails.target_user_id,
          target_tipo_user_id: certificadoDetails.target_tipo_user_id,
          action_type: 'Registro de certificado de similitud',  // Acción especificada
          document_id: certificadoId,  // Usar el ID generado del certificado
          tipo_documento_id: certificadoDetails.tipo_documento_id || 3,  // Tipo de documento para certificados
          event_description: `Se registró el certificado de similitud con ID ${certificadoId}.`,  // Descripción del evento
          is_notificacion: certificadoDetails.is_notificacion || 0  // Valor de notificación predeterminado
        };

        insertEvento(eventoDetails, (err, eventId) => {
          if (err) {
            console.error('Error al registrar evento:', err);
          } else {
            console.log('Evento registrado con ID:', eventId);
          }
        });

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
  const { actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, action_type, event_description, is_notificacion } = req.body;

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

    // Registrar el evento de eliminación usando el ID del certificado eliminado
    const eventoDetails = {
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type: action_type || 'Eliminación de certificado de similitud',
      document_id: id, // Usar el ID del certificado que se está eliminando
      tipo_documento_id: 3, 
      event_description: event_description || `Se eliminó el certificado de similitud con ID ${id}.`,
      is_notificacion: is_notificacion || 1
    };

    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento de eliminación:', err);
      } else {
        console.log('Evento de eliminación registrado con ID:', eventId);
      }
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
        // Registrar evento de inserción de AutoCyber
        const { actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, tipo_documento_id, action_type, event_description, is_notificacion } = autoCyberDetails;
        
        const eventoDetails = {
          actor_user_id,
          actor_tipo_user_id,
          target_user_id,
          target_tipo_user_id,
          action_type: action_type || 'Inserción de AutoCyber', // Acción realizada
          document_id: autoCyberId, // ID del documento recién insertado (autoCyberId)
          tipo_documento_id: tipo_documento_id || 4, // Tipo de documento (asignar según tu lógica)
          event_description: event_description || `Se insertó un AutoCyber con ID ${autoCyberId}.`,
          is_notificacion: is_notificacion || 1
        };

        insertEvento(eventoDetails, (err, eventId) => {
          if (err) {
            console.error('Error al registrar evento de inserción:', err);
          } else {
            console.log('Evento de inserción registrado con ID:', eventId);
          }
        });

        res.json({ message: 'AutoCyber insertado correctamente', autoCyberId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar AutoCyber: ' + error.message);
  }
});



router.delete('/autocyber/delete/:id', async (req, res) => {
  const { id } = req.params;
  const { actor_user_id, actor_tipo_user_id, target_user_id, target_tipo_user_id, tipo_documento_id, action_type, event_description, is_notificacion } = req.body;

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

    await deleteFileFromMinIO(BUCKETS.CYBER, autoCyber.file_url);
    await new Promise((resolve, reject) => {
      deleteAutoCyberById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // Después de eliminar, registrar el evento
    const eventoDetails = {
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type: action_type || 'Eliminación de AutoCyber', // Acción predeterminada si no se especifica
      document_id: id, // Usamos el ID del AutoCyber eliminado como document_id
      tipo_documento_id: tipo_documento_id || 4, // Tipo de documento, ajustar según la lógica
      event_description: event_description || `Se eliminó el AutoCyber con ID ${id}.`,
      is_notificacion: is_notificacion || 1
    };

    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento de eliminación:', err);
      } else {
        console.log('Evento de eliminación registrado con ID:', eventId);
      }
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
  const {
    actor_user_id,
    actor_tipo_user_id,
    target_user_id,
    target_tipo_user_id,
    tipo_documento_id,
    action_type,
    event_description,
    is_notificacion
  } = req.body;

  console.log('reporteDetails', reporteDetails);
  try {
    insertReporteTurnitin(reporteDetails, (err, reporteId) => {
      if (err) {
        res.status(500).send('Error al insertar reporte de Turnitin: ' + err.message);
      } else {
        // Registrar el evento de inserción del reporte
        const eventoDetails = {
          actor_user_id,
          actor_tipo_user_id,
          target_user_id,
          target_tipo_user_id,
          action_type: action_type || 'Registro de reporte Turnitin', // Acción predeterminada
          document_id: reporteId, // Usar el ID recién generado
          tipo_documento_id: tipo_documento_id || 6, // Tipo de documento
          event_description: event_description || `Se registró el reporte Turnitin con ID ${reporteId}.`,
          is_notificacion
        };

        insertEvento(eventoDetails, (err, eventId) => {
          if (err) {
            console.error('Error al registrar evento de inserción:', err);
          } else {
            console.log('Evento registrado con ID:', eventId);
          }
        });

        res.json({ message: 'Reporte de Turnitin insertado correctamente', reporteId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar reporte de Turnitin: ' + error.message);
  }
});




router.delete('/reporte-turnitin/delete/:id', async (req, res) => {
  const { id } = req.params;
  const {
    actor_user_id,
    actor_tipo_user_id,
    target_user_id,
    target_tipo_user_id,
    tipo_documento_id,
    action_type,
    event_description,
    is_notificacion
  } = req.body;

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

    // Registrar el evento de eliminación
    const eventoDetails = {
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type: action_type || 'Eliminación de reporte Turnitin', // Acción predeterminada
      document_id: id, // Usar el ID del reporte que se está eliminando
      tipo_documento_id: tipo_documento_id || 6, // Tipo de documento
      event_description: event_description || `Se eliminó el reporte Turnitin con ID ${id}.`,
      is_notificacion
    };

    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento de eliminación:', err);
      } else {
        console.log('Evento registrado con ID:', eventId);
      }
    });

    res.json({ message: 'Reporte de Turnitin eliminado correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar reporte de Turnitin: ' + error.message);
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



// ------------------ Postergación Publicación Routes ------------------

// Ruta para insertar Postergación de Publicación
router.post('/postergacion/insert', async (req, res) => {
  const postergacionDetails = req.body;
  const {
    actor_user_id,
    actor_tipo_user_id,
    target_user_id,
    target_tipo_user_id,
    action_type,
    tipo_documento_id,
    event_description,
    is_notificacion
  } = postergacionDetails;

  console.log('postergacionDetails', postergacionDetails);
  try {
    insertPostergacionPublicacion(postergacionDetails, (err, postergacionId) => {
      if (err) {
        res.status(500).send('Error al insertar postergación de publicación: ' + err.message);
      } else {
        // Registrar el evento de inserción
        const eventoDetails = {
          actor_user_id,
          actor_tipo_user_id,
          target_user_id,
          target_tipo_user_id,
          action_type: action_type || 'Registro de postergación de publicación', // Acción predeterminada
          document_id: postergacionId, // Usar el ID generado de la postergación
          tipo_documento_id: tipo_documento_id || 8, // Tipo de documento
          event_description: event_description || `Se registró la postergación de publicación con ID ${postergacionId}.`,
          is_notificacion
        };

        insertEvento(eventoDetails, (err, eventId) => {
          if (err) {
            console.error('Error al registrar evento:', err);
          } else {
            console.log('Evento registrado con ID:', eventId);
          }
        });

        res.json({ message: 'Postergación de publicación insertada correctamente', postergacionId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar postergación de publicación: ' + error.message);
  }
});


// Ruta para eliminar Postergación de Publicación
router.delete('/postergacion/delete/:id', async (req, res) => {
  const { id } = req.params;
  const {
    actor_user_id,
    actor_tipo_user_id,
    target_user_id,
    target_tipo_user_id,
    action_type,
    tipo_documento_id,
    event_description,
    is_notificacion
  } = req.body;

  try {
    const postergacion = await new Promise((resolve, reject) => {
      getPostergacionPublicacionById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!postergacion) {
      return res.status(404).send('Postergación de publicación no encontrada.');
    }

    await deleteFileFromMinIO(BUCKETS.POSTERGACION, postergacion.file_url);
    await new Promise((resolve, reject) => {
      deletePostergacionPublicacionById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // Registrar el evento de eliminación
    const eventoDetails = {
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type: action_type || 'Eliminación de postergación de publicación', // Acción predeterminada
      document_id: id, // Usar el ID de la postergación que se está eliminando
      tipo_documento_id: tipo_documento_id || 8, // Tipo de documento
      event_description: event_description || `Se eliminó la postergación de publicación con ID ${id}.`,
      is_notificacion
    };

    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento de eliminación:', err);
      } else {
        console.log('Evento registrado con ID:', eventId);
      }
    });

    res.json({ message: 'Postergación de publicación eliminada correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar postergación de publicación: ' + error.message);
  }
});


router.get('/postergacion/:id', async (req, res) => {
  const { id } = req.params;
  getPostergacionPublicacionById(id, async (err, postergacion) => {
    if (err) {
      res.status(500).send('Error al obtener detalles de la postergación de publicación: ' + err.message);
    } else if (!postergacion) {
      res.status(404).send('Postergación de publicación no encontrada.');
    } else {
      try {
        const fileUrl = await getDownloadUrlFromMinIO(BUCKETS.POSTERGACION, postergacion.file_url);
        postergacion.file_url = fileUrl;
        res.json(postergacion);
      } catch (fileError) {
        res.status(500).send('Error al obtener la URL del archivo: ' + fileError.message);
      }
    }
  });
});


// ------------------ Consentimiento Informado Routes ------------------

router.post('/consentimiento/insert', async (req, res) => {
  const consentimientoDetails = req.body;
  const {
    actor_user_id,
    actor_tipo_user_id,
    target_user_id,
    target_tipo_user_id,
    action_type,
    tipo_documento_id,
    event_description,
    is_notificacion
  } = consentimientoDetails;

  console.log('consentimientoDetails', consentimientoDetails);
  
  try {
    // Insertar el consentimiento en la base de datos
    insertConsentimientoInformado(consentimientoDetails, (err, consentimientoId) => {
      if (err) {
        res.status(500).send('Error al insertar consentimiento informado: ' + err.message);
      } else {
        // Registrar el evento de inserción
        const eventoDetails = {
          actor_user_id,
          actor_tipo_user_id,
          target_user_id,
          target_tipo_user_id,
          action_type: action_type || 'Registro de consentimiento informado', // Acción predeterminada
          document_id: consentimientoId, // Usar el ID generado del consentimiento
          tipo_documento_id: tipo_documento_id || 7, // Tipo de documento
          event_description: event_description || `Se registró el consentimiento informado con ID ${consentimientoId}.`,
          is_notificacion
        };

        insertEvento(eventoDetails, (err, eventId) => {
          if (err) {
            console.error('Error al registrar evento de inserción:', err);
          } else {
            console.log('Evento de inserción registrado con ID:', eventId);
          }
        });

        res.json({ message: 'Consentimiento informado insertado correctamente', consentimientoId });
      }
    });
  } catch (error) {
    res.status(500).send('Error al insertar consentimiento informado: ' + error.message);
  }
});




router.delete('/consentimiento/delete/:id', async (req, res) => {
  const { id } = req.params;
  const {
    actor_user_id,
    actor_tipo_user_id,
    target_user_id,
    target_tipo_user_id,
    action_type,
    tipo_documento_id,
    event_description,
    is_notificacion
  } = req.body;

  try {
    const consentimiento = await new Promise((resolve, reject) => {
      getConsentimientoInformadoById(id, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!consentimiento) {
      return res.status(404).send('Consentimiento informado no encontrado.');
    }

    // Eliminar archivo de MinIO
    await deleteFileFromMinIO(BUCKETS.CONSENTIMIENTO, consentimiento.file_url);

    // Eliminar consentimiento de la base de datos
    await new Promise((resolve, reject) => {
      deleteConsentimientoInformadoById(id, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    // Registrar el evento de eliminación
    const eventoDetails = {
      actor_user_id,
      actor_tipo_user_id,
      target_user_id,
      target_tipo_user_id,
      action_type: action_type || 'Eliminación de consentimiento informado', // Acción predeterminada
      document_id: id, // Usar el ID del consentimiento eliminado
      tipo_documento_id: tipo_documento_id || 7, // Tipo de documento
      event_description: event_description || `Se eliminó el consentimiento informado con ID ${id}.`,
      is_notificacion
    };

    insertEvento(eventoDetails, (err, eventId) => {
      if (err) {
        console.error('Error al registrar evento de eliminación:', err);
      } else {
        console.log('Evento registrado con ID:', eventId);
      }
    });

    res.json({ message: 'Consentimiento informado eliminado correctamente' });
  } catch (error) {
    res.status(500).send('Error al eliminar consentimiento informado: ' + error.message);
  }
});


router.get('/consentimiento/:id', async (req, res) => {
  const { id } = req.params;
  getConsentimientoInformadoById(id, async (err, consentimiento) => {
    if (err) {
      res.status(500).send('Error al obtener detalles de consentimiento informado: ' + err.message);
    } else if (!consentimiento) {
      res.status(404).send('Consentimiento informado no encontrado.');
    } else {
      try {
        const fileUrl = await getDownloadUrlFromMinIO(BUCKETS.CONSENTIMIENTO, consentimiento.file_url);
        consentimiento.file_url = fileUrl;
        res.json(consentimiento);
      } catch (fileError) {
        res.status(500).send('Error al obtener la URL del archivo: ' + fileError.message);
      }
    }
  });
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
