import { executeQuery } from '../config/db.js';

export const insertMetadata = (metadataDetails, callback) => {
  const queryMetadata = `
    INSERT INTO metadata (
      id_participantes,
      linea_investigacion_id,
      grupo_investigacion_id,
      agencia_financiamiento,
      pais,
      departamento,
      provincia,
      distrito,
      latitud,
      longitud,
      ano_inicio,
      ano_fin,
      id_disciplina_1,
      id_disciplina_2,
      id_disciplina_3,
      file_url,
      created_by,
      updated_by,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const metadataValues = [
    metadataDetails.id_participantes,
    metadataDetails.linea_investigacion_id,
    metadataDetails.grupo_investigacion_id,
    metadataDetails.agencia_financiamiento,
    metadataDetails.pais,
    metadataDetails.departamento,
    metadataDetails.provincia,
    metadataDetails.distrito,
    metadataDetails.latitud,
    metadataDetails.longitud,
    metadataDetails.ano_inicio,
    metadataDetails.ano_fin,
    metadataDetails.id_disciplina_1,
    metadataDetails.id_disciplina_2,
    metadataDetails.id_disciplina_3,
    metadataDetails.file_url,  // Añadido el campo file_url
    metadataDetails.created_by,
    metadataDetails.updated_by,
    new Date(),
    new Date()
  ];

  executeQuery(queryMetadata, metadataValues, (err, results) => {
    if (err) {
      console.error('Error al insertar metadata:', err);
      callback(err, null);
    } else {
      const metadataId = results.insertId;

      const queryUpdateDocumentos = `
        UPDATE documentos SET metadatos_id = ? WHERE id = ?
      `;
      executeQuery(queryUpdateDocumentos, [metadataId, metadataDetails.documentos_id], (err, results) => {
        if (err) {
          console.error('Error al actualizar documentos:', err);
          callback(err, null);
        } else {
          callback(null, metadataId);
        }
      });
    }
  });
};

// Obtener un registro de metadata por ID
export const getMetadataById = (id, callback) => {
  const query = `
    SELECT 
      id,
      id_participantes,
      linea_investigacion_id,
      grupo_investigacion_id,
      agencia_financiamiento,
      pais,
      departamento,
      provincia,
      distrito,
      latitud,
      longitud,
      ano_inicio,
      ano_fin,
      id_disciplina_1,
      id_disciplina_2,
      id_disciplina_3,
      file_url,  // Añadido el campo file_url
      created_by,
      updated_by,
      created_at,
      updated_at
    FROM
      metadata
    WHERE
      id = ?
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener metadata por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);
    }
  });
};

// Eliminar un registro de metadata por ID
export const deleteMetadataById = (id, callback) => {
  // Actualizamos la tabla de documentos
  const queryUpdateDocumentos = 'UPDATE documentos SET metadata_id = NULL WHERE metadata_id = ?';

  executeQuery(queryUpdateDocumentos, [id], (err, results) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    // Finalmente, eliminamos el metadata
    const queryDeleteMetadata = 'DELETE FROM metadata WHERE id = ?';

    executeQuery(queryDeleteMetadata, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar metadata:', err);
        return callback(err, null);
      }

      callback(null, results.affectedRows);
    });
  });
};

export const getLineasInvestigacion = (callback) => {
    const query = 'SELECT id, linea FROM lineas_investigacion';
  
    executeQuery(query, [], (err, results) => {
      if (err) {
        console.error('Error al obtener líneas de investigación:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  };
  
  export const getGruposInvestigacion = (facultadId, callback) => {
    const query = 'SELECT id, grupo_nombre, grupo_nombre_corto FROM grupos_investigacion WHERE facultad_id = ?';
  
    executeQuery(query, [facultadId], (err, results) => {
      if (err) {
        console.error('Error al obtener grupos de investigación:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  };
  
  export const getDisciplinasOCDE = (callback) => {
    const query = 'SELECT id, disciplina FROM disciplina';
  
    executeQuery(query, [], (err, results) => {
      if (err) {
        console.error('Error al obtener disciplinas OCDE:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  };
