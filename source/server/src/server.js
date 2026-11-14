import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const port = Number(process.env.PORT || 5000);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Set JWT_SECRET in server/.env to a random string of at least 32 characters');
  process.exit(1);
}
try {
  await connectDatabase(process.env.MONGO_URI);
  app.listen(port, () => console.log(`TaskMate API: http://localhost:${port}`));
} catch (err) {
  console.error('Server startup failed:', err.message);
  process.exit(1);
}
