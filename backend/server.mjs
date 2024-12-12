//backend/server.mjs

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import solicitudRoutes from './routes/solicitudRoutes.js';
import usuariosRoutes from './routes/usuariosRoutes.js';
import mailRoutes from './routes/mailRoutes.js';
import uoariRoutes from './routes/uoariRoutes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rutas para usuarios
app.use('/api/users', userRoutes);

// Rutas para manejo de archivos
app.use('/api/files', fileRoutes);

// Usa las rutas de solicitud
app.use('/api/solicitudes', solicitudRoutes);

// Rutas para listar, ver, modificar alumnado
app.use('/api/estudiantes', usuariosRoutes)

// Rutas para mailer
app.use('/api/mailer', mailRoutes);

// Rutas para uoari
app.use('/api/uoari', uoariRoutes);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});
