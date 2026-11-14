import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isEmail, publicUser } from '../utils/helpers.js';

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '12h' });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 80 || !isEmail(email) || typeof password !== 'string' || password.length < 8)
      return res.status(400).json({ message: 'Provide name, valid email, and a password of at least 8 characters' });
    const cleanedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: cleanedEmail })) return res.status(409).json({ message: 'Email is already in use' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: cleanedEmail, passwordHash });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!isEmail(email) || typeof password !== 'string') return res.status(400).json({ message: 'Valid email and password are required' });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
}
