import { executeQuery } from '../config/db.js';

export const insertTesis = (tesisDetails, callback) => {
  const queryTesis = `
    INSERT INTO tesis (id_facultad, id_escuela, titulo, tipo_tesis, grado_academico, año, file_url, fecha_creacion, fecha_modificacion)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id_tesis
  `;
  const tesisValues = [
    tesisDetails.facultad_id,
    tesisDetails.escuela_id,
    tesisDetails.titulo,
    tesisDetails.tipo,
    tesisDetails.grado,
    tesisDetails.year,
    tesisDetails.file_url,
    new Date(),
    new Date()
  ];

  executeQuery(queryTesis, tesisValues, (err, results) => {
    if (err) {
      console.error('Error al insertar tesis:', err);
      callback(err, null);
    } else {
      const tesisId = results[0].id_tesis;  // Ya no es necesario usar results.rows

      const queryParticipacion = `
        INSERT INTO tesis_participacion (id_autor1, id_autor2, id_asesor1, id_asesor2)
        VALUES ($1, $2, $3, $4)
        RETURNING id_participantes
      `;
      const participacionValues = [
        tesisDetails.autor1,
        tesisDetails.autor2 || null,
        tesisDetails.asesor1,
        tesisDetails.asesor2 || null
      ];

      executeQuery(queryParticipacion, participacionValues, (err, results) => {
        if (err) {
          console.error('Error al insertar participación de tesis:', err);
          callback(err, null);
        } else {
          const idParticipantes = results[0].id_participantes;

          const queryUpdateTesis = `
            UPDATE tesis SET id_participantes = $1 WHERE id_tesis = $2
          `;
          executeQuery(queryUpdateTesis, [idParticipantes, tesisId], (err) => {
            if (err) {
              console.error('Error al actualizar tesis con id_participantes:', err);
              callback(err, null);
            } else {
              const queryUpdateDocumentos = `
                UPDATE documentos SET tesis_id = $1 WHERE id = $2
              `;
              executeQuery(queryUpdateDocumentos, [tesisId, tesisDetails.documentos_id], (err) => {
                if (err) {
                  console.error('Error al actualizar documentos:', err);
                  callback(err, null);
                } else {
                  callback(null, tesisId);
                }
              });
            }
          });
        }
      });
    }
  });
};


export const deleteTesisById = (id, callback) => {
  const queryGetParticipantes = 'SELECT id_participantes FROM tesis WHERE id_tesis = $1';

  executeQuery(queryGetParticipantes, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener id_participantes:', err);
      return callback(err, null);
    }

    if (results.length === 0) {
      const error = new Error('No se encontró la tesis con el id proporcionado.');
      console.error('Error:', error);
      return callback(error, null);
    }

    const idParticipantes = results[0].id_participantes;

    const queryDeleteMetadatos = 'DELETE FROM metadata WHERE id_participantes = $1';

    executeQuery(queryDeleteMetadatos, [idParticipantes], (err) => {
      if (err) {
        console.error('Error al eliminar metadatos:', err);
        return callback(err, null);
      }

      const queryDeleteParticipacion = 'DELETE FROM tesis_participacion WHERE id_participantes = $1';

      executeQuery(queryDeleteParticipacion, [idParticipantes], (err) => {
        if (err) {
          console.error('Error al eliminar participación de tesis:', err);
          return callback(err, null);
        }

        const queryUpdateDocumentosTesis = 'UPDATE documentos SET tesis_id = NULL WHERE tesis_id = $1';

        executeQuery(queryUpdateDocumentosTesis, [id], (err) => {
          if (err) {
            console.error('Error al actualizar documentos (tesis_id):', err);
            return callback(err, null);
          }

          const queryDeleteActaSustentacion = 'DELETE FROM acta_sustentacion WHERE id_participantes = $1';

          executeQuery(queryDeleteActaSustentacion, [idParticipantes], (err) => {
            if (err) {
              console.error('Error al eliminar acta de sustentación:', err);
              return callback(err, null);
            }

            const queryUpdateDocumentos = 'UPDATE documentos SET actasust_id = NULL, metadatos_id = NULL WHERE actasust_id = $1 OR metadatos_id = $1';

            executeQuery(queryUpdateDocumentos, [idParticipantes], (err) => {
              if (err) {
                console.error('Error al actualizar documentos (actasust_id, metadatos_id):', err);
                return callback(err, null);
              }

              const queryDeleteTesis = 'DELETE FROM tesis WHERE id_tesis = $1';

              executeQuery(queryDeleteTesis, [id], (err, results) => {
                if (err) {
                  console.error('Error al eliminar tesis:', err);
                  return callback(err, null);
                }

                callback(null, results.rowCount);
              });
            });
          });
        });
      });
    });
  });
};



export const getTesisById = (id, callback) => {
  const query = `
    SELECT 
      t.id_tesis,
      t.id_facultad,
      f.nombre AS facultad_nombre,
      t.id_escuela,
      e.nombre AS escuela_nombre,
      t.titulo,
      t.tipo_tesis,
      t.grado_academico,
      t.año,
      t.file_url,
      t.fecha_creacion,
      t.fecha_modificacion,
      t.id_participantes,
      tp.id_autor1,
      p1.identificacion_id AS autor1_dni,
      tp.id_autor2,
      p2.identificacion_id AS autor2_dni,
      tp.id_asesor1,
      p3.identificacion_id AS asesor1_dni,
      tp.id_asesor2,
      p4.identificacion_id AS asesor2_dni
    FROM 
      tesis t
    LEFT JOIN 
      tesis_participacion tp ON t.id_participantes = tp.id_participantes
    LEFT JOIN 
      facultad f ON t.id_facultad = f.id
    LEFT JOIN 
      escuela e ON t.id_escuela = e.id
    LEFT JOIN 
      personas p1 ON tp.id_autor1 = p1.idpersonas
    LEFT JOIN 
      personas p2 ON tp.id_autor2 = p2.idpersonas
    LEFT JOIN 
      personas p3 ON tp.id_asesor1 = p3.idpersonas
    LEFT JOIN 
      personas p4 ON tp.id_asesor2 = p4.idpersonas
    WHERE 
      t.id_tesis = $1
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener tesis por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);  // Ya no es necesario usar results.rows[0]
    }
  });
};


export const getTesisByStudentId = (studentId, callback) => {
  const query = 'SELECT * FROM tesis WHERE estudiante_id = $1';
  executeQuery(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error al obtener tesis por ID de estudiante:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Ya no es necesario usar results.rows
    }
  });
};


export const updateDocumentosEstado = (estudianteId) => {
  const query = `
    UPDATE documentos
    SET estado_id = 1
    WHERE estudiante_id = $1 AND estado_id != 1
  `;
  return new Promise((resolve, reject) => {
    executeQuery(query, [estudianteId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.rowCount);  // Ya no es necesario usar results.rows
      }
    });
  });
};


export const updateDocumentos = (documentId, tesisId, callback) => {
  const query = `
    UPDATE documentos
    SET tesis_id = $1
    WHERE id = $2
  `;
  executeQuery(query, [tesisId, documentId], (err, results) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      callback(err, null);
    } else {
      callback(null, results.rowCount);  // Ya no es necesario usar results.rows
    }
  });
};
