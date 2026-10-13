const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function postPrediction(data) {
  let response;
  try {
    response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    throw new Error(
      `Cannot connect to backend server at ${API_URL}. Please ensure FastAPI is running (uvicorn app.main:app --reload).`
    );
  }

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
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) {
      return { status: 'offline' };
    }
    return response.json();
  } catch {
    return { status: 'offline' };
  }
}

export async function postBulkPrediction(file) {
  const formData = new FormData();
  formData.append('file', file);

  let response;
  try {
    response = await fetch(`${API_URL}/predict/bulk`, {
      method: 'POST',
      body: formData,
    });
  } catch (err) {
    throw new Error(
      `Cannot connect to backend server at ${API_URL}. Please ensure FastAPI is running (uvicorn app.main:app --reload).`
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    const message =
      error?.detail ||
      `Bulk prediction failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

