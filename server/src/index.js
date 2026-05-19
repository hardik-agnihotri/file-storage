import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes.js';

const app = express();

// Express Configuration Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Main App Version Routing Layout
app.use('/api/v1/files', fileRoutes);

export default app;