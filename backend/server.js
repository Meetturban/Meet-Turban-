import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase, isSupabaseConfigured } from './lib/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Root Endpoint for Render / Uptime monitors
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Meet Turban Backend Service is running successfully! 🚀',
    supabaseConfigured: isSupabaseConfigured,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Meet Turban Server started on port ${PORT}`);
  console.log(`=================================`);
});
