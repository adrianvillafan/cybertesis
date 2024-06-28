import { executeQuery } from '../config/db.js';

export const insertTesis = (tesisDetails, callback) => {
  const queryTesis = `
    INSERT INTO tesis (id_facultad, id_escuela, titulo, tipo_tesis, grado_academico, año, file_url, fecha_creacion, fecha_modificacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const tesisValues = [
    tesisDetails.id_facultad,
    tesisDetails.id_escuela,
    tesisDetails.titulo,
    tesisDetails.tipo_tesis,
    tesisDetails.grado_academico,
    tesisDetails.año,
    tesisDetails.file_url,
    new Date(),
    new Date()
  ];

  executeQuery(queryTesis, tesisValues, (err, results) => {
    if (err) {
      console.error('Error al insertar tesis:', err);
      callback(err, null);
    } else {
      const tesisId = results.insertId;

      const queryParticipacion = `
        INSERT INTO tesis_participacion (id_autor1, id_autor2, id_asesor1, id_asesor2)
        VALUES (?, ?, ?, ?)
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
          const idParticipantes = results.insertId;

          const queryUpdateTesis = `
            UPDATE tesis SET id_participantes = ? WHERE id = ?
          `;
          executeQuery(queryUpdateTesis, [idParticipantes, tesisId], (err, results) => {
            if (err) {
              console.error('Error al actualizar tesis con id_participantes:', err);
              callback(err, null);
            } else {
              callback(null, tesisId);
            }
          });
        }
      });
    }
  });
};

export const updateTesis = (id, tesisDetails, callback) => {
  const queryTesis = `
    UPDATE tesis
    SET id_facultad = ?, id_escuela = ?, titulo = ?, tipo_tesis = ?, grado_academico = ?, año = ?, file_url = ?, fecha_modificacion = ?
    WHERE id = ?
  `;
  const tesisValues = [
    tesisDetails.id_facultad,
    tesisDetails.id_escuela,
    tesisDetails.titulo,
    tesisDetails.tipo_tesis,
    tesisDetails.grado_academico,
    tesisDetails.año,
    tesisDetails.file_url,
    new Date(),
    id
  ];

  executeQuery(queryTesis, tesisValues, (err, results) => {
    if (err) {
      console.error('Error al actualizar tesis:', err);
      callback(err, null);
    } else {
      const queryParticipacion = `
        UPDATE tesis_participacion
        SET id_autor1 = ?, id_autor2 = ?, id_asesor1 = ?, id_asesor2 = ?
        WHERE id = (SELECT id_participantes FROM tesis WHERE id = ?)
      `;
      const participacionValues = [
        tesisDetails.autor1,
        tesisDetails.autor2 || null,
        tesisDetails.asesor1,
        tesisDetails.asesor2 || null,
        id
      ];

      executeQuery(queryParticipacion, participacionValues, (err, results) => {
        if (err) {
          console.error('Error al actualizar participación de tesis:', err);
          callback(err, null);
        } else {
          callback(null, results.affectedRows);
        }
      });
    }
  });
};

export const deleteTesisById = (id, callback) => {
  const query = 'DELETE FROM tesis WHERE id = ?';
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar tesis:', err);
      callback(err, null);
    } else {
      const queryDeleteParticipacion = 'DELETE FROM tesis_participacion WHERE id = (SELECT id_participantes FROM tesis WHERE id = ?)';
      executeQuery(queryDeleteParticipacion, [id], (err, results) => {
        if (err) {
          console.error('Error al eliminar participación de tesis:', err);
          callback(err, null);
        } else {
          callback(null, results.affectedRows);
        }
      });
    }
  });
};

export const getTesisById = (id, callback) => {
  const query = 'SELECT * FROM tesis WHERE id = ?';
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener tesis por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
};

export const getTesisByStudentId = (studentId, callback) => {
  const query = 'SELECT * FROM tesis WHERE estudiante_id = ?';
  executeQuery(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error al obtener tesis por ID de estudiante:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

export const updateDocumentosEstado = (estudianteId) => {
  const query = `
    UPDATE documentos
    SET estado_id = 1
    WHERE estudiante_id = ? AND estado_id != 1
  `;
  return new Promise((resolve, reject) => {
    executeQuery(query, [estudianteId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
