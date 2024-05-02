import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

const app = express();
const port = 3306; // Nota: El puerto 3306 generalmente es usado por MySQL. Considera usar un puerto diferente para el servidor, como 3000.

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
