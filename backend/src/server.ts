import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemsRoutes from './routes/itemsRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'P&R Thrift & Style Collection API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/items', itemsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', ordersRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  ⚡ P&R Thrift & Style Collection API Running
  ===========================================
  Local Server:  http://localhost:${PORT}
  Health Check:  http://localhost:${PORT}/api/health
  API Endpoints: /api/items, /api/cart, /api/chat, /api/orders
  ===========================================
  `);
});
