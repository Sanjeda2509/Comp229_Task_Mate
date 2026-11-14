import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { isEmail, publicUser } from '../utils/helpers.js';

export async function getProfile(req, res) {
  res.json({ user: publicUser(req.user) });
}

export async function updateProfile(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (name === undefined && email === undefined && password === undefined)
      return res.status(400).json({ message: 'No profile fields provided' });
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) return res.status(400).json({ message: 'Invalid name' });
      req.user.name = name.trim();
    }
    if (email !== undefined) {
      if (!isEmail(email)) return res.status(400).json({ message: 'Invalid email' });
      const cleaned = email.trim().toLowerCase();
      const conflict = await User.exists({ email: cleaned, _id: { $ne: req.user._id } });
      if (conflict) return res.status(409).json({ message: 'Email is already in use' });
      req.user.email = cleaned;
    }
    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 8) return res.status(400).json({ message: 'Password must have at least 8 characters' });
      req.user.passwordHash = await bcrypt.hash(password, 12);
    }
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (err) { next(err); }
}

export async function deleteProfile(req, res, next) {
  try {
    await Task.deleteMany({ owner: req.user._id });
    await User.deleteOne({ _id: req.user._id });
    res.json({ message: 'Account and associated tasks deleted' });
  } catch (err) { next(err); }
}
