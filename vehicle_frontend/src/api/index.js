const API_BASE = "http://localhost:5005/api";

export async function fetchWarehouses() {
  const response = await fetch(`${API_BASE}/warehouses`);
  if (!response.ok) {
    throw new Error("Unable to fetch warehouses");
  }
  return response.json();
}

export async function fetchRoutes() {
  const response = await fetch(`${API_BASE}/route/optimize`);
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Unable to fetch routes");
  }
  return data.data;
}
