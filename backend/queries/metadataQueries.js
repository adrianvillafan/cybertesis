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
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    RETURNING id
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
    metadataDetails.file_url,
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
      const metadataId = results[0].id; // Ya no es necesario usar results.rows

      const queryUpdateDocumentos = `
        UPDATE documentos SET metadatos_id = $1 WHERE id = $2
      `;
      executeQuery(queryUpdateDocumentos, [metadataId, metadataDetails.documentos_id], (err, updateResults) => {
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

export const getMetadataById = (id, callback) => {
  const query = `
    SELECT 
      m.id,
      m.id_participantes,
      CONCAT(li.codigo, ' ', li.linea) AS linea_investigacion,
      CONCAT(gi.grupo_nombre, ' (', gi.grupo_nombre_corto, ')') AS grupo_investigacion,
      m.agencia_financiamiento,
      m.pais,
      m.departamento,
      m.provincia,
      m.distrito,
      m.latitud,
      m.longitud,
      m.ano_inicio,
      m.ano_fin,
      do1.prefLabel_es AS disciplina_1,
      do1.uri AS uri_disciplina_1,
      do2.prefLabel_es AS disciplina_2,
      do2.uri AS uri_disciplina_2,
      do3.prefLabel_es AS disciplina_3,
      do3.uri AS uri_disciplina_3,
      m.file_url,
      m.created_by,
      m.updated_by,
      m.created_at,
      m.updated_at
    FROM
      metadata m
    LEFT JOIN lineas li ON m.linea_investigacion_id = li.linea_id
    LEFT JOIN grupos_investigacion gi ON m.grupo_investigacion_id = gi.id
    LEFT JOIN ocde do1 ON m.id_disciplina_1 = do1.id
    LEFT JOIN ocde do2 ON m.id_disciplina_2 = do2.id
    LEFT JOIN ocde do3 ON m.id_disciplina_3 = do3.id
    WHERE
      m.id = $1
  `;
  executeQuery(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener metadata por ID:', err);
      callback(err, null);
    } else {
      callback(null, results[0]);  // Ya no es necesario usar results.rows[0]
    }
  });
};


export const deleteMetadataById = (id, callback) => {
  // Actualizamos la tabla de documentos
  const queryUpdateDocumentos = 'UPDATE documentos SET metadatos_id = NULL WHERE metadatos_id = $1';

  executeQuery(queryUpdateDocumentos, [id], (err, results) => {
    if (err) {
      console.error('Error al actualizar documentos:', err);
      return callback(err, null);
    }

    // Finalmente, eliminamos el metadata
    const queryDeleteMetadata = 'DELETE FROM metadata WHERE id = $1';

    executeQuery(queryDeleteMetadata, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar metadata:', err);
        return callback(err, null);
      }

      callback(null, results.rowCount);  // Ya no es necesario usar results.rowCount para obtener el número de filas afectadas
    });
  });
};

export const getLineasInvestigacion = (facultadId, callback) => {
  const query = `
    SELECT 
      linea_id AS id, 
      CONCAT(codigo, ' ', linea) AS linea 
    FROM 
      lineas 
    WHERE 
      (level = 2 AND facultad_id = $1) 
      OR 
      (level = 2 AND facultad_id IS NULL)
  `;
  
  executeQuery(query, [facultadId], (err, results) => {
    if (err) {
      console.error('Error al obtener líneas de investigación:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Ya no es necesario usar results.rows
    }
  });
};

export const getGruposInvestigacion = (facultadId, callback) => {
  const query = 'SELECT id, grupo_nombre, grupo_nombre_corto FROM grupos_investigacion WHERE facultad_id = $1';
  
  executeQuery(query, [facultadId], (err, results) => {
    if (err) {
      console.error('Error al obtener grupos de investigación:', err);
      callback(err, null);
    } else {
      callback(null, results);  // Ya no es necesario usar results.rows
    }
  });
};


export const getDisciplinasOCDE = (callback) => {
  const query = `
    SELECT id, preflabel_es, uri 
    FROM ocde 
    WHERE indicador IS NULL
  `;
  
  executeQuery(query, [], (err, results) => {
    if (err) {
      console.error('Error al obtener disciplinas OCDE:', err);
      callback(err, null);
    } else {
      // Formatear los resultados para el frontend
      const formattedResults = results.map(disciplina => ({
        label: disciplina.preflabel_es,
        value: String(disciplina.id),
        description: disciplina.uri
      }));
      callback(null, formattedResults);  // Ya no es necesario usar results.rows
    }
  });
};
