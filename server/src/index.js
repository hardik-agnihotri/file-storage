import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Express Configuration Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/v1/files', fileRoutes);
app.use('/api/v1/auth', authRoutes);

export default app;