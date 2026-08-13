// const API_BASE = "http://localhost:5005/api";
// const API_BASE = "https://namami-infotech.com/vechileoptimize/api";
export async function fetchWarehouses() {
  const response = await fetch(`${API_BASE}/warehouses`);
  if (!response.ok) {
    throw new Error("Unable to fetch warehouses");
  }
  return response.json();
}

export async function createWarehouse(warehouseData) {
  const response = await fetch(`${API_BASE}/warehouses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(warehouseData),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const errorMessage =
      data?.error || data?.message || "Unable to create warehouse";
    throw new Error(errorMessage);
  }

  return data;
}

// export async function fetchRoutes() {
//   const response = await fetch(`${API_BASE}/route/optimize`);
//   const data = await response.json();
//   if (!response.ok || !data.success) {
//     throw new Error(data.message || "Unable to fetch routes");
//   }
//   return data.data;
// }
export async function fetchRoutes() {
  const response = await fetch(`${API_BASE}/route/optimize`);

  const rawData = await response.json().catch(() => null);

  console.log("Route API raw response:", rawData);

  if (!response.ok) {
    throw new Error(
      rawData?.error || rawData?.message || "Unable to fetch routes",
    );
  }

  /*
    API actually returns:

    {
      success: true,
      data: {
        success: true,
        message: "...",
        fc_origin: {...},
        all_routes: [...]
      }
    }
  */

  const routeData = rawData?.data;

  if (
    !routeData ||
    routeData.success !== true ||
    !Array.isArray(routeData.all_routes)
  ) {
    throw new Error("Invalid route API response: all_routes is missing");
  }

  /*
    Return ONLY the inner route data.

    Result:

    {
      success: true,
      message: "...",
      fc_origin: {...},
      all_routes: [...]
    }
  */

  return routeData;
}
