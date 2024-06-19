import { executeQuery } from '../config/db.js';

export const insertTesis = (tesisDetails, callback) => {
  const query = `
    INSERT INTO tesis (id_facultad, id_escuela, titulo, tipo_tesis, grado_academico, autor1, autor2, asesor1, asesor2, año, file_url, fecha_creacion, fecha_modificacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    tesisDetails.id_facultad,
    tesisDetails.id_escuela,
    tesisDetails.titulo,
    tesisDetails.tipo_tesis,
    tesisDetails.grado_academico,
    tesisDetails.autor1,
    tesisDetails.autor2,
    tesisDetails.asesor1,
    tesisDetails.asesor2,
    tesisDetails.año,
    tesisDetails.file_url,
    new Date(),
    new Date()
  ];

  executeQuery(query, values, (err, results) => {
    if (err) {
      console.error('Error al insertar tesis:', err);
      callback(err, null);
    } else {
      callback(null, results.insertId);
    }
  });
};

export const updateTesis = (id, tesisDetails, callback) => {
  const query = `
    UPDATE tesis
    SET id_facultad = ?, id_escuela = ?, titulo = ?, tipo_tesis = ?, grado_academico = ?, autor1 = ?, autor2 = ?, asesor1 = ?, asesor2 = ?, año = ?, file_url = ?, fecha_modificacion = ?
    WHERE id = ?
  `;
  const values = [
    tesisDetails.id_facultad,
    tesisDetails.id_escuela,
    tesisDetails.titulo,
    tesisDetails.tipo_tesis,
    tesisDetails.grado_academico,
    tesisDetails.autor1,
    tesisDetails.autor2,
    tesisDetails.asesor1,
    tesisDetails.asesor2,
    tesisDetails.año,
    tesisDetails.file_url,
    new Date(),
    id
  ];

  executeQuery(query, values, (err, results) => {
    if (err) {
      console.error('Error al actualizar tesis:', err);
      callback(err, null);
    } else {
      callback(null, results.affectedRows);
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
      callback(null, results.affectedRows);
    }
  });
};

export const fetchTesisById = (id, callback) => {
  const query = 'SELECT * FROM tesis WHERE id = ?';
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener tesis:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
};

export const fetchTesisByStudentId = (studentId, callback) => {
  const query = 'SELECT * FROM tesis WHERE estudiante_id = ?';
  executeQuery(query, [studentId], (err, results) => {
    if (err) {
      console.error('Error al obtener tesis:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

export const createOrFetchDocumentos = async (gradoId, estudianteId) => {
  const query = `
    SELECT * FROM documentos
    WHERE grado_id = ? AND estudiante_id = ? AND estado_id != 1
  `;
  const results = await executeQuery(query, [gradoId, estudianteId]);

  if (results.length === 0) {
    const insertQuery = `
      INSERT INTO documentos (grado_id, estudiante_id, estado_id, Fecha_Carga, usuarioCarga_id, Ultima_Modificacion)
      VALUES (?, ?, 3, NOW(), ?, NOW())
    `;
    const insertResults = await executeQuery(insertQuery, [gradoId, estudianteId, userId]);
    return { id: insertResults.insertId };
  } else {
    return results[0];
  }
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