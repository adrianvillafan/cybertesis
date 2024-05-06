import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: 'us-east-1', // Puedes elegir cualquier región ya que MinIO no la usa realmente
  endpoint: 'http://minio:9000', // Asegúrate de que este es el endpoint correcto para tu instancia de MinIO
  forcePathStyle: true, // Necesario para MinIO porque no soporta el estilo de host de bucket
  credentials: {
    accessKeyId: 'minioadmin', // Sustituye por tu accessKeyId real
    secretAccessKey: 'minioadmin' // Sustituye por tu secretAccessKey real
  },
});

export default s3Client;
