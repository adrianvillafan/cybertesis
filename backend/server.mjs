import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rutas para usuarios
app.use('/api/users', userRoutes);

// Rutas para manejo de archivos
app.use('/api/files', fileRoutes);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
