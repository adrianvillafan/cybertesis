import { executeQuery } from '../config/db.js';

export const insertActaSustentacion = (actaDetails, callback) => {
  const query = `
    INSERT INTO acta_sustentacion (
      id_participantes,
      presidente_tipo_documento_id,
      presidente_numero_documento,
      presidente_grado_id,
      miembro1_tipo_documento_id,
      miembro1_numero_documento,
      miembro1_grado_id,
      miembro2_tipo_documento_id,
      miembro2_numero_documento,
      miembro2_grado_id,
      miembro3_tipo_documento_id,
      miembro3_numero_documento,
      miembro3_grado_id,
      file_url,
      created_by,
      updated_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    actaDetails.id_participantes,
    actaDetails.presidente_tipo_documento_id,
    actaDetails.presidente_numero_documento,
    actaDetails.presidente_grado_id,
    actaDetails.miembro1_tipo_documento_id,
    actaDetails.miembro1_numero_documento,
    actaDetails.miembro1_grado_id,
    actaDetails.miembro2_tipo_documento_id,
    actaDetails.miembro2_numero_documento,
    actaDetails.miembro2_grado_id,
    actaDetails.miembro3_tipo_documento_id || null,
    actaDetails.miembro3_numero_documento || null,
    actaDetails.miembro3_grado_id || null,
    actaDetails.file_url,
    actaDetails.created_by,
    actaDetails.updated_by || actaDetails.created_by
  ];

  executeQuery(query, values, (err, results) => {
    if (err) {
      console.error('Error al insertar acta de sustentación:', err);
      callback(err, null);
    } else {
      callback(null, results.insertId);
    }
  });
};

export const deleteActaSustentacionById = (id, callback) => {
  const query = 'DELETE FROM acta_sustentacion WHERE id = ?';

  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar acta de sustentación:', err);
      callback(err, null);
    } else {
      callback(null, results.affectedRows);
    }
  });
};

export const getActaSustentacionById = (id, callback) => {
  const query = `
    SELECT 
      id,
      id_participantes,
      presidente_tipo_documento_id,
      presidente_numero_documento,
      presidente_grado_id,
      miembro1_tipo_documento_id,
      miembro1_numero_documento,
      miembro1_grado_id,
      miembro2_tipo_documento_id,
      miembro2_numero_documento,
      miembro2_grado_id,
      miembro3_tipo_documento_id,
      miembro3_numero_documento,
      miembro3_grado_id,
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM 
      acta_sustentacion
    WHERE 
      id = ?
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
