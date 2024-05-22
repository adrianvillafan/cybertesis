import { S3Client } from "@aws-sdk/client-s3";

const externalS3Client = new S3Client({
  region: 'us-east-1', // Puedes elegir cualquier región ya que MinIO no la usa realmente
  endpoint: 'http://localhost:9000', // Endpoint externo
  forcePathStyle: true, // Necesario para MinIO porque no soporta el estilo de host de bucket
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY, 
    secretAccessKey: process.env.MINIO_SECRET_KEY
  },
});

const internalS3Client = new S3Client({
  region: 'us-east-1',
  endpoint: 'http://minio:9000', // Endpoint interno
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY, 
    secretAccessKey: process.env.MINIO_SECRET_KEY
  },
});

export { externalS3Client, internalS3Client };
