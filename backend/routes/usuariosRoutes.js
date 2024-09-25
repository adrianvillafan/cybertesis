import express from 'express';
import { fetchListaAlumnos, fetchAlumnoData , fetchEscuelaUpgData,fetchListaAlumnosByProgramaId, fetchProgramasByFacultadId } from '../queries/escuelaUpgQueries.js'
import { fetchDatosByDni } from '../queries/datosDniQueries.js';
import {
  getEventosNoLeidosByTargetUserId,
  getEventosNoLeidosByActorUserId,
  getEventosByTargetUserId,
  getEventosByActorUserId,
  getEventosByDocumentId,
  markEventoAsRead
} from '../queries/eventosQueries.js'; // Importar las consultas de eventos

import fetch from 'node-fetch';

const router = express.Router();

router.get('/alumnosunidades/:escuelaId/:gradoId', (req, res) => {
  const { escuelaId, gradoId } = req.params;
  fetchListaAlumnos({ escuelaId, gradoId }, (error, alumnado) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener el listado de alumnos de la unidad", error: error.toString() });
    } else {
      res.json(alumnado);
    }
  });
});

router.get('/alumnosprogramas/:programaId', (req, res) => {
  const { programaId } = req.params;
  fetchListaAlumnosByProgramaId(programaId, (error, alumnado) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener el listado de alumnos del programa", error: error.toString() });
    } else {
      res.json(alumnado);
    }
  });
});

router.get('/datosalumno/:studentId', (req, res) => {
  const { studentId } = req.params;
  fetchAlumnoData(studentId, (error, alumnoData) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener los datos del alumno", error: error.toString() });
    } else {
      res.json(alumnoData);
    }
  });
});

router.get('/programas/:facultadId', (req, res) => {
  const { facultadId } = req.params;
  fetchProgramasByFacultadId(facultadId, (error, programas) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener la lista de programas de la facultad", error: error.toString() });
    } else {
      res.json(programas);
    }
  });
});

router.get('/datosunidades/:userId', (req, res) => {
  const { userId } = req.params;
  fetchEscuelaUpgData(userId, (error, escuelaData) => {
    if (error) {
      res.status(500).send({ message: "Error al recuperar los datos", error: error.toString() });
    } else {
      res.json(escuelaData);
    }
  });
});

router.get('/datospersona/:tipoIdentificacionId/:identificacionId', async (req, res) => {
  const { tipoIdentificacionId, identificacionId } = req.params;

  fetchDatosByDni(tipoIdentificacionId, identificacionId, (error, datos) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener los datos", error: error.toString() });
    } else {
      res.json(datos);
    }
  });
});



// Ruta para obtener datos de ORCID
router.get('/datosorcid/:orcid', async (req, res) => {
  const { orcid } = req.params;

  async function fetchDatosOrcid(orcid) {
    try {
      console.log(`Obteniendo datos de ORCID (BACKEND): ${orcid}`);
      const response = await fetch(`https://pub.orcid.org/v3.0/${orcid}/person`);
      if (!response.ok) {
        throw new Error('No se pudo obtener los datos del ORCID');
      }
      const xml = await response.text();

      // Usar expresiones regulares para extraer los datos necesarios
      const givenNamesMatch = xml.match(/<personal-details:given-names[^>]*>([^<]*)<\/personal-details:given-names>/);
      const familyNameMatch = xml.match(/<personal-details:family-name[^>]*>([^<]*)<\/personal-details:family-name>/);

      const givenNames = givenNamesMatch ? givenNamesMatch[1] : '';
      const familyName = familyNameMatch ? familyNameMatch[1] : '';

      return { nombre: givenNames, apellido: familyName };
    } catch (error) {
      console.error('Error al obtener datos del ORCID:', error);
      throw error;
    }
  }

  try {
    const datos = await fetchDatosOrcid(orcid);
    res.json(datos);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener datos del ORCID", error: error.toString() });
  }
});


// EVENTOS

// Ruta para obtener eventos no leídos donde el usuario es el target
router.get('/eventos/target/no-leidos/:userId/:tipoUserId', (req, res) => {
  const { userId, tipoUserId } = req.params;
  getEventosNoLeidosByTargetUserId(userId, tipoUserId, (error, eventos) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener eventos no leídos para el target", error: error.toString() });
    } else {
      res.json(eventos);
    }
  });
});

// Ruta para obtener eventos no leídos donde el usuario es el actor
router.get('/eventos/actor/no-leidos/:userId/:tipoUserId', (req, res) => {
  const { userId, tipoUserId } = req.params;
  getEventosNoLeidosByActorUserId(userId, tipoUserId, (error, eventos) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener eventos no leídos para el actor", error: error.toString() });
    } else {
      res.json(eventos);
    }
  });
});

// Ruta para obtener todos los eventos donde el usuario es el target
router.get('/eventos/target/:userId/:tipoUserId', (req, res) => {
  const { userId, tipoUserId } = req.params;
  getEventosByTargetUserId(userId, tipoUserId, (error, eventos) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener eventos para el target", error: error.toString() });
    } else {
      res.json(eventos);
    }
  });
});

// Ruta para obtener todos los eventos donde el usuario es el actor
router.get('/eventos/actor/:userId/:tipoUserId', (req, res) => {
  const { userId, tipoUserId } = req.params;
  getEventosByActorUserId(userId, tipoUserId, (error, eventos) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener eventos para el actor", error: error.toString() });
    } else {
      res.json(eventos);
    }
  });
});

// Ruta para obtener eventos relacionados con un documento específico
router.get('/eventos/documento/:documentId/:actorTipoUserId/:targetTipoUserId', (req, res) => {
  const { documentId, actorTipoUserId, targetTipoUserId } = req.params;
  getEventosByDocumentId(documentId, actorTipoUserId, targetTipoUserId, (error, eventos) => {
    if (error) {
      res.status(500).send({ message: "Error al obtener eventos para el documento", error: error.toString() });
    } else {
      res.json(eventos);
    }
  });
});

// Ruta para marcar un evento como leído
router.put('/eventos/read/:eventId', (req, res) => {
  const { eventId } = req.params;
  markEventoAsRead(eventId, (error, result) => {
    if (error) {
      res.status(500).send({ message: "Error al marcar el evento como leído", error: error.toString() });
    } else {
      res.json({ message: `Evento con ID ${eventId} marcado como leído`, rowsAffected: result });
    }
  });
});

export default router;


