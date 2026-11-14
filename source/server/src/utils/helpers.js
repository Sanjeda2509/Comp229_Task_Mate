import mongoose from 'mongoose';

export const isValidId = (id) => mongoose.isValidObjectId(id);
export const isEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const publicUser = (user) => ({
  id: user._id.toString(), name: user.name, email: user.email,
  createdAt: user.createdAt
});
export const isValidDate = (date) => date === null || (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`)));
