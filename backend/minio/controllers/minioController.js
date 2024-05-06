import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../config/minioClient.js";

// Subir archivo
export const uploadFile = async (bucketName, fileKey, fileBody) => {
  try {
    const data = await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: fileBody
    }));
    console.log("Archivo subido con éxito:", data);
    return data;
  } catch (err) {
    console.error("Error al subir el archivo:", err);
    throw err;
  }
};

// Descargar archivo
export const downloadFile = async (bucketName, fileKey) => {
  try {
    const data = await s3Client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey
    }));
    console.log("Archivo descargado con éxito");
    return data.Body;
  } catch (err) {
    console.error("Error al descargar el archivo:", err);
    throw err;
  }
};

// Generar URL firmada para descargar
export const getDownloadUrl = async (bucketName, fileKey) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
  } catch (err) {
    console.error("Error al generar URL firmada:", err);
    throw err;
  }
};

// Eliminar archivo
export const deleteFile = async (bucketName, fileKey) => {
  try {
    const data = await s3Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey
    }));
    console.log("Archivo eliminado con éxito:", data);
    return data;
  } catch (err) {
    console.error("Error al eliminar el archivo:", err);
    throw err;
  }
};
