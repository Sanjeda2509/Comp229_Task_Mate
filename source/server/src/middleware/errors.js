export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (err?.code === 11000) return res.status(409).json({ message: 'Email is already in use' });
  if (err?.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err?.name === 'CastError') return res.status(400).json({ message: 'Invalid ID or value' });
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}
