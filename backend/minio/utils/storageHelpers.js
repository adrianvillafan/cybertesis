// /minio/utils/storageHelpers.js
import { uploadFile, deleteFile, getDownloadUrl } from '../controllers/minioController.js';

const bucketName = 'my-bucket'; // Asegúrate de usar el nombre de tu bucket correcto

// Manejador para subir archivos
export const handleFileUpload = async (req, res) => {
  try {
    const file = req.file; // El archivo está en memoria
    if (!file) {
      throw new Error('No se ha subido ningún archivo');
    }
    const fileKey = `${Date.now()}-${file.originalname}`;
    const result = await uploadFile(bucketName, fileKey, file.buffer);
    res.status(201).send({
      message: 'Archivo subido correctamente',
      key: fileKey
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Manejador para descargar archivos
export const handleFileDownload = async (req, res) => {
  const fileKey = req.params.filename;
  try {
    const downloadUrl = await getDownloadUrl(bucketName, fileKey);
    res.status(200).send({
      url: downloadUrl
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
