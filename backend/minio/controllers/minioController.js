import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from '../config/minioClient.js';

// Función para subir un archivo PDF a MinIO
export const uploadFileToMinIO = async (file, bucketName, fileName) => {
  if (file.mimetype !== 'application/pdf' || file.size > 10485760) {
    throw new Error('Archivo debe ser PDF y menor a 10 MB.');
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `Archivo ${fileName} subido correctamente.`;
};

// Función para obtener un URL de descarga temporal
export const getDownloadUrlFromMinIO = async (bucketName, fileName) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expira en 1 hora
  return url;
};

// Función para eliminar un archivo
export const deleteFileFromMinIO = async (bucketName, fileName) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileName
  });

  await s3Client.send(command);
  return `Archivo ${fileName} eliminado correctamente.`;
};
