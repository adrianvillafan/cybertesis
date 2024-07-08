import { executeQuery } from '../config/db.js';

export const insertActaSustentacion = (actaDetails, callback) => {
  const queryActa = `
    INSERT INTO acta_sustentacion (id_participantes, id_presidente, id_miembro1, id_miembro2, id_miembro3, file_url, created_by, updated_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const actaValues = [
    actaDetails.id_participantes,
    actaDetails.id_presidente,
    actaDetails.id_miembro1,
    actaDetails.id_miembro2,
    actaDetails.id_miembro3,
    actaDetails.file_url,
    actaDetails.created_by,
    actaDetails.updated_by,
    new Date(),
    new Date()
  ];

  executeQuery(queryActa, actaValues, (err, results) => {
    if (err) {
      console.error('Error al insertar acta de sustentación:', err);
      callback(err, null);
    } else {
      const actaId = results.insertId;

      const queryUpdateDocumentos = `
        UPDATE documentos SET actasust_id = ? WHERE id = ?
      `;
      executeQuery(queryUpdateDocumentos, [actaId, actaDetails.documentos_id], (err, results) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, actaId);
        }
      });
    }
  });
};


export const getActaSustentacionById = (id, callback) => {
  const query = `
    SELECT 
      a.id, 
      a.id_participantes, 
      a.id_presidente, 
      p1.identificacion_id AS presidente_dni,
      p1.nombre AS presidente_nombre,
      p1.apellido AS presidente_apellido,
      a.id_miembro1, 
      p2.identificacion_id AS miembro1_dni,
      p2.nombre AS miembro1_nombre,
      p2.apellido AS miembro1_apellido,
      a.id_miembro2, 
      p3.identificacion_id AS miembro2_dni,
      p3.nombre AS miembro2_nombre,
      p3.apellido AS miembro2_apellido,
      a.id_miembro3, 
      p4.identificacion_id AS miembro3_dni,
      p4.nombre AS miembro3_nombre,
      p4.apellido AS miembro3_apellido,
      a.file_url, 
      a.created_by, 
      a.updated_by, 
      a.created_at, 
      a.updated_at 
    FROM 
      acta_sustentacion a
    LEFT JOIN 
      personas p1 ON a.id_presidente = p1.idpersonas
    LEFT JOIN 
      personas p2 ON a.id_miembro1 = p2.idpersonas
    LEFT JOIN 
      personas p3 ON a.id_miembro2 = p3.idpersonas
    LEFT JOIN 
      personas p4 ON a.id_miembro3 = p4.idpersonas
    WHERE 
      a.id = ?
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener acta de sustentación por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
};


export const deleteActaSustentacionById = (id, callback) => {
  // Primero obtenemos el id_participantes de la acta
  const queryGetParticipantes = 'SELECT id_participantes FROM acta_sustentacion WHERE id = ?';

  executeQuery(queryGetParticipantes, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener id_participantes:', err);
      return callback(err, null);
    }

    if (results.length === 0) {
      const error = new Error('No se encontró el acta con el id proporcionado.');
      console.error('Error:', error);
      return callback(error, null);
    }

    const idParticipantes = results[0].id_participantes;

    // Luego eliminamos la participación
    const queryDeleteParticipacion = 'DELETE FROM tesis_participacion WHERE id_participantes = ?';

    executeQuery(queryDeleteParticipacion, [idParticipantes], (err, results) => {
      if (err) {
        console.error('Error al eliminar participación de acta:', err);
        return callback(err, null);
      }

      // Luego actualizamos la tabla de documentos
      const queryUpdateDocumentos = 'UPDATE documentos SET actasust_id = NULL WHERE actasust_id = ?';

      executeQuery(queryUpdateDocumentos, [id], (err, results) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          return callback(err, null);
        }

        // Finalmente, eliminamos el acta
        const queryDeleteActa = 'DELETE FROM acta_sustentacion WHERE id = ?';

        executeQuery(queryDeleteActa, [id], (err, results) => {
          if (err) {
            console.error('Error al eliminar acta:', err);
            return callback(err, null);
          }

          callback(null, results.affectedRows);
        });
      });
    });
  });
};


