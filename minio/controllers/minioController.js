// /minio/controllers/minioController.js
import minioClient from '../config/minioClient.js';

/**
 * Sube un archivo a MinIO
 * @param {string} bucketName - Nombre del bucket de MinIO donde se subirá el archivo
 * @param {object} file - Objeto de archivo que contiene el nombre y los datos del archivo
 * @param {function} callback - Función callback que maneja la respuesta
 */
export const uploadFile = (bucketName, file, callback) => {
  minioClient.putObject(bucketName, file.name, file.data, (err, etag) => {
    if (err) {
      console.error("Error uploading file to MinIO:", err);
      return callback(err);
    }
    callback(null, etag);
  });
};

/**
 * Genera un enlace temporal para descargar un archivo desde MinIO
 * @param {string} bucketName - Nombre del bucket de MinIO donde se encuentra el archivo
 * @param {string} fileName - Nombre del archivo a descargar
 * @param {object} res - Objeto de respuesta de Express
 */
export const downloadFile = async (bucketName, fileName, res) => {
  try {
    const url = await minioClient.presignedGetObject(bucketName, fileName, 86400); // URL válida por 24 horas
    res.send({ url });  // Enviar el enlace al cliente
  } catch (err) {
    console.error("Error generating download link from MinIO:", err);
    res.status(500).send('Error al descargar el archivo: ' + err.message);
  }
};
