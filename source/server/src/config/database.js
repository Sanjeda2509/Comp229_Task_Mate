import mongoose from 'mongoose';

export async function connectDatabase(uri) {
  if (!uri) throw new Error('MONGO_URI is missing. Check your server/.env file.');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
