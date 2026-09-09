import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import catalogRoutes from './routes/catalogRoutes';
import streamRoutes from './routes/streamRoutes';
import adRoutes from './routes/adRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import fastRoutes from './routes/fastRoutes';
import adminRoutes from './routes/adminRoutes';

import partyRoutes from './routes/partyRoutes';
import aiSearchRoutes from './routes/aiSearchRoutes';
import paymentRoutes from './routes/paymentRoutes';
import settingsRoutes from './routes/settingsRoutes';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-device-id']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Microservice Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/fast', fastRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/party', partyRoutes);
app.use('/api/ai-search', aiSearchRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/settings', settingsRoutes);

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'TubiStream Cloud-Native Microservices Core',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime()
  });
});

// Production SPA Static File Serving (Render / Cloud single-service deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[TubiStream Server Error]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const HOST = process.env.HOST || '0.0.0.0';

app.listen(Number(PORT), HOST, () => {
  console.log(`====================================================`);
  console.log(`🚀 TubiStream Microservices Backend running on http://${HOST}:${PORT}`);
  console.log(`📡 API Gateway: http://localhost:${PORT}/api/health`);
  console.log(`🎬 Catalog Service: http://localhost:${PORT}/api/catalog/titles`);
  console.log(`📺 FAST EPG Service: http://localhost:${PORT}/api/fast/channels`);
  console.log(`🎯 Ad Decision Server: http://localhost:${PORT}/api/ads/metrics`);
  console.log(`🤖 ML Recommendation Engine: http://localhost:${PORT}/api/recommendations/feed`);
  console.log(`📊 Admin Analytics Studio: http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`====================================================`);
});
