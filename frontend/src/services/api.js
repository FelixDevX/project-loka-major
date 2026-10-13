const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function postPrediction(data) {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message =
      error?.detail ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`);
  if (!response.ok) {
    throw new Error('Backend unreachable');
  }
  return response.json();
}

export async function postBulkPrediction(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/predict/bulk`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message =
      error?.detail ||
      `Bulk prediction failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}
