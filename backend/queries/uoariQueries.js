import { executeQuery } from '../config/db.js';

export function fetchUoariData(userId, callback) {
    const sql = `
        SELECT 
            u.id::integer,
            u.name,
            u.email,
            u.current_team_id::integer,
            r.name AS role_name,
            r.guard_name
        FROM users u
        JOIN roles r ON u.current_team_id = r.id
        WHERE u.id = $1;
    `;

    // Ejecutar la consulta para obtener los datos de UOARI
    executeQuery(sql, [userId], (err, results) => {
        if (err || results.length === 0) {  // Ya no es necesario usar results.rows.length
            console.error('Error al buscar datos de UOARI:', err);
            callback({ message: 'Error al buscar datos de UOARI' }, null);
        } else {
            console.log('Datos de UOARI encontrados:', results[0]);  // Ya no es necesario usar results.rows[0]
            callback(null, results[0]);
        }
    });
}


export const insertUoariData = (uoariDetails, callback) => {
    const queryInsertUoari = `
      INSERT INTO uoari (
        id_solicitud,
        autor,
        titulo1,
        titulo2,
        fecha_publicacion,
        editorial,
        como_citar,
        idioma
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    const uoariValues = [
      uoariDetails.id_solicitud,
      uoariDetails.autor,
      uoariDetails.titulo1,
      uoariDetails.titulo2,
      uoariDetails.fecha_publicacion,
      uoariDetails.editorial,
      uoariDetails.como_citar,
      uoariDetails.idioma
    ];
  
    executeQuery(queryInsertUoari, uoariValues, (err, results) => {
      if (err) {
        console.error('Error al insertar datos:', err);
        callback(err, null);
      } else {
        const metadataId = results[0].id; // Ya no es necesario usar results.rows
  
        const queryUpdateDocumentos = `
          UPDATE documentos SET metadatos_id = $1 WHERE id = $2
        `;
        executeQuery(queryUpdateDocumentos, [metadataId, uoariDetails.documentos_id], (err, updateResults) => {
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