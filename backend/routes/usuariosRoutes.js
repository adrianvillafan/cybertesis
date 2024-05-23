import express from 'express';
import { fetchAlumnosData, fetchEscuelaUpgData } from '../queries/escuelaUpgQueries.js'
import { fetchDatosByDni } from '../queries/datosDniQueries.js';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/alumnosunidades/:escuelaId/:gradoId', (req, res) => {
  const { escuelaId , gradoId } = req.params;
  fetchAlumnosData({ escuelaId , gradoId }, (error, alumnado) => {
    if (error) {
      res.status(500).send({ message: "Error al recuperar los documentos", error: error.toString() });
    } else {
      res.json(alumnado);
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

router.get('/datospersona/:dni', async (req, res) => {
  const { dni } = req.params;
  fetchDatosByDni(dni, async (error, datos) => {
      if (error) {
          try {
              const response = await fetch(`https://dni-api.onrender.com/obtener_datos_dni/?dni=${dni}`);
              if (!response.ok) {
                  throw new Error('No se pudo obtener los datos del servicio externo');
              }
              const externalData = await response.json();
              const formattedData = {
                  dni: dni,
                  nombre: externalData.nombres,
                  apellido: `${externalData.apellido_paterno} ${externalData.apellido_materno}`,
                  telefono: null,
                  email: null,
                  orcid: null
              };
              res.json(formattedData);
          } catch (err) {
              console.error('Error al obtener datos del servicio externo:', err);
              res.status(500).send({ message: "Error al obtener datos del servicio externo", error: err.toString() });
          }
      } else {
          res.json(datos);
      }
  });
});

export default router;


