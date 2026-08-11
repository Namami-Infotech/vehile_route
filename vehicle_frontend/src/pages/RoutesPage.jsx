// import { useState } from "react";
// import { fetchRoutes } from "../api";
// import RouteMap from "../components/RouteMap";

// function RoutesPage() {
//   const [routeData, setRouteData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleRefresh() {
//     setError("");
//     setLoading(true);
//     try {
//       const data = await fetchRoutes();
//       setRouteData(data);
//     } catch (err) {
//       setRouteData(null);
//       setError("Failed to load route information.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section>
//       <h2>Routes</h2>
//       <p>
//         The route plan is generated from the backend optimization endpoint and
//         shows the source plus covered warehouse stops.
//       </p>
//       <button
//         onClick={handleRefresh}
//         disabled={loading}
//         style={{ padding: "10px 18px", cursor: "pointer" }}
//       >
//         {loading ? "Loading…" : "Load Route"}
//       </button>

//       {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}

//       {routeData && (
//         <div style={{ marginTop: 24 }}>
//           <div style={{ marginBottom: 20 }}>
//             <p>
//               <strong>Source:</strong> {routeData.source.name} —{" "}
//               {/* {routeData.source.latitude}, {routeData.source.longitude} */}
//               Okhla phase 1, Dlf Tower New Delhi, Delhi 110020, India
//             </p>
//             <p>
//               <strong>Total distance:</strong> {routeData.totalDistanceKm} km
//               <br />
//               <strong>Warehouses covered:</strong>{" "}
//               {routeData.warehousesCoveredCount}
//             </p>
//           </div>

//           <RouteMap routeData={routeData} />
//         </div>
//       )}
//     </section>
//   );
// }

// export default RoutesPage;

import { useState } from "react";
import { fetchRoutes } from "../api";
import RouteMap from "../components/RouteMap";

function RoutesPage() {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  async function handleRefresh() {
    setError("");
    setLoading(true);
    try {
      const data = await fetchRoutes();
      setRouteData(data);
      setSelectedRouteIndex(0);
    } catch (err) {
      setRouteData(null);
      setError("Failed to load route information.");
    } finally {
      setLoading(false);
    }
  }

  // Get top 4 routes from allCombinationsRanked
  const getTopRoutes = () => {
    if (!routeData?.allCombinationsRanked) return [];
    return routeData.allCombinationsRanked.slice(0, 4);
  };

  const topRoutes = getTopRoutes();

  // Build route sequence for selected route
  const getRouteSequenceForSelected = () => {
    if (!routeData || !routeData.routeSequence) return [];

    const selectedRoute = topRoutes[selectedRouteIndex];
    if (!selectedRoute) return routeData.routeSequence;

    // Parse the path order to get the sequence of names
    const pathNames = selectedRoute.pathOrder.split(" ➔ ");

    // Map names to actual route objects
    const sequence = pathNames
      .map((name) => {
        // Check if it's the source
        if (name === "Source House") {
          return routeData.source;
        }
        // Find matching warehouse
        return routeData.routeSequence.find((item) => item.name === name);
      })
      .filter((item) => item !== undefined);

    return sequence;
  };

  const selectedSequence = getRouteSequenceForSelected();

  return (
    <section style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Routes</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        The route plan is generated from the backend optimization endpoint and
        shows the source plus covered warehouse stops.
      </p>

      <button
        onClick={handleRefresh}
        disabled={loading}
        style={{
          padding: "10px 24px",
          cursor: "pointer",
          backgroundColor: "#7C3AED",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "14px",
          transition: "all 0.3s",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Loading…" : "🔄 Load Route"}
      </button>

      {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}

      {routeData && (
        <div style={{ marginTop: 24 }}>
          {/* Route Summary */}
          <div
            style={{
              background: "linear-gradient(135deg, #f5f3ff, #fff7ed)",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid #e5e7eb",
            }}
          >
            <p style={{ marginBottom: "8px" }}>
              <strong>🏠 Source:</strong> {routeData.source.name} — Okhla phase
              1, Dlf Tower New Delhi, Delhi 110020, India
            </p>
            <p style={{ marginBottom: "8px" }}>
              <strong>📏 Total distance:</strong> {routeData.totalDistanceKm} km
              <br />
              <strong>🏢 Warehouses covered:</strong>{" "}
              {routeData.warehousesCoveredCount}
            </p>
            <p
              style={{
                background: "#dbeafe",
                padding: "8px 16px",
                borderRadius: "8px",
                display: "inline-block",
                fontSize: "14px",
                color: "#1e40af",
              }}
            >
              🏆 Best Route: {routeData.proofSummary.winningSequence}
            </p>
          </div>

          {/* Route Selection Tabs */}
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "18px",
                marginBottom: "12px",
                color: "#374151",
              }}
            >
              📍 Available Routes (Top 4)
            </h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {topRoutes.map((route, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedRouteIndex(index)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "10px",
                    border:
                      selectedRouteIndex === index
                        ? "2px solid #7C3AED"
                        : "1px solid #d1d5db",
                    backgroundColor:
                      selectedRouteIndex === index ? "#f5f3ff" : "white",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    flex: "1 1 200px",
                    minWidth: "180px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#1f2937",
                    }}
                  >
                    Route #{index + 1}
                    {route.status.includes("BEST") && " ⭐"}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    📏 {route.totalDistanceKm}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      marginTop: "2px",
                    }}
                  >
                    🏢 {route.warehousesCovered} warehouses
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Route Details */}
          <div
            style={{
              background: "#f9fafb",
              padding: "16px 20px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong style={{ fontSize: "16px", color: "#1f2937" }}>
                  Route #{selectedRouteIndex + 1}
                </strong>
                <span
                  style={{
                    marginLeft: "12px",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  {topRoutes[selectedRouteIndex]?.pathOrder}
                </span>
              </div>
              <div
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  background: topRoutes[selectedRouteIndex]?.status.includes(
                    "BEST",
                  )
                    ? "#d1fae5"
                    : "#fef3c7",
                  color: topRoutes[selectedRouteIndex]?.status.includes("BEST")
                    ? "#065f46"
                    : "#92400e",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {topRoutes[selectedRouteIndex]?.status.includes("BEST")
                  ? "🏆 Optimal"
                  : "🔄 Alternative"}
              </div>
            </div>
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "14px", color: "#374151" }}>
                📏 Distance:{" "}
                <strong>
                  {topRoutes[selectedRouteIndex]?.totalDistanceKm}
                </strong>
              </span>
              <span style={{ fontSize: "14px", color: "#374151" }}>
                🏢 Warehouses:{" "}
                <strong>
                  {topRoutes[selectedRouteIndex]?.warehousesCovered}
                </strong>
              </span>
            </div>
          </div>

          {/* Map with selected route */}
          <RouteMap
            routeData={{
              ...routeData,
              routeSequence: selectedSequence,
              totalDistanceKm: parseFloat(
                topRoutes[selectedRouteIndex]?.totalDistanceKm ||
                  routeData.totalDistanceKm,
              ),
            }}
            selectedRouteIndex={selectedRouteIndex}
            totalRoutes={topRoutes.length}
          />
        </div>
      )}
    </section>
  );
}

export default RoutesPage;
