const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function api(path, { method = 'GET', body, token } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {})
    });
  } catch {
    throw new Error('Cannot connect to API. Start the backend and check MongoDB connection.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
