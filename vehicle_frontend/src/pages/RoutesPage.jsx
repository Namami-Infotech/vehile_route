// // // import { useState } from "react";
// // import { fetchRoutes } from "../api";
// // import { useState } from "react";
// // import RouteMap from "../components/RouteMap";

// // function RoutesPage() {
// //   const [routeData, setRouteData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
// //   const [showAllRoutes, setShowAllRoutes] = useState(false);

// //   async function handleRefresh() {
// //     setError("");
// //     setLoading(true);
// //     try {
// //       const data = await fetchRoutes();
// //       setRouteData(data);
// //       console.log("Fetched route data:", data);
// //       setSelectedRouteIndex(0);
// //     } catch (err) {
// //       setRouteData(null);
// //       setError("Failed to load route information.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   // Get routes from all_routes
// //   const getRoutes = () => {
// //     if (!routeData?.data?.all_routes) return [];
// //     return routeData.data.all_routes;
// //   };

// //   const routes = getRoutes();

// //   // Get selected route
// //   const getSelectedRoute = () => {
// //     if (!routes.length) return null;
// //     return routes[selectedRouteIndex] || routes[0];
// //   };

// //   const selectedRoute = getSelectedRoute();

// //   return (
// //     <section style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
// //       <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>
// //         🚚 Route Optimization
// //       </h2>
// //       <p style={{ color: "#666", marginBottom: "20px" }}>
// //         Optimized delivery routes from the source warehouse covering all
// //         required stops
// //       </p>

// //       <button
// //         onClick={handleRefresh}
// //         disabled={loading}
// //         style={{
// //           padding: "10px 24px",
// //           cursor: "pointer",
// //           backgroundColor: "#7C3AED",
// //           color: "white",
// //           border: "none",
// //           borderRadius: "8px",
// //           fontWeight: "600",
// //           fontSize: "14px",
// //           transition: "all 0.3s",
// //           opacity: loading ? 0.7 : 1,
// //         }}
// //       >
// //         {loading ? "Loading…" : "🔄 Load Route"}
// //       </button>

// //       {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}

// //       {routeData && routes.length > 0 && (
// //         <div style={{ marginTop: 24 }}>
// //           {/* Source Information Card */}
// //           <div
// //             style={{
// //               background: "linear-gradient(135deg, #1f2937, #374151)",
// //               padding: "24px",
// //               borderRadius: "12px",
// //               marginBottom: "24px",
// //               border: "2px solid #4F46E5",
// //               color: "white",
// //             }}
// //           >
// //             <div
// //               style={{
// //                 display: "flex",
// //                 alignItems: "center",
// //                 justifyContent: "space-between",
// //                 flexWrap: "wrap",
// //                 gap: "20px",
// //               }}
// //             >
// //               <div>
// //                 <div
// //                   style={{
// //                     fontSize: "12px",
// //                     color: "#9CA3AF",
// //                     marginBottom: "4px",
// //                   }}
// //                 >
// //                   🏭 SOURCE WAREHOUSE
// //                 </div>
// //                 <h3
// //                   style={{
// //                     fontSize: "16px",
// //                     marginBottom: "8px",
// //                     fontWeight: "700",
// //                   }}
// //                 >
// //                   {routeData.data.fc_origin?.name || "Main Warehouse"}
// //                 </h3>
// //                 <div style={{ fontSize: "13px", color: "#D1D5DB" }}>
// //                   📍 Lat: {routeData.data.fc_origin?.latitude.toFixed(4)} | Lng:{" "}
// //                   {routeData.data.fc_origin?.longitude.toFixed(4)}
// //                 </div>
// //               </div>
// //               <div
// //                 style={{
// //                   background: "rgba(79, 70, 229, 0.2)",
// //                   padding: "12px 20px",
// //                   borderRadius: "8px",
// //                   border: "1px solid #4F46E5",
// //                   textAlign: "center",
// //                 }}
// //               >
// //                 <div
// //                   style={{
// //                     fontSize: "12px",
// //                     color: "#A5B4FC",
// //                     marginBottom: "4px",
// //                   }}
// //                 >
// //                   TOTAL ROUTES
// //                 </div>
// //                 <div
// //                   style={{
// //                     fontSize: "24px",
// //                     fontWeight: "700",
// //                     color: "#E0E7FF",
// //                   }}
// //                 >
// //                   {routes.length}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* View Mode Toggle */}
// //           <div
// //             style={{
// //               display: "flex",
// //               gap: "12px",
// //               marginBottom: "20px",
// //               alignItems: "center",
// //             }}
// //           >
// //             <div
// //               style={{
// //                 background: "#f3f4f6",
// //                 padding: "4px",
// //                 borderRadius: "8px",
// //                 display: "flex",
// //                 gap: "4px",
// //               }}
// //             >
// //               <button
// //                 onClick={() => setShowAllRoutes(false)}
// //                 style={{
// //                   padding: "8px 16px",
// //                   borderRadius: "6px",
// //                   border: "none",
// //                   cursor: "pointer",
// //                   fontWeight: "600",
// //                   fontSize: "13px",
// //                   background: !showAllRoutes ? "#7C3AED" : "transparent",
// //                   color: !showAllRoutes ? "white" : "#6B7280",
// //                   transition: "all 0.3s",
// //                 }}
// //               >
// //                 📍 Individual Route
// //               </button>
// //               <button
// //                 onClick={() => setShowAllRoutes(true)}
// //                 style={{
// //                   padding: "8px 16px",
// //                   borderRadius: "6px",
// //                   border: "none",
// //                   cursor: "pointer",
// //                   fontWeight: "600",
// //                   fontSize: "13px",
// //                   background: showAllRoutes ? "#7C3AED" : "transparent",
// //                   color: showAllRoutes ? "white" : "#6B7280",
// //                   transition: "all 0.3s",
// //                 }}
// //               >
// //                 🗺️ All Routes
// //               </button>
// //             </div>
// //             <span style={{ color: "#9CA3AF", fontSize: "13px" }}>
// //               {showAllRoutes
// //                 ? "Showing all optimized routes with different colors"
// //                 : "Showing selected route details"}
// //             </span>
// //           </div>

// //           {/* Route Selection Tabs - Only show if not viewing all routes */}
// //           {!showAllRoutes && (
// //             <div style={{ marginBottom: "20px" }}>
// //               <h3
// //                 style={{
// //                   fontSize: "18px",
// //                   marginBottom: "12px",
// //                   color: "#374151",
// //                 }}
// //               >
// //                 📍 Available Routes ({routes.length})
// //               </h3>
// //               <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
// //                 {routes.map((route, index) => (
// //                   <button
// //                     key={index}
// //                     onClick={() => setSelectedRouteIndex(index)}
// //                     style={{
// //                       padding: "12px 20px",
// //                       borderRadius: "10px",
// //                       border:
// //                         selectedRouteIndex === index
// //                           ? "2px solid #7C3AED"
// //                           : "1px solid #d1d5db",
// //                       backgroundColor:
// //                         selectedRouteIndex === index ? "#f5f3ff" : "white",
// //                       cursor: "pointer",
// //                       transition: "all 0.3s",
// //                       flex: "1 1 200px",
// //                       minWidth: "180px",
// //                       textAlign: "left",
// //                     }}
// //                   >
// //                     <div
// //                       style={{
// //                         fontWeight: "600",
// //                         fontSize: "14px",
// //                         color: "#1f2937",
// //                       }}
// //                     >
// //                       {route.route_id}
// //                       {index === 0 && " ⭐"}
// //                     </div>
// //                     <div
// //                       style={{
// //                         fontSize: "12px",
// //                         color: "#6b7280",
// //                         marginTop: "4px",
// //                       }}
// //                     >
// //                       📏 {route.total_distance_km} KM
// //                     </div>
// //                     <div
// //                       style={{
// //                         fontSize: "11px",
// //                         color: "#9ca3af",
// //                         marginTop: "2px",
// //                       }}
// //                     >
// //                       🏢 {route.total_touchpoints} touchpoints
// //                     </div>
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {/* Selected Route Details - Only show if not viewing all routes */}
// //           {!showAllRoutes && selectedRoute && (
// //             <div
// //               style={{
// //                 background: "#f9fafb",
// //                 padding: "16px 20px",
// //                 borderRadius: "10px",
// //                 marginBottom: "20px",
// //                 border: "1px solid #e5e7eb",
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "space-between",
// //                   alignItems: "center",
// //                   flexWrap: "wrap",
// //                 }}
// //               >
// //                 <div>
// //                   <strong style={{ fontSize: "16px", color: "#1f2937" }}>
// //                     {selectedRoute.route_id}
// //                   </strong>
// //                   <span
// //                     style={{
// //                       marginLeft: "12px",
// //                       fontSize: "13px",
// //                       color: "#6b7280",
// //                     }}
// //                   >
// //                     {selectedRoute.total_touchpoints} stops
// //                   </span>
// //                 </div>
// //                 <div
// //                   style={{
// //                     padding: "4px 12px",
// //                     borderRadius: "20px",
// //                     background:
// //                       selectedRouteIndex === 0 ? "#d1fae5" : "#fef3c7",
// //                     color: selectedRouteIndex === 0 ? "#065f46" : "#92400e",
// //                     fontSize: "12px",
// //                     fontWeight: "600",
// //                   }}
// //                 >
// //                   {selectedRouteIndex === 0 ? "🏆 Optimal" : "🔄 Alternative"}
// //                 </div>
// //               </div>
// //               <div
// //                 style={{
// //                   marginTop: "8px",
// //                   display: "flex",
// //                   gap: "20px",
// //                   flexWrap: "wrap",
// //                 }}
// //               >
// //                 <span style={{ fontSize: "14px", color: "#374151" }}>
// //                   📏 Total Distance:{" "}
// //                   <strong>{selectedRoute.total_distance_km} KM</strong>
// //                 </span>
// //                 <span style={{ fontSize: "14px", color: "#374151" }}>
// //                   ⏱️ Duration:{" "}
// //                   <strong>{selectedRoute.total_duration_mins} mins</strong>
// //                 </span>
// //                 <span style={{ fontSize: "14px", color: "#374151" }}>
// //                   📍 Stops: <strong>{selectedRoute.total_touchpoints}</strong>
// //                 </span>
// //               </div>
// //               <div style={{ marginTop: "8px" }}>
// //                 <a
// //                   href={selectedRoute.google_maps_driving_link}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   style={{
// //                     color: "#7C3AED",
// //                     textDecoration: "none",
// //                     fontSize: "13px",
// //                     fontWeight: "500",
// //                   }}
// //                 >
// //                   🗺️ Open in Google Maps →
// //                 </a>
// //               </div>
// //             </div>
// //           )}

// //           {/* Routes Summary when viewing all */}
// //           {showAllRoutes && (
// //             <div
// //               style={{
// //                 background: "#f0f9ff",
// //                 padding: "16px 20px",
// //                 borderRadius: "10px",
// //                 marginBottom: "20px",
// //                 border: "1px solid #bae6fd",
// //               }}
// //             >
// //               <h3
// //                 style={{
// //                   fontSize: "14px",
// //                   marginBottom: "12px",
// //                   fontWeight: "600",
// //                 }}
// //               >
// //                 📊 All Routes Summary
// //               </h3>
// //               <div
// //                 style={{
// //                   display: "grid",
// //                   gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
// //                   gap: "12px",
// //                 }}
// //               >
// //                 {routes.map((route, index) => (
// //                   <div
// //                     key={index}
// //                     style={{
// //                       background: "white",
// //                       padding: "12px",
// //                       borderRadius: "8px",
// //                       border: "1px solid #e0e7ff",
// //                     }}
// //                   >
// //                     <div
// //                       style={{
// //                         fontSize: "12px",
// //                         fontWeight: "600",
// //                         color: "#1f2937",
// //                       }}
// //                     >
// //                       {route.route_id} {index === 0 && "⭐"}
// //                     </div>
// //                     <div
// //                       style={{
// //                         fontSize: "11px",
// //                         color: "#6b7280",
// //                         marginTop: "4px",
// //                       }}
// //                     >
// //                       {route.total_touchpoints} stops •{" "}
// //                       {route.total_distance_km} km • {route.total_duration_mins}{" "}
// //                       mins
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {/* Map Display */}
// //           <RouteMap
// //             routeData={{
// //               data: {
// //                 ...routeData.data,
// //                 all_routes: routes,
// //               },
// //               selectedRouteIndex: showAllRoutes
// //                 ? undefined
// //                 : selectedRouteIndex,
// //               totalDistanceKm: selectedRoute?.total_distance_km,
// //             }}
// //             showAllRoutes={showAllRoutes}
// //           />
// //         </div>
// //       )}
// //     </section>
// //   );
// // }

// // export default RoutesPage;
// import { useState } from "react";
// import { fetchRoutes } from "../api";
// import RouteMap from "../components/RouteMap";

// function RoutesPage() {
//   const [routeData, setRouteData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

//   const [showAllRoutes, setShowAllRoutes] = useState(false);

//   // ============================================================
//   // LOAD ROUTES
//   // ============================================================

//   async function handleRefresh() {
//     setError("");
//     setLoading(true);

//     try {
//       const response = await fetchRoutes();

//       console.log("Fetched route data:", response);

//       /*
//         fetchRoutes() now returns:

//         {
//           success: true,
//           message: "...",
//           fc_origin: {...},
//           all_routes: [...]
//         }
//       */

//       if (
//         !response ||
//         response.success !== true ||
//         !Array.isArray(response.all_routes)
//       ) {
//         throw new Error("Invalid route API response: all_routes is missing");
//       }

//       setRouteData(response);
//       setSelectedRouteIndex(0);
//     } catch (err) {
//       console.error("Route API error:", err);

//       setRouteData(null);

//       setError(err?.message || "Failed to load route information.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ============================================================
//   // API DATA
//   // ============================================================

//   const routes = Array.isArray(routeData?.all_routes)
//     ? routeData.all_routes
//     : [];

//   const source = routeData?.fc_origin || null;

//   const selectedRoute = routes[selectedRouteIndex] || null;

//   // ============================================================
//   // RENDER
//   // ============================================================

//   return (
//     <section
//       style={{
//         padding: "20px",
//         maxWidth: "1400px",
//         margin: "0 auto",
//       }}
//     >
//       {/* ======================================================
//           HEADER
//       ====================================================== */}

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: "15px",
//           marginBottom: "20px",
//         }}
//       >
//         <div>
//           <h2
//             style={{
//               fontSize: "28px",
//               margin: 0,
//               color: "#111827",
//             }}
//           >
//             🚚 Route Optimization
//           </h2>

//           <p
//             style={{
//               color: "#6B7280",
//               marginTop: "6px",
//               marginBottom: 0,
//             }}
//           >
//             Optimized delivery routes from the source warehouse covering all
//             required stops.
//           </p>
//         </div>

//         <button
//           onClick={handleRefresh}
//           disabled={loading}
//           style={{
//             padding: "11px 24px",
//             cursor: loading ? "not-allowed" : "pointer",
//             backgroundColor: "#7C3AED",
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             fontWeight: "600",
//             fontSize: "14px",
//             opacity: loading ? 0.7 : 1,
//           }}
//         >
//           {loading ? "⏳ Loading..." : "🔄 Load Routes"}
//         </button>
//       </div>

//       {/* ======================================================
//           ERROR
//       ====================================================== */}

//       {error && (
//         <div
//           style={{
//             color: "#991B1B",
//             background: "#FEF2F2",
//             border: "1px solid #FECACA",
//             padding: "12px 16px",
//             borderRadius: "8px",
//             marginBottom: "20px",
//           }}
//         >
//           {error}
//         </div>
//       )}

//       {/* ======================================================
//           DATA AVAILABLE
//       ====================================================== */}

//       {routeData && routes.length > 0 && (
//         <div>
//           {/* ==================================================
//               WAREHOUSE CARD
//           ================================================== */}

//           <div
//             style={{
//               background: "linear-gradient(135deg, #111827, #374151)",
//               padding: "24px",
//               borderRadius: "12px",
//               marginBottom: "20px",
//               border: "2px solid #4F46E5",
//               color: "white",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap: "20px",
//               }}
//             >
//               <div
//                 style={{
//                   flex: 1,
//                   minWidth: "250px",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "12px",
//                     color: "#A5B4FC",
//                     marginBottom: "5px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   🏭 SOURCE WAREHOUSE
//                 </div>

//                 <h3
//                   style={{
//                     fontSize: "16px",
//                     margin: "0 0 8px",
//                     fontWeight: "700",
//                   }}
//                 >
//                   {source?.name || "Main Warehouse"}
//                 </h3>

//                 <div
//                   style={{
//                     fontSize: "13px",
//                     color: "#D1D5DB",
//                   }}
//                 >
//                   📍{" "}
//                   {source?.latitude != null
//                     ? Number(source.latitude).toFixed(6)
//                     : "-"}{" "}
//                   ,{" "}
//                   {source?.longitude != null
//                     ? Number(source.longitude).toFixed(6)
//                     : "-"}
//                 </div>
//               </div>

//               <div
//                 style={{
//                   display: "flex",
//                   gap: "12px",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <StatCard label="TOTAL ROUTES" value={routes.length} />

//                 <StatCard
//                   label="TOTAL STOPS"
//                   value={routes.reduce(
//                     (sum, route) => sum + Number(route.total_touchpoints || 0),
//                     0,
//                   )}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ==================================================
//               VIEW MODE
//           ================================================== */}

//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "15px",
//               marginBottom: "20px",
//               flexWrap: "wrap",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 gap: "4px",
//                 background: "#F3F4F6",
//                 padding: "4px",
//                 borderRadius: "9px",
//               }}
//             >
//               <button
//                 onClick={() => setShowAllRoutes(false)}
//                 style={{
//                   padding: "9px 17px",
//                   borderRadius: "6px",
//                   border: "none",
//                   cursor: "pointer",
//                   fontWeight: "600",
//                   fontSize: "13px",
//                   background: !showAllRoutes ? "#7C3AED" : "transparent",
//                   color: !showAllRoutes ? "white" : "#6B7280",
//                 }}
//               >
//                 📍 Individual Route
//               </button>

//               <button
//                 onClick={() => setShowAllRoutes(true)}
//                 style={{
//                   padding: "9px 17px",
//                   borderRadius: "6px",
//                   border: "none",
//                   cursor: "pointer",
//                   fontWeight: "600",
//                   fontSize: "13px",
//                   background: showAllRoutes ? "#7C3AED" : "transparent",
//                   color: showAllRoutes ? "white" : "#6B7280",
//                 }}
//               >
//                 🗺️ All Routes
//               </button>
//             </div>

//             <span
//               style={{
//                 color: "#9CA3AF",
//                 fontSize: "13px",
//               }}
//             >
//               {showAllRoutes
//                 ? "Showing all optimized routes with different colors"
//                 : "Select a route to view its path"}
//             </span>
//           </div>

//           {/* ==================================================
//               ROUTE SELECTION
//           ================================================== */}

//           {!showAllRoutes && (
//             <div
//               style={{
//                 marginBottom: "20px",
//               }}
//             >
//               <h3
//                 style={{
//                   fontSize: "18px",
//                   marginBottom: "12px",
//                   color: "#374151",
//                 }}
//               >
//                 📍 Available Routes ({routes.length})
//               </h3>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
//                   gap: "10px",
//                 }}
//               >
//                 {routes.map((route, index) => {
//                   const isSelected = selectedRouteIndex === index;

//                   return (
//                     <button
//                       key={route.route_id || index}
//                       onClick={() => setSelectedRouteIndex(index)}
//                       style={{
//                         padding: "14px",
//                         borderRadius: "10px",
//                         border: isSelected
//                           ? "2px solid #7C3AED"
//                           : "1px solid #E5E7EB",
//                         background: isSelected ? "#F5F3FF" : "white",
//                         cursor: "pointer",
//                         textAlign: "left",
//                         boxShadow: isSelected
//                           ? "0 2px 8px rgba(124,58,237,0.12)"
//                           : "none",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <strong
//                           style={{
//                             color: "#111827",
//                           }}
//                         >
//                           {route.route_id || `Route ${index + 1}`}
//                         </strong>

//                         {index === 0 && <span>⭐</span>}
//                       </div>

//                       <div
//                         style={{
//                           marginTop: "8px",
//                           fontSize: "12px",
//                           color: "#6B7280",
//                         }}
//                       >
//                         📏 {route.total_distance_km ?? 0} km
//                       </div>

//                       <div
//                         style={{
//                           marginTop: "4px",
//                           fontSize: "12px",
//                           color: "#6B7280",
//                         }}
//                       >
//                         ⏱️ {route.total_duration_mins ?? 0} mins
//                       </div>

//                       <div
//                         style={{
//                           marginTop: "4px",
//                           fontSize: "12px",
//                           color: "#6B7280",
//                         }}
//                       >
//                         📍 {route.total_touchpoints ?? 0} stops
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* ==================================================
//               SELECTED ROUTE DETAILS
//           ================================================== */}

//           {!showAllRoutes && selectedRoute && (
//             <div
//               style={{
//                 background: "#F9FAFB",
//                 border: "1px solid #E5E7EB",
//                 borderRadius: "10px",
//                 padding: "16px 20px",
//                 marginBottom: "20px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   gap: "10px",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <div>
//                   <strong
//                     style={{
//                       fontSize: "17px",
//                       color: "#111827",
//                     }}
//                   >
//                     {selectedRoute.route_id}
//                   </strong>

//                   <span
//                     style={{
//                       marginLeft: "12px",
//                       color: "#6B7280",
//                       fontSize: "13px",
//                     }}
//                   >
//                     {selectedRoute.total_touchpoints ?? 0} stops
//                   </span>
//                 </div>

//                 <span
//                   style={{
//                     padding: "5px 12px",
//                     borderRadius: "20px",
//                     background:
//                       selectedRouteIndex === 0 ? "#D1FAE5" : "#FEF3C7",
//                     color: selectedRouteIndex === 0 ? "#065F46" : "#92400E",
//                     fontSize: "12px",
//                     fontWeight: "600",
//                   }}
//                 >
//                   {selectedRouteIndex === 0 ? "🏆 Optimal" : "🔄 Alternative"}
//                 </span>
//               </div>

//               <div
//                 style={{
//                   display: "flex",
//                   gap: "25px",
//                   flexWrap: "wrap",
//                   marginTop: "12px",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: "13px",
//                     color: "#374151",
//                   }}
//                 >
//                   📏 Distance:{" "}
//                   <strong>{selectedRoute.total_distance_km ?? 0} km</strong>
//                 </span>

//                 <span
//                   style={{
//                     fontSize: "13px",
//                     color: "#374151",
//                   }}
//                 >
//                   ⏱️ Duration:{" "}
//                   <strong>{selectedRoute.total_duration_mins ?? 0} mins</strong>
//                 </span>

//                 <span
//                   style={{
//                     fontSize: "13px",
//                     color: "#374151",
//                   }}
//                 >
//                   📍 Stops:{" "}
//                   <strong>{selectedRoute.total_touchpoints ?? 0}</strong>
//                 </span>
//               </div>

//               {selectedRoute.google_maps_driving_link && (
//                 <div
//                   style={{
//                     marginTop: "12px",
//                   }}
//                 >
//                   <a
//                     href={selectedRoute.google_maps_driving_link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                       color: "#7C3AED",
//                       textDecoration: "none",
//                       fontSize: "13px",
//                       fontWeight: "600",
//                     }}
//                   >
//                     🗺️ Open in Google Maps →
//                   </a>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ==================================================
//               ALL ROUTES SUMMARY
//           ================================================== */}

//           {showAllRoutes && (
//             <div
//               style={{
//                 background: "#F0F9FF",
//                 padding: "16px 20px",
//                 borderRadius: "10px",
//                 marginBottom: "20px",
//                 border: "1px solid #BAE6FD",
//               }}
//             >
//               <h3
//                 style={{
//                   fontSize: "15px",
//                   margin: "0 0 12px",
//                   color: "#0F172A",
//                 }}
//               >
//                 📊 All Routes Summary
//               </h3>

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//                   gap: "10px",
//                 }}
//               >
//                 {routes.map((route, index) => (
//                   <div
//                     key={route.route_id || index}
//                     style={{
//                       background: "white",
//                       padding: "12px",
//                       borderRadius: "8px",
//                       border: "1px solid #E0E7FF",
//                     }}
//                   >
//                     <strong
//                       style={{
//                         fontSize: "13px",
//                       }}
//                     >
//                       {route.route_id || `Route ${index + 1}`}{" "}
//                       {index === 0 && "⭐"}
//                     </strong>

//                     <div
//                       style={{
//                         marginTop: "5px",
//                         fontSize: "11px",
//                         color: "#6B7280",
//                       }}
//                     >
//                       {route.total_touchpoints ?? 0} stops •{" "}
//                       {route.total_distance_km ?? 0} km •{" "}
//                       {route.total_duration_mins ?? 0} mins
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* ==================================================
//               GOOGLE MAP
//           ================================================== */}

//           <RouteMap
//             routeData={routeData}
//             selectedRouteIndex={showAllRoutes ? undefined : selectedRouteIndex}
//             showAllRoutes={showAllRoutes}
//           />
//         </div>
//       )}

//       {/* ======================================================
//           EMPTY STATE
//       ====================================================== */}

//       {!loading && !routeData && !error && (
//         <div
//           style={{
//             padding: "60px 20px",
//             textAlign: "center",
//             background: "#F9FAFB",
//             border: "1px dashed #D1D5DB",
//             borderRadius: "12px",
//             color: "#6B7280",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "40px",
//               marginBottom: "10px",
//             }}
//           >
//             🗺️
//           </div>

//           <div
//             style={{
//               fontWeight: "600",
//               color: "#374151",
//             }}
//           >
//             No routes loaded
//           </div>

//           <div
//             style={{
//               fontSize: "13px",
//               marginTop: "5px",
//             }}
//           >
//             Click "Load Routes" to fetch optimized delivery routes.
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// // ============================================================
// // STAT CARD
// // ============================================================

// function StatCard({ label, value }) {
//   return (
//     <div
//       style={{
//         background: "rgba(79, 70, 229, 0.2)",
//         border: "1px solid rgba(129,140,248,0.5)",
//         padding: "12px 20px",
//         borderRadius: "8px",
//         textAlign: "center",
//         minWidth: "100px",
//       }}
//     >
//       <div
//         style={{
//           fontSize: "10px",
//           color: "#A5B4FC",
//           fontWeight: "600",
//         }}
//       >
//         {label}
//       </div>

//       <div
//         style={{
//           fontSize: "24px",
//           fontWeight: "700",
//           color: "#E0E7FF",
//           marginTop: "2px",
//         }}
//       >
//         {value}
//       </div>
//     </div>
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
  const [showAllRoutes, setShowAllRoutes] = useState(false);

  // ============================================================
  // LOAD ROUTES
  // ============================================================

  async function handleRefresh() {
    setError("");
    setLoading(true);

    try {
      const response = await fetchRoutes();
      console.log("Fetched route data:", response);

      if (
        !response ||
        response.success !== true ||
        !Array.isArray(response.all_routes)
      ) {
        throw new Error("Invalid route API response: all_routes is missing");
      }

      setRouteData(response);
      setSelectedRouteIndex(0);
    } catch (err) {
      console.error("Route API error:", err);
      setRouteData(null);
      setError(err?.message || "Failed to load route information.");
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // API DATA
  // ============================================================

  const routes = Array.isArray(routeData?.all_routes)
    ? routeData.all_routes
    : [];
  const source = routeData?.fc_origin || null;
  const selectedRoute = routes[selectedRouteIndex] || null;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      style={{
        padding: "20px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              margin: 0,
              color: "#111827",
            }}
          >
            🚚 Route Optimization
          </h2>
          <p
            style={{
              color: "#6B7280",
              marginTop: "6px",
              marginBottom: 0,
            }}
          >
            Optimized delivery routes from the source warehouse covering all
            required stops.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          style={{
            padding: "11px 24px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: "#7C3AED",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "14px",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.3s",
            boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
          }}
        >
          {loading ? "⏳ Loading..." : "🔄 Load Routes"}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div
          style={{
            color: "#991B1B",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* DATA AVAILABLE */}
      {routeData && routes.length > 0 && (
        <div>
          {/* SOURCE WAREHOUSE CARD */}
          <div
            style={{
              background: "linear-gradient(135deg, #1f2937, #374151)",
              padding: "24px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: "2px solid #4F46E5",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <div style={{ flex: 1, minWidth: "250px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#A5B4FC",
                    marginBottom: "5px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  🏭 SOURCE WAREHOUSE
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    margin: "0 0 8px",
                    fontWeight: "700",
                    color: "#F3F4F6",
                  }}
                >
                  {source?.name || "Main Warehouse"}
                </h3>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#D1D5DB",
                  }}
                >
                  📍{" "}
                  {source?.latitude != null
                    ? Number(source.latitude).toFixed(6)
                    : "-"}{" "}
                  ,{" "}
                  {source?.longitude != null
                    ? Number(source.longitude).toFixed(6)
                    : "-"}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <StatCard label="TOTAL ROUTES" value={routes.length} />
                <StatCard
                  label="TOTAL STOPS"
                  value={routes.reduce(
                    (sum, route) => sum + Number(route.total_touchpoints || 0),
                    0,
                  )}
                />
              </div>
            </div>
          </div>

          {/* VIEW MODE TOGGLE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "4px",
                background: "#F3F4F6",
                padding: "4px",
                borderRadius: "9px",
              }}
            >
              <button
                onClick={() => setShowAllRoutes(false)}
                style={{
                  padding: "9px 17px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  background: !showAllRoutes ? "#7C3AED" : "transparent",
                  color: !showAllRoutes ? "white" : "#6B7280",
                  transition: "all 0.3s",
                }}
              >
                📍 Individual Route
              </button>
              <button
                onClick={() => setShowAllRoutes(true)}
                style={{
                  padding: "9px 17px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  background: showAllRoutes ? "#7C3AED" : "transparent",
                  color: showAllRoutes ? "white" : "#6B7280",
                  transition: "all 0.3s",
                }}
              >
                🗺️ All Routes
              </button>
            </div>
            <span
              style={{
                color: "#9CA3AF",
                fontSize: "13px",
              }}
            >
              {showAllRoutes
                ? "Showing all optimized routes with different colors"
                : "Select a route to view its path"}
            </span>
          </div>

          {/* ROUTE SELECTION - Only show when NOT viewing all routes */}
          {!showAllRoutes && (
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "12px",
                  color: "#374151",
                }}
              >
                📍 Available Routes ({routes.length})
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "10px",
                }}
              >
                {routes.map((route, index) => {
                  const isSelected = selectedRouteIndex === index;
                  return (
                    <button
                      key={route.route_id || index}
                      onClick={() => setSelectedRouteIndex(index)}
                      style={{
                        padding: "14px",
                        borderRadius: "10px",
                        border: isSelected
                          ? "2px solid #7C3AED"
                          : "1px solid #E5E7EB",
                        background: isSelected ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.3s",
                        boxShadow: isSelected
                          ? "0 2px 8px rgba(124,58,237,0.15)"
                          : "0 1px 3px rgba(0,0,0,0.05)",
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <strong
                          style={{
                            color: isSelected ? "#7C3AED" : "#111827",
                            fontSize: "14px",
                          }}
                        >
                          {/* {route.route_id || `Route ${index + 1}`} */}
                          {`Route ${index + 1}`}
                        </strong>
                        {index === 0 && <span>⭐</span>}
                        {isSelected && (
                          <span
                            style={{
                              background: "#7C3AED",
                              color: "white",
                              padding: "2px 10px",
                              borderRadius: "12px",
                              fontSize: "10px",
                              fontWeight: "600",
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#6B7280",
                          display: "flex",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>📏 {route.total_distance_km ?? 0} km</span>
                        <span>⏱️ {route.total_duration_mins ?? 0} mins</span>
                        <span>📍 {route.total_touchpoints ?? 0} stops</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SELECTED ROUTE DETAILS - Only show when NOT viewing all routes */}
          {!showAllRoutes && selectedRoute && (
            <div
              style={{
                background: "#F9FAFB",
                border: `2px solid ${selectedRouteIndex === 0 ? "#7C3AED" : "#F59E0B"}`,
                borderRadius: "10px",
                padding: "16px 20px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong
                    style={{
                      fontSize: "17px",
                      color: "#111827",
                    }}
                  >
                    {/* {selectedRoute.route_id} */}
                  </strong>
                  <span
                    style={{
                      marginLeft: "12px",
                      color: "#6B7280",
                      fontSize: "13px",
                    }}
                  >
                    {selectedRoute.total_touchpoints ?? 0} stops
                  </span>
                </div>
                {/* <span
                  style={{
                    padding: "5px 14px",
                    borderRadius: "20px",
                    background:
                      selectedRouteIndex === 0 ? "#D1FAE5" : "#FEF3C7",
                    color: selectedRouteIndex === 0 ? "#065F46" : "#92400E",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {selectedRouteIndex === 0
                    ? "🏆 Optimal Route"
                    : "🔄 Alternative Route"}
                </span> */}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "25px",
                  flexWrap: "wrap",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #E5E7EB",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                  }}
                >
                  📏 Total Distance:{" "}
                  <strong>{selectedRoute.total_distance_km ?? 0} km</strong>
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                  }}
                >
                  ⏱️ Estimated Duration:{" "}
                  <strong>{selectedRoute.total_duration_mins ?? 0} mins</strong>
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                  }}
                >
                  📍 Number of Stops:{" "}
                  <strong>{selectedRoute.total_touchpoints ?? 0}</strong>
                </span>
              </div>

              {selectedRoute.google_maps_driving_link && (
                <div style={{ marginTop: "12px" }}>
                  <a
                    href={selectedRoute.google_maps_driving_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#7C3AED",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🗺️ Open in Google Maps →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ALL ROUTES SUMMARY */}
          {showAllRoutes && (
            <div
              style={{
                background: "#F0F9FF",
                padding: "16px 20px",
                borderRadius: "10px",
                marginBottom: "20px",
                border: "1px solid #BAE6FD",
              }}
            >
              <h3
                style={{
                  fontSize: "15px",
                  margin: "0 0 12px",
                  color: "#0F172A",
                }}
              >
                📊 All Routes Summary
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {routes.map((route, index) => (
                  <div
                    key={route.route_id || index}
                    style={{
                      background: "white",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `2px solid ${index === 0 ? "#7C3AED" : "#E0E7FF"}`,
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "13px",
                        color: index === 0 ? "#7C3AED" : "#111827",
                      }}
                    >
                      {route.route_id || `Route ${index + 1}`}
                      {index === 0 && " ⭐"}
                    </strong>
                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "11px",
                        color: "#6B7280",
                      }}
                    >
                      {route.total_touchpoints ?? 0} stops •{" "}
                      {route.total_distance_km ?? 0} km •{" "}
                      {route.total_duration_mins ?? 0} mins
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GOOGLE MAP */}
          {/* <RouteMap
            routeData={routeData}
            selectedRouteIndex={showAllRoutes ? undefined : selectedRouteIndex}
            showAllRoutes={showAllRoutes}
          /> */}
          <RouteMap
            routeData={routeData}
            selectedRouteIndex={showAllRoutes ? undefined : selectedRouteIndex}
            showAllRoutes={showAllRoutes}
          />
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !routeData && !error && (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            background: "#F9FAFB",
            border: "1px dashed #D1D5DB",
            borderRadius: "12px",
            color: "#6B7280",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🗺️</div>
          <div style={{ fontWeight: "600", color: "#374151" }}>
            No routes loaded
          </div>
          <div style={{ fontSize: "13px", marginTop: "5px" }}>
            Click "Load Routes" to fetch optimized delivery routes.
          </div>
        </div>
      )}
    </section>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "rgba(79, 70, 229, 0.2)",
        border: "1px solid rgba(129,140,248,0.5)",
        padding: "12px 20px",
        borderRadius: "8px",
        textAlign: "center",
        minWidth: "100px",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          color: "#A5B4FC",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#E0E7FF",
          marginTop: "2px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default RoutesPage;
