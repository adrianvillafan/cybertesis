import express from 'express';
import { fetchListaAlumnos, fetchAlumnoData , fetchEscuelaUpgData } from '../queries/escuelaUpgQueries.js'
import { fetchDatosByDni } from '../queries/datosDniQueries.js';
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

export default router;


