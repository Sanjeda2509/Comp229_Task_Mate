import Task from '../models/Task.js';
import { isValidId, isValidDate } from '../utils/helpers.js';

const statuses = ['pending', 'in-progress', 'completed'];
const priorities = ['low', 'medium', 'high'];

function validateTask(body, partial = false) {
  const keys = ['title', 'description', 'status', 'priority', 'dueDate'];
  if (Object.keys(body).some((k) => !keys.includes(k))) return 'Unknown task field';
  if (!partial && (typeof body.title !== 'string' || !body.title.trim())) return 'Task title is required';
  if (body.title !== undefined && (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 120)) return 'Title must be 1-120 characters';
  if (body.description !== undefined && (typeof body.description !== 'string' || body.description.length > 1000)) return 'Description must be at most 1000 characters';
  if (body.status !== undefined && !statuses.includes(body.status)) return 'Invalid task status';
  if (body.priority !== undefined && !priorities.includes(body.priority)) return 'Invalid task priority';
  if (body.dueDate !== undefined && !isValidDate(body.dueDate)) return 'Date must be YYYY-MM-DD or null';
  return null;
}

function normalize(body) {
  const result = {};
  for (const key of ['title', 'description', 'status', 'priority', 'dueDate']) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  if (result.dueDate) result.dueDate = new Date(`${result.dueDate}T00:00:00Z`);
  return result;
}

export async function createTask(req, res, next) {
  try {
    const error = validateTask(req.body);
    if (error) return res.status(400).json({ message: error });
    const task = await Task.create({ ...normalize(req.body), owner: req.user._id });
    res.status(201).json({ task });
  } catch (err) { next(err); }
}

export async function listTasks(req, res, next) {
  try {
    const filter = { owner: req.user._id };
    if (req.query.status) {
      if (!statuses.includes(req.query.status)) return res.status(400).json({ message: 'Invalid status filter' });
      filter.status = req.query.status;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) { next(err); }
}

export async function getTask(req, res, next) {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) { next(err); }
}

export async function updateTask(req, res, next) {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    if (!Object.keys(req.body).length) return res.status(400).json({ message: 'No fields provided' });
    const error = validateTask(req.body, true);
    if (error) return res.status(400).json({ message: error });
    const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, { $set: normalize(req.body) }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) { next(err); }
}

export async function deleteTask(req, res, next) {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
}
