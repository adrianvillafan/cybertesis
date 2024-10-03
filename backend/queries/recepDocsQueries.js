import { executeQuery } from '../config/db.js';

// Función original para buscar datos de recepción de documentos y el rol asociado
export function fetchRecepDocsData(userId, callback) {
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

    // Ejecutar la consulta para obtener los datos de recepción de documentos y el rol asociado
    executeQuery(sql, [userId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Error al buscar datos de recepción de documentos:', err);
            callback({ message: 'Error al buscar datos de recepción de documentos' }, null);
        } else {
            console.log('Datos de recepción de documentos encontrados:', results[0]);
            callback(null, results[0]);
        }
    });
}


// Función para obtener los expedientes recibidos (en estado 3)
export function fetchExpedientesByEstado(estadoId, callback) {
    const sql = `
        SELECT
            s.id AS solicitudId,
            d.id AS expedienteId,
            s.id_estado AS estado,
            s.fecha_alum AS fecha_carga,
            d.ultima_modificacion,
            e.codigo_estudiante,
            p.identificacion_id AS dni,
            CONCAT(p.nombre, ' ', p.apellidos_pat, ' ', p.apellidos_mat) AS nombre_completo,
            f.nombre AS facultad,
            g.grado AS grado,
            fp.programa AS programa
        FROM solicitudes s
        JOIN documentos d ON s.id_documentos = d.id
        JOIN estudiante e ON d.estudiante_id = e.id
        JOIN personas p ON e.persona_id = p.idpersonas
        JOIN facultad f ON e.facultad_id = f.id
        JOIN grado_academico g ON e.grado_id = g.id
        JOIN facultad_programa fp ON e.programa_id = fp.id
        WHERE s.id_estado = $1
        ORDER BY s.fecha_alum DESC;
    `;

    // Ejecutar la consulta para obtener los expedientes en el estado especificado
    executeQuery(sql, [estadoId], (err, results) => {
        if (err) {
            console.error('Error al obtener expedientes por estado:', err);
            callback({ message: 'Error al obtener expedientes por estado' }, null);
        } else {
            console.log('Expedientes encontrados para el estado:', estadoId, results);
            callback(null, results);
        }
    });
}


export function fetchExpedienteDetails(solicitudId, expedienteId, callback) {
    const sql = `
        SELECT
            s.id AS solicitudId,
            d.id AS expedienteId,
            s.id_estado AS estado,
            s.fecha_alum AS fecha_carga,
            d.ultima_modificacion,
            e.codigo_estudiante,
            p.identificacion_id AS dni,
            CONCAT(p.nombre, ' ', p.apellidos_pat, ' ', p.apellidos_mat) AS nombre_completo,
            f.nombre AS facultad,
            g.grado AS grado,
            fp.programa AS programa,
            t.titulo AS titulo_tesis,
            t.año AS anio_tesis,
            CONCAT(pa1.nombre, ' ', pa1.apellidos_pat, ' ', pa1.apellidos_mat) AS asesor1,
            CONCAT(pa2.nombre, ' ', pa2.apellidos_pat, ' ', pa2.apellidos_mat) AS asesor2
        FROM solicitudes s
        JOIN documentos d ON s.id_documentos = d.id
        JOIN estudiante e ON d.estudiante_id = e.id
        JOIN personas p ON e.persona_id = p.idpersonas
        JOIN facultad f ON e.facultad_id = f.id
        JOIN grado_academico g ON e.grado_id = g.id
        JOIN facultad_programa fp ON e.programa_id = fp.id
        LEFT JOIN tesis t ON d.tesis_id = t.id_tesis
        LEFT JOIN tesis_participacion tp ON t.id_participantes = tp.id_participantes
        LEFT JOIN personas pa1 ON tp.id_asesor1 = pa1.idpersonas
        LEFT JOIN personas pa2 ON tp.id_asesor2 = pa2.idpersonas
        WHERE s.id = $1 AND d.id = $2;
    `;

    executeQuery(sql, [solicitudId, expedienteId], (err, results) => {
        if (err) {
            console.error('Error al obtener los detalles del expediente:', err);
            callback({ message: 'Error al obtener los detalles del expediente' }, null);
        } else {
            console.log('Detalles del expediente encontrados:', results);
            callback(null, results[0]); // Devuelve el primer resultado, ya que se espera solo un expediente
        }
    });
}

export function fetchDocumentosRelacionados(solicitudId, expedienteId, callback) {
    const sql = `
        SELECT
            d.tesis_id,
            t.fecha_modificacion AS tesis_fecha_modificacion,
            s.tesis_estado,
            s.tesis_fecha_revision,

            d.actasust_id,
            a.updated_at AS actasust_fecha_modificacion,
            s.acta_estado,
            s.acta_fecha_revision,

            d.certsimil_id,
            c.updated_at AS certsimil_fecha_modificacion,
            s.certificado_estado,
            s.certificado_fecha_revision,

            d.autocyber_id,
            au.updated_at AS autocyber_fecha_modificacion,
            s.auto_estado,
            s.auto_fecha_revision,

            d.metadatos_id,
            m.updated_at AS metadatos_fecha_modificacion,
            s.metadatos_estado,
            s.metadatos_fecha_revision,

            d.repturnitin_id,
            rt.updated_at AS repturnitin_fecha_modificacion,
            s.turnitin_estado,
            s.turnitin_fecha_revision,

            d.consentimiento_id,
            con.updated_date AS consentimiento_fecha_modificacion,
            s.consentimiento_estado,
            s.consentimiento_fecha_revision,

            d.postergacion_id,
            p.updated_date AS postergacion_fecha_modificacion,
            s.postergacion_estado,
            s.postergacion_fecha_revision
        FROM documentos d
        JOIN solicitudes s ON d.id = s.id_documentos
        LEFT JOIN tesis t ON d.tesis_id = t.id_tesis
        LEFT JOIN acta_sustentacion a ON d.actasust_id = a.id
        LEFT JOIN certificado_similitud c ON d.certsimil_id = c.id
        LEFT JOIN auto_cyber au ON d.autocyber_id = au.id
        LEFT JOIN metadata m ON d.metadatos_id = m.id
        LEFT JOIN reporte_turnitin rt ON d.repturnitin_id = rt.id
        LEFT JOIN consentimiento con ON d.consentimiento_id = con.id
        LEFT JOIN postergacion p ON d.postergacion_id = p.id
        WHERE s.id = $1 AND d.id = $2;
    `;

    executeQuery(sql, [solicitudId, expedienteId], (err, results) => {
        if (err) {
            console.error('Error al obtener los documentos relacionados:', err);
            callback({ message: 'Error al obtener los documentos relacionados' }, null);
        } else {
            console.log('Documentos relacionados encontrados:', results);
            callback(null, results);
        }
    });
}


