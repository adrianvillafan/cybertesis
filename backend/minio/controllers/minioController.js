import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { externalS3Client, internalS3Client } from '../config/minioClient.js';
import fetch from 'node-fetch';

// Función para subir un archivo PDF a MinIO
export const uploadFileToMinIO = async (file, bucketName, fileName) => {
  if (file.mimetype !== 'application/pdf' || file.size > 20971520) { // 20 MB 
    throw new Error('Archivo debe ser PDF y menor a 20 MB.');
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await internalS3Client.send(command); // Usa el cliente interno para subir archivos
  return `Archivo ${fileName} subido correctamente.`;
};

export const getDownloadUrlFromMinIO = async (bucketName, fileName) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  const url = await getSignedUrl(externalS3Client, command, { expiresIn: 3600 }); // URL expira en 1 hora
  return url; // El URL ya está usando el cliente externo
};

export const getViewUrlForDocument = async (bucketName, fileName) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(externalS3Client, command, { expiresIn: 3600 }); // URL expira en 1 hora
    const response = await fetch(signedUrl); // Obtener el archivo directamente desde el URL firmado
    if (!response.ok) {
      throw new Error(`Error al obtener el documento: ${response.statusText}`);
    }
    const blob = await response.blob(); // Convertir la respuesta a Blob
    return blob;
  } catch (error) {
    console.error('Error al obtener Blob del documento:', error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para eliminar un archivo
export const deleteFileFromMinIO = async (bucketName, fileName) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileName
  });

  await internalS3Client.send(command); // Usa el cliente interno para eliminar archivos
  return `Archivo ${fileName} eliminado correctamente.`;
};
