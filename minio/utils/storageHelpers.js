// /minio/utils/storageHelpers.js
import { uploadFile, downloadFile } from '../controllers/minioController.js';

export const handleFileUpload = (req, res) => {
  const file = req.file; // Accede al archivo desde memory storage
  const bucketName = 'my-bucket';
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Usando buffer y originalname del archivo cargado en memoria
  uploadFile(bucketName, { name: file.originalname, data: file.buffer }, (err, etag) => {
    if (err) return res.status(500).send(err);
    res.send(`Archivo subido correctamente. ETag: ${etag}`);
  });
};

export const handleFileDownload = (req, res) => {
  const bucketName = 'my-bucket';  // Asegúrate de usar el nombre correcto del bucket
  const fileName = req.params.filename;  // El nombre del archivo se recibe como parámetro en la URL

  downloadFile(bucketName, fileName, res);
};
