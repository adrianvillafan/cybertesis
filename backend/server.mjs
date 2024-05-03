import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

const app = express();
const port = 3000;
//const port = 3306; // Nota: El puerto 3306 generalmente es usado por MySQL. Considera usar un puerto diferente para el servidor, como 3000.

app.use(cors());
app.use(express.json());

// Rutas para usuarios
app.use('/api/users', userRoutes);

// Rutas para manejo de archivos
app.use('/api/files', fileRoutes);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
