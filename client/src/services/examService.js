const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchExams(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/exams${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch exams');
  const json = await res.json();
  return json.data?.exams || [];
}

export async function fetchAvailableExams() {
  const res = await fetch(`${API_BASE}/exams/available`);
  if (!res.ok) throw new Error('Failed to fetch available exams');
  const json = await res.json();
  return json.data?.exams || [];
}

export async function createExam(payload) {
  const res = await fetch(`${API_BASE}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create exam');
  const json = await res.json();
  return json.data?.exam;
}

export async function updateExam(id, payload) {
  const res = await fetch(`${API_BASE}/exams/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update exam');
  const json = await res.json();
  return json.data?.exam;
}

export async function updateExamStatus(id, status) {
  const res = await fetch(`${API_BASE}/exams/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update status');
  const json = await res.json();
  return json.data?.exam;
}

export async function deleteExam(id) {
  const res = await fetch(`${API_BASE}/exams/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete exam');
  return true;
}


