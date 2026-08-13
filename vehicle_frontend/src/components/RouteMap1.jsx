// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import {
//   GoogleMap,
//   useJsApiLoader,
//   DirectionsRenderer,
//   MarkerF,
//   InfoWindowF,
// } from "@react-google-maps/api";

// // ============================================================
// // MAP CONFIG
// // ============================================================

// const containerStyle = {
//   width: "100%",
//   height: "650px",
//   borderRadius: "14px",
// };

// const MAP_LIBRARIES = ["places"];

// const DEFAULT_CENTER = {
//   lat: 26.921106,
//   lng: 75.8069855,
// };

// const ROUTE_COLORS = [
//   "#7C3AED",
//   "#2563EB",
//   "#DC2626",
//   "#059669",
//   "#EA580C",
//   "#DB2777",
//   "#0891B2",
//   "#CA8A04",
// ];

// const mapOptions = {
//   streetViewControl: false,
//   mapTypeControl: true,
//   fullscreenControl: true,
//   zoomControl: true,
//   gestureHandling: "greedy",
// };

// // ============================================================
// // COMPONENT
// // ============================================================

// function RouteMap({ routeData, selectedRouteIndex, showAllRoutes = false }) {
//   const mapRef = useRef(null);

//   const [selectedMarker, setSelectedMarker] = useState(null);

//   const [directions, setDirections] = useState({});

//   const [directionsLoading, setDirectionsLoading] = useState(false);

//   const [directionsError, setDirectionsError] = useState("");

//   // ============================================================
//   // GOOGLE MAPS
//   // ============================================================

//   // const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
//   const apiKey = "AIzaSyBtEmyBwz_YotZK8Iabl_nQQldaAtN0jhM";
//   const { isLoaded, loadError } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: apiKey,
//     libraries: MAP_LIBRARIES,
//   });

//   // ============================================================
//   // API DATA
//   // ============================================================

//   const apiData = routeData || {};

//   const routes = Array.isArray(apiData.all_routes) ? apiData.all_routes : [];

//   const source = apiData.fc_origin || null;

//   // ============================================================
//   // SELECTED ROUTE
//   // ============================================================

//   const hasSelectedRoute =
//     !showAllRoutes &&
//     Number.isInteger(Number(selectedRouteIndex)) &&
//     Number(selectedRouteIndex) >= 0 &&
//     Number(selectedRouteIndex) < routes.length;

//   const selectedRoute = hasSelectedRoute
//     ? routes[Number(selectedRouteIndex)]
//     : null;

//   // ============================================================
//   // VISIBLE ROUTES
//   // ============================================================

//   const visibleRoutes = useMemo(() => {
//     if (showAllRoutes) {
//       return routes;
//     }

//     if (!selectedRoute) {
//       return [];
//     }

//     return [selectedRoute];
//   }, [showAllRoutes, routes, selectedRoute]);

//   // ============================================================
//   // POSITION HELPER
//   // ============================================================

//   const getPosition = useCallback((location) => {
//     if (!location) {
//       return null;
//     }

//     const latitude = Number(location.latitude);

//     const longitude = Number(location.longitude);

//     if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
//       return null;
//     }

//     return {
//       lat: latitude,
//       lng: longitude,
//     };
//   }, []);

//   // ============================================================
//   // ALL MAP POINTS
//   // ============================================================

//   const allPoints = useMemo(() => {
//     const points = [];

//     if (source) {
//       const position = getPosition(source);

//       if (position) {
//         points.push(position);
//       }
//     }

//     visibleRoutes.forEach((route) => {
//       if (!Array.isArray(route?.stores)) {
//         return;
//       }

//       route.stores.forEach((store) => {
//         const position = getPosition(store);

//         if (position) {
//           points.push(position);
//         }
//       });
//     });

//     return points;
//   }, [source, visibleRoutes, getPosition]);

//   // ============================================================
//   // FIT MAP
//   // ============================================================

//   const fitMapToBounds = useCallback(() => {
//     if (!mapRef.current || !window.google || !allPoints.length) {
//       return;
//     }

//     const bounds = new window.google.maps.LatLngBounds();

//     allPoints.forEach((point) => {
//       bounds.extend(point);
//     });

//     mapRef.current.fitBounds(bounds, 60);
//   }, [allPoints]);

//   // ============================================================
//   // MAP LOAD
//   // ============================================================

//   const handleMapLoad = useCallback(
//     (map) => {
//       mapRef.current = map;

//       setTimeout(() => {
//         fitMapToBounds();
//       }, 300);
//     },
//     [fitMapToBounds],
//   );

//   // ============================================================
//   // CLEAR DIRECTIONS
//   // ============================================================

//   useEffect(() => {
//     if (!showAllRoutes && !selectedRoute) {
//       setDirections({});
//       setDirectionsLoading(false);
//       setDirectionsError("");
//     }
//   }, [showAllRoutes, selectedRoute]);

//   // ============================================================
//   // GOOGLE DIRECTIONS
//   // ============================================================

//   useEffect(() => {
//     if (!isLoaded || !window.google || !source) {
//       return;
//     }

//     if (!showAllRoutes && !selectedRoute) {
//       return;
//     }

//     if (!visibleRoutes.length) {
//       setDirections({});
//       return;
//     }

//     let cancelled = false;

//     const loadDirections = async () => {
//       setDirectionsLoading(true);
//       setDirectionsError("");

//       const service = new window.google.maps.DirectionsService();

//       const newDirections = {};

//       try {
//         for (let index = 0; index < visibleRoutes.length; index++) {
//           const route = visibleRoutes[index];

//           if (
//             !route ||
//             !Array.isArray(route.stores) ||
//             route.stores.length === 0
//           ) {
//             continue;
//           }

//           const origin = getPosition(source);

//           if (!origin) {
//             continue;
//           }

//           // ------------------------------------------------------
//           // GET STORE POSITIONS
//           // ------------------------------------------------------

//           const storesWithPositions = route.stores
//             .map((store) => ({
//               store,
//               position: getPosition(store),
//             }))
//             .filter((item) => item.position);

//           if (storesWithPositions.length === 0) {
//             continue;
//           }

//           // ------------------------------------------------------
//           // DESTINATION
//           // ------------------------------------------------------

//           let destination = getPosition(route.destination_end);

//           if (!destination) {
//             destination =
//               storesWithPositions[storesWithPositions.length - 1].position;
//           }

//           // ------------------------------------------------------
//           // WAYPOINTS
//           // ------------------------------------------------------

//           let waypointItems;

//           if (route.destination_end) {
//             waypointItems = storesWithPositions;
//           } else {
//             waypointItems = storesWithPositions.slice(0, -1);
//           }

//           // Google Directions waypoint limit
//           const MAX_WAYPOINTS = 20;

//           // ------------------------------------------------------
//           // CHUNK REQUESTS
//           // ------------------------------------------------------

//           let startIndex = 0;

//           while (startIndex < waypointItems.length) {
//             const chunk = waypointItems.slice(
//               startIndex,
//               startIndex + MAX_WAYPOINTS,
//             );

//             const isFirstChunk = startIndex === 0;

//             const isLastChunk =
//               startIndex + MAX_WAYPOINTS >= waypointItems.length;

//             const chunkOrigin = isFirstChunk
//               ? origin
//               : waypointItems[startIndex - 1].position;

//             let chunkDestination;

//             if (isLastChunk) {
//               chunkDestination = destination;
//             } else {
//               chunkDestination = chunk[chunk.length - 1].position;
//             }

//             let chunkWaypoints;

//             if (isLastChunk) {
//               chunkWaypoints = chunk
//                 .filter(
//                   (item) =>
//                     !(
//                       item.position.lat === chunkDestination.lat &&
//                       item.position.lng === chunkDestination.lng
//                     ),
//                 )
//                 .map((item) => ({
//                   location: item.position,
//                   stopover: true,
//                 }));
//             } else {
//               chunkWaypoints = chunk
//                 .slice(0, Math.max(chunk.length - 1, 0))
//                 .map((item) => ({
//                   location: item.position,
//                   stopover: true,
//                 }));
//             }

//             try {
//               const result = await new Promise((resolve, reject) => {
//                 service.route(
//                   {
//                     origin: chunkOrigin,

//                     destination: chunkDestination,

//                     waypoints: chunkWaypoints,

//                     travelMode: window.google.maps.TravelMode.DRIVING,

//                     optimizeWaypoints: false,
//                   },

//                   (response, status) => {
//                     if (
//                       status === window.google.maps.DirectionsStatus.OK &&
//                       response
//                     ) {
//                       resolve(response);
//                     } else {
//                       reject(new Error(`Directions request failed: ${status}`));
//                     }
//                   },
//                 );
//               });

//               if (!cancelled) {
//                 const key = `${route.route_id}-${startIndex}`;

//                 newDirections[key] = {
//                   response: result,

//                   routeId: route.route_id,

//                   routeIndex: routes.findIndex(
//                     (r) => r.route_id === route.route_id,
//                   ),
//                 };
//               }
//             } catch (error) {
//               console.error(
//                 `Failed to load Google directions for ${route.route_id}:`,
//                 error,
//               );

//               if (!cancelled) {
//                 setDirectionsError(
//                   error?.message || "Unable to calculate road route.",
//                 );
//               }
//             }

//             if (isLastChunk) {
//               break;
//             }

//             startIndex += Math.max(chunk.length - 1, 1);
//           }
//         }

//         if (!cancelled) {
//           setDirections(newDirections);
//         }
//       } catch (error) {
//         console.error("Google Directions Error:", error);

//         if (!cancelled) {
//           setDirectionsError(
//             error?.message || "Unable to calculate road route.",
//           );
//         }
//       } finally {
//         if (!cancelled) {
//           setDirectionsLoading(false);
//         }
//       }
//     };

//     loadDirections();

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     isLoaded,
//     source,
//     selectedRoute,
//     showAllRoutes,
//     visibleRoutes,
//     getPosition,
//     routes,
//   ]);

//   // ============================================================
//   // REFIT MAP
//   // ============================================================

//   useEffect(() => {
//     if (!isLoaded || !mapRef.current) {
//       return;
//     }

//     setTimeout(() => {
//       fitMapToBounds();
//     }, 300);
//   }, [
//     isLoaded,
//     showAllRoutes,
//     selectedRouteIndex,
//     visibleRoutes,
//     fitMapToBounds,
//   ]);

//   // ============================================================
//   // CLEAR MARKER
//   // ============================================================

//   useEffect(() => {
//     setSelectedMarker(null);
//   }, [selectedRouteIndex, showAllRoutes]);

//   // ============================================================
//   // GOOGLE MAP LOAD ERROR
//   // ============================================================

//   if (loadError) {
//     return (
//       <div
//         style={{
//           padding: "30px",
//           background: "#FEF2F2",
//           border: "1px solid #FECACA",
//           borderRadius: "12px",
//           color: "#991B1B",
//         }}
//       >
//         <strong>Google Maps failed to load.</strong>

//         <div
//           style={{
//             marginTop: "8px",
//             fontSize: "14px",
//           }}
//         >
//           Please check your Google Maps API key and make sure the Maps
//           JavaScript API and Directions API are enabled.
//         </div>
//       </div>
//     );
//   }

//   // ============================================================
//   // MAP LOADING
//   // ============================================================

//   if (!isLoaded) {
//     return (
//       <div
//         style={{
//           height: "650px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "#F3F4F6",
//           borderRadius: "14px",
//           color: "#6B7280",
//         }}
//       >
//         Loading Google Maps...
//       </div>
//     );
//   }

//   // ============================================================
//   // RETURN
//   // ============================================================

//   return (
//     <div
//       style={{
//         position: "relative",
//         marginTop: "20px",
//       }}
//     >
//       {/* ======================================================
//           HEADER
//       ====================================================== */}

//       <div
//         style={{
//           background: "white",
//           border: "1px solid #E5E7EB",
//           borderBottom: "none",
//           padding: "14px 18px",
//           borderRadius: "14px 14px 0 0",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: "10px",
//         }}
//       >
//         <div>
//           <div
//             style={{
//               fontWeight: "700",
//               fontSize: "16px",
//               color: "#111827",
//             }}
//           >
//             🗺️ Route Map
//           </div>

//           <div
//             style={{
//               fontSize: "12px",
//               color: "#6B7280",
//               marginTop: "3px",
//             }}
//           >
//             {showAllRoutes
//               ? `Showing ${routes.length} optimized routes`
//               : selectedRoute
//                 ? `Showing ${selectedRoute.route_id}`
//                 : "No route selected"}
//           </div>
//         </div>

//         {directionsLoading && (
//           <div
//             style={{
//               fontSize: "12px",
//               color: "#7C3AED",
//               fontWeight: "600",
//             }}
//           >
//             ⏳ Calculating road route...
//           </div>
//         )}
//       </div>

//       {/* ======================================================
//           GOOGLE MAP
//       ====================================================== */}

//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={source ? getPosition(source) || DEFAULT_CENTER : DEFAULT_CENTER}
//         zoom={12}
//         options={mapOptions}
//         onLoad={handleMapLoad}
//         onClick={() => setSelectedMarker(null)}
//       >
//         {/* ====================================================
//             WAREHOUSE MARKER
//         ==================================================== */}

//         {source && getPosition(source) && (
//           <MarkerF
//             position={getPosition(source)}
//             label={{
//               text: "W",
//               color: "white",
//               fontWeight: "700",
//             }}
//             icon={{
//               path: window.google.maps.SymbolPath.CIRCLE,
//               scale: 12,
//               fillColor: "#111827",
//               fillOpacity: 1,
//               strokeColor: "#FFFFFF",
//               strokeWeight: 3,
//             }}
//             zIndex={1000}
//             onClick={() =>
//               setSelectedMarker({
//                 type: "source",
//                 data: source,
//               })
//             }
//           />
//         )}

//         {/* ====================================================
//             WAREHOUSE INFO
//         ==================================================== */}

//         {selectedMarker?.type === "source" && (
//           <InfoWindowF
//             position={getPosition(selectedMarker.data)}
//             onCloseClick={() => setSelectedMarker(null)}
//           >
//             <div
//               style={{
//                 maxWidth: "280px",
//                 padding: "4px",
//               }}
//             >
//               <div
//                 style={{
//                   fontWeight: "700",
//                   fontSize: "15px",
//                   color: "#111827",
//                   marginBottom: "6px",
//                 }}
//               >
//                 🏭 Source Warehouse
//               </div>

//               <div
//                 style={{
//                   fontSize: "13px",
//                   color: "#374151",
//                   lineHeight: "1.5",
//                 }}
//               >
//                 {selectedMarker.data.name || "Warehouse"}
//               </div>

//               <div
//                 style={{
//                   marginTop: "6px",
//                   fontSize: "11px",
//                   color: "#6B7280",
//                 }}
//               >
//                 {Number(selectedMarker.data.latitude).toFixed(6)},{" "}
//                 {Number(selectedMarker.data.longitude).toFixed(6)}
//               </div>
//             </div>
//           </InfoWindowF>
//         )}

//         {/* ====================================================
//             STORE MARKERS
//         ==================================================== */}

//         {visibleRoutes.map((route) => {
//           const actualRouteIndex = routes.findIndex(
//             (r) => r.route_id === route.route_id,
//           );

//           const color = ROUTE_COLORS[actualRouteIndex % ROUTE_COLORS.length];

//           return route.stores?.map((store) => {
//             const position = getPosition(store);

//             if (!position) {
//               return null;
//             }

//             return (
//               <MarkerF
//                 key={`${route.route_id}-${store.store_id}`}
//                 position={position}
//                 label={{
//                   text: String(store.stop_number ?? ""),
//                   color: "white",
//                   fontSize: "11px",
//                   fontWeight: "700",
//                 }}
//                 icon={{
//                   path: window.google.maps.SymbolPath.CIRCLE,
//                   scale: 11,
//                   fillColor: color,
//                   fillOpacity: 1,
//                   strokeColor: "white",
//                   strokeWeight: 2,
//                 }}
//                 onClick={() =>
//                   setSelectedMarker({
//                     type: "store",
//                     data: store,
//                     route,
//                     color,
//                   })
//                 }
//               />
//             );
//           });
//         })}

//         {/* ====================================================
//             STORE INFO WINDOW
//         ==================================================== */}

//         {selectedMarker?.type === "store" && (
//           <InfoWindowF
//             position={getPosition(selectedMarker.data)}
//             onCloseClick={() => setSelectedMarker(null)}
//           >
//             <div
//               style={{
//                 minWidth: "240px",
//                 maxWidth: "300px",
//                 padding: "4px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   marginBottom: "8px",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "26px",
//                     height: "26px",
//                     borderRadius: "50%",
//                     background: selectedMarker.color,
//                     color: "white",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontWeight: "700",
//                     fontSize: "12px",
//                   }}
//                 >
//                   {selectedMarker.data.stop_number}
//                 </div>

//                 <div>
//                   <div
//                     style={{
//                       fontWeight: "700",
//                       fontSize: "14px",
//                       color: "#111827",
//                     }}
//                   >
//                     {selectedMarker.data.store_name}
//                   </div>

//                   <div
//                     style={{
//                       fontSize: "11px",
//                       color: "#6B7280",
//                     }}
//                   >
//                     Route: {selectedMarker.route.route_id}
//                   </div>
//                 </div>
//               </div>

//               <div
//                 style={{
//                   fontSize: "12px",
//                   color: "#374151",
//                   lineHeight: "1.6",
//                 }}
//               >
//                 <div>
//                   <strong>Store ID:</strong> {selectedMarker.data.store_id}
//                 </div>

//                 <div>
//                   <strong>Stop:</strong> {selectedMarker.data.stop_number}
//                 </div>

//                 <div>
//                   <strong>Latitude:</strong>{" "}
//                   {Number(selectedMarker.data.latitude).toFixed(6)}
//                 </div>

//                 <div>
//                   <strong>Longitude:</strong>{" "}
//                   {Number(selectedMarker.data.longitude).toFixed(6)}
//                 </div>
//               </div>
//             </div>
//           </InfoWindowF>
//         )}

//         {/* ====================================================
//             GOOGLE ROAD ROUTES
//         ==================================================== */}

//         {Object.entries(directions).map(([key, directionData]) => {
//           if (!directionData?.response) {
//             return null;
//           }

//           const actualRouteIndex =
//             directionData.routeIndex >= 0 ? directionData.routeIndex : 0;

//           const color = ROUTE_COLORS[actualRouteIndex % ROUTE_COLORS.length];

//           return (
//             <DirectionsRenderer
//               key={`directions-${key}`}
//               directions={directionData.response}
//               options={{
//                 suppressMarkers: true,

//                 polylineOptions: {
//                   strokeColor: color,

//                   strokeOpacity: showAllRoutes ? 0.75 : 0.9,

//                   strokeWeight: showAllRoutes ? 5 : 6,

//                   zIndex: showAllRoutes ? actualRouteIndex : 100,
//                 },
//               }}
//             />
//           );
//         })}
//       </GoogleMap>

//       {/* ======================================================
//           NO ROUTE SELECTED
//       ====================================================== */}

//       {!showAllRoutes && !selectedRoute && (
//         <div
//           style={{
//             position: "absolute",
//             top: "95px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             background: "rgba(255,255,255,0.96)",
//             border: "1px solid #E5E7EB",
//             borderRadius: "10px",
//             padding: "10px 16px",
//             boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
//             zIndex: 5,
//             color: "#6B7280",
//             fontSize: "13px",
//             fontWeight: "600",
//           }}
//         >
//           No route selected
//         </div>
//       )}

//       {/* ======================================================
//           ROUTE LEGEND
//       ====================================================== */}

//       <div
//         style={{
//           position: "absolute",
//           bottom: "25px",
//           left: "15px",
//           background: "rgba(255,255,255,0.96)",
//           borderRadius: "10px",
//           padding: "12px 14px",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
//           maxWidth: "280px",
//           zIndex: 10,
//         }}
//       >
//         <div
//           style={{
//             fontSize: "12px",
//             fontWeight: "700",
//             color: "#111827",
//             marginBottom: "8px",
//           }}
//         >
//           Route Legend
//         </div>

//         {/* Warehouse */}

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             marginBottom: "7px",
//           }}
//         >
//           <div
//             style={{
//               width: "16px",
//               height: "16px",
//               borderRadius: "50%",
//               background: "#111827",
//               border: "2px solid white",
//               boxShadow: "0 0 0 1px #111827",
//             }}
//           />

//           <span
//             style={{
//               fontSize: "11px",
//               color: "#374151",
//             }}
//           >
//             Warehouse
//           </span>
//         </div>

//         {!showAllRoutes && !selectedRoute && (
//           <div
//             style={{
//               fontSize: "11px",
//               color: "#9CA3AF",
//               marginTop: "5px",
//             }}
//           >
//             Select a route to view the road path.
//           </div>
//         )}

//         {visibleRoutes.map((route) => {
//           const actualRouteIndex = routes.findIndex(
//             (r) => r.route_id === route.route_id,
//           );

//           const color = ROUTE_COLORS[actualRouteIndex % ROUTE_COLORS.length];

//           return (
//             <div
//               key={`legend-${route.route_id}`}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 marginBottom: "6px",
//               }}
//             >
//               <div
//                 style={{
//                   width: "25px",
//                   height: "4px",
//                   background: color,
//                   borderRadius: "4px",
//                 }}
//               />

//               <span
//                 style={{
//                   fontSize: "11px",
//                   color: "#374151",
//                 }}
//               >
//                 {route.route_id} — {route.total_distance_km ?? 0} km
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* ======================================================
//           BOTTOM STATUS
//       ====================================================== */}

//       <div
//         style={{
//           background: "#FFFFFF",
//           border: "1px solid #E5E7EB",
//           borderTop: "none",
//           padding: "12px 18px",
//           borderRadius: "0 0 14px 14px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           flexWrap: "wrap",
//           gap: "10px",
//         }}
//       >
//         <div
//           style={{
//             fontSize: "13px",
//             color: "#475569",
//           }}
//         >
//           {showAllRoutes ? (
//             <>
//               <strong>{routes.length}</strong> routes available
//             </>
//           ) : selectedRoute ? (
//             <>
//               <strong>{selectedRoute.route_id}</strong> selected
//             </>
//           ) : (
//             <strong
//               style={{
//                 color: "#6B7280",
//               }}
//             >
//               No route selected
//             </strong>
//           )}
//         </div>

//         <div
//           style={{
//             fontSize: "12px",
//           }}
//         >
//           {directionsLoading ? (
//             <strong
//               style={{
//                 color: "#7C3AED",
//               }}
//             >
//               🚗 Calculating road route...
//             </strong>
//           ) : !showAllRoutes && !selectedRoute ? (
//             <strong
//               style={{
//                 color: "#9CA3AF",
//               }}
//             >
//               Select a route to display road directions
//             </strong>
//           ) : directionsError ? (
//             <strong
//               style={{
//                 color: "#DC2626",
//               }}
//             >
//               ⚠️ Road route unavailable
//             </strong>
//           ) : (
//             <strong
//               style={{
//                 color: "#16A34A",
//               }}
//             >
//               ✓ Google road directions
//             </strong>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

// ============================================================
// MAP CONFIG
// ============================================================

const containerStyle = {
  width: "100%",
  height: "650px",
  borderRadius: "14px",
};

const MAP_LIBRARIES = ["places"];

const DEFAULT_CENTER = {
  lat: 26.921106,
  lng: 75.8069855,
};

const ROUTE_COLORS = [
  "#7C3AED",
  "#2563EB",
  "#DC2626",
  "#059669",
  "#EA580C",
  "#DB2777",
  "#0891B2",
  "#CA8A04",
];

const mapOptions = {
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  zoomControl: true,
  gestureHandling: "greedy",
};

// ============================================================
// COMPONENT
// ============================================================

function RouteMap({ routeData, selectedRouteIndex, showAllRoutes = false }) {
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directions, setDirections] = useState({});
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [directionsError, setDirectionsError] = useState("");

  // ============================================================
  // GOOGLE MAPS
  // ============================================================

  const apiKey = "AIzaSyBtEmyBwz_YotZK8Iabl_nQQldaAtN0jhM";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: MAP_LIBRARIES,
  });

  // ============================================================
  // API DATA
  // ============================================================

  const apiData = routeData || {};
  const routes = Array.isArray(apiData.all_routes) ? apiData.all_routes : [];
  const source = apiData.fc_origin || null;

  // ============================================================
  // SELECTED ROUTE - FIXED
  // ============================================================

  // Get the selected route based on selectedRouteIndex
  const selectedRoute = useMemo(() => {
    // If showAllRoutes is true, return null (we'll show all routes)
    if (showAllRoutes) {
      return null;
    }

    // If selectedRouteIndex is undefined or null, return null
    if (selectedRouteIndex === undefined || selectedRouteIndex === null) {
      return null;
    }

    // Convert to number and validate
    const index = Number(selectedRouteIndex);
    if (isNaN(index) || index < 0 || index >= routes.length) {
      return null;
    }

    // Return the specific route at that index
    return routes[index];
  }, [showAllRoutes, selectedRouteIndex, routes]);

  // ============================================================
  // VISIBLE ROUTES - FIXED: Only show selected route in individual mode
  // ============================================================

  const visibleRoutes = useMemo(() => {
    // If showing all routes, return all routes
    if (showAllRoutes) {
      return routes;
    }

    // If we have a selected route, return ONLY that route
    if (selectedRoute) {
      return [selectedRoute];
    }

    // No route selected
    return [];
  }, [showAllRoutes, routes, selectedRoute]);

  // ============================================================
  // POSITION HELPER
  // ============================================================

  const getPosition = useCallback((location) => {
    if (!location) return null;

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return null;
    }

    return { lat: latitude, lng: longitude };
  }, []);

  // ============================================================
  // ALL MAP POINTS - Only from visible routes
  // ============================================================

  const allPoints = useMemo(() => {
    const points = [];

    if (source) {
      const position = getPosition(source);
      if (position) points.push(position);
    }

    visibleRoutes.forEach((route) => {
      if (!Array.isArray(route?.stores)) return;

      route.stores.forEach((store) => {
        const position = getPosition(store);
        if (position) points.push(position);
      });
    });

    return points;
  }, [source, visibleRoutes, getPosition]);

  // ============================================================
  // FIT MAP
  // ============================================================

  const fitMapToBounds = useCallback(() => {
    if (!mapRef.current || !window.google || !allPoints.length) return;

    const bounds = new window.google.maps.LatLngBounds();
    allPoints.forEach((point) => {
      bounds.extend(point);
    });

    mapRef.current.fitBounds(bounds, 60);
  }, [allPoints]);

  // ============================================================
  // MAP LOAD
  // ============================================================

  const handleMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      setTimeout(() => {
        fitMapToBounds();
      }, 300);
    },
    [fitMapToBounds],
  );

  // ============================================================
  // CLEAR DIRECTIONS when route changes
  // ============================================================

  useEffect(() => {
    if (!showAllRoutes && !selectedRoute) {
      setDirections({});
      setDirectionsLoading(false);
      setDirectionsError("");
    }
  }, [showAllRoutes, selectedRoute]);

  // ============================================================
  // GOOGLE DIRECTIONS - FIXED: Only fetch for visible routes
  // ============================================================

  useEffect(() => {
    // Don't run if Google Maps not loaded
    if (!isLoaded || !window.google || !source) return;

    // If no visible routes, clear directions
    if (!visibleRoutes.length) {
      setDirections({});
      setDirectionsLoading(false);
      return;
    }

    let cancelled = false;

    const loadDirections = async () => {
      setDirectionsLoading(true);
      setDirectionsError("");

      const service = new window.google.maps.DirectionsService();
      const newDirections = {};

      try {
        // Process ONLY visible routes
        for (let index = 0; index < visibleRoutes.length; index++) {
          const route = visibleRoutes[index];

          if (
            !route ||
            !Array.isArray(route.stores) ||
            route.stores.length === 0
          ) {
            continue;
          }

          const origin = getPosition(source);
          if (!origin) continue;

          // Get store positions
          const storesWithPositions = route.stores
            .map((store) => ({
              store,
              position: getPosition(store),
            }))
            .filter((item) => item.position);

          if (storesWithPositions.length === 0) continue;

          // Get destination
          let destination = getPosition(route.destination_end);
          if (!destination) {
            destination =
              storesWithPositions[storesWithPositions.length - 1].position;
          }

          // Waypoints
          let waypointItems;
          if (route.destination_end) {
            waypointItems = storesWithPositions;
          } else {
            waypointItems = storesWithPositions.slice(0, -1);
          }

          const MAX_WAYPOINTS = 20;
          let startIndex = 0;

          while (startIndex < waypointItems.length) {
            const chunk = waypointItems.slice(
              startIndex,
              startIndex + MAX_WAYPOINTS,
            );
            const isFirstChunk = startIndex === 0;
            const isLastChunk =
              startIndex + MAX_WAYPOINTS >= waypointItems.length;

            const chunkOrigin = isFirstChunk
              ? origin
              : waypointItems[startIndex - 1].position;
            let chunkDestination;

            if (isLastChunk) {
              chunkDestination = destination;
            } else {
              chunkDestination = chunk[chunk.length - 1].position;
            }

            let chunkWaypoints;
            if (isLastChunk) {
              chunkWaypoints = chunk
                .filter(
                  (item) =>
                    !(
                      item.position.lat === chunkDestination.lat &&
                      item.position.lng === chunkDestination.lng
                    ),
                )
                .map((item) => ({
                  location: item.position,
                  stopover: true,
                }));
            } else {
              chunkWaypoints = chunk
                .slice(0, Math.max(chunk.length - 1, 0))
                .map((item) => ({
                  location: item.position,
                  stopover: true,
                }));
            }

            try {
              const result = await new Promise((resolve, reject) => {
                service.route(
                  {
                    origin: chunkOrigin,
                    destination: chunkDestination,
                    waypoints: chunkWaypoints,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    optimizeWaypoints: false,
                  },
                  (response, status) => {
                    if (
                      status === window.google.maps.DirectionsStatus.OK &&
                      response
                    ) {
                      resolve(response);
                    } else {
                      reject(new Error(`Directions request failed: ${status}`));
                    }
                  },
                );
              });

              if (!cancelled) {
                const key = `${route.route_id}-${startIndex}`;
                const routeIndex = routes.findIndex(
                  (r) => r.route_id === route.route_id,
                );
                newDirections[key] = {
                  response: result,
                  routeId: route.route_id,
                  routeIndex: routeIndex >= 0 ? routeIndex : 0,
                };
              }
            } catch (error) {
              console.error(
                `Failed to load Google directions for ${route.route_id}:`,
                error,
              );
              if (!cancelled) {
                setDirectionsError(
                  error?.message || "Unable to calculate road route.",
                );
              }
            }

            if (isLastChunk) break;
            startIndex += Math.max(chunk.length - 1, 1);
          }
        }

        if (!cancelled) {
          setDirections(newDirections);
        }
      } catch (error) {
        console.error("Google Directions Error:", error);
        if (!cancelled) {
          setDirectionsError(
            error?.message || "Unable to calculate road route.",
          );
        }
      } finally {
        if (!cancelled) {
          setDirectionsLoading(false);
        }
      }
    };

    loadDirections();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, source, visibleRoutes, getPosition, routes]);

  // ============================================================
  // REFIT MAP
  // ============================================================

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    setTimeout(() => {
      fitMapToBounds();
    }, 300);
  }, [isLoaded, visibleRoutes, fitMapToBounds]);

  // ============================================================
  // CLEAR MARKER
  // ============================================================

  useEffect(() => {
    setSelectedMarker(null);
  }, [selectedRouteIndex, showAllRoutes]);

  // ============================================================
  // GOOGLE MAP LOAD ERROR
  // ============================================================

  if (loadError) {
    return (
      <div
        style={{
          padding: "30px",
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: "12px",
          color: "#991B1B",
        }}
      >
        <strong>Google Maps failed to load.</strong>
        <div style={{ marginTop: "8px", fontSize: "14px" }}>
          Please check your Google Maps API key and make sure the Maps
          JavaScript API and Directions API are enabled.
        </div>
      </div>
    );
  }

  // ============================================================
  // MAP LOADING
  // ============================================================

  if (!isLoaded) {
    return (
      <div
        style={{
          height: "650px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F3F4F6",
          borderRadius: "14px",
          color: "#6B7280",
        }}
      >
        Loading Google Maps...
      </div>
    );
  }

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div style={{ position: "relative", marginTop: "20px" }}>
      {/* HEADER */}
      <div
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
          borderBottom: "none",
          padding: "14px 18px",
          borderRadius: "14px 14px 0 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <div
            style={{ fontWeight: "700", fontSize: "16px", color: "#111827" }}
          >
            🗺️ Route Map
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "3px" }}>
            {showAllRoutes
              ? `Showing ${routes.length} optimized routes`
              : selectedRoute
                ? `Showing ${selectedRoute.route_id}`
                : "No route selected"}
          </div>
        </div>
        {directionsLoading && (
          <div
            style={{ fontSize: "12px", color: "#7C3AED", fontWeight: "600" }}
          >
            ⏳ Calculating road route...
          </div>
        )}
      </div>

      {/* GOOGLE MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={source ? getPosition(source) || DEFAULT_CENTER : DEFAULT_CENTER}
        zoom={12}
        options={mapOptions}
        onLoad={handleMapLoad}
        onClick={() => setSelectedMarker(null)}
      >
        {/* WAREHOUSE MARKER */}
        {source && getPosition(source) && (
          <MarkerF
            position={getPosition(source)}
            label={{
              text: "W",
              color: "white",
              fontWeight: "700",
            }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: "#111827",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 3,
            }}
            zIndex={1000}
            onClick={() =>
              setSelectedMarker({
                type: "source",
                data: source,
              })
            }
          />
        )}

        {/* WAREHOUSE INFO */}
        {selectedMarker?.type === "source" && (
          <InfoWindowF
            position={getPosition(selectedMarker.data)}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div style={{ maxWidth: "280px", padding: "4px" }}>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "15px",
                  color: "#111827",
                  marginBottom: "6px",
                }}
              >
                🏭 Source Warehouse
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  lineHeight: "1.5",
                }}
              >
                {selectedMarker.data.name || "Warehouse"}
              </div>
              <div
                style={{ marginTop: "6px", fontSize: "11px", color: "#6B7280" }}
              >
                {Number(selectedMarker.data.latitude).toFixed(6)},{" "}
                {Number(selectedMarker.data.longitude).toFixed(6)}
              </div>
            </div>
          </InfoWindowF>
        )}

        {/* STORE MARKERS - Only for visible routes */}
        {visibleRoutes.map((route) => {
          const actualRouteIndex = routes.findIndex(
            (r) => r.route_id === route.route_id,
          );
          const color =
            ROUTE_COLORS[
              actualRouteIndex >= 0 ? actualRouteIndex % ROUTE_COLORS.length : 0
            ];

          return route.stores?.map((store) => {
            const position = getPosition(store);
            if (!position) return null;

            return (
              <MarkerF
                key={`${route.route_id}-${store.store_id}`}
                position={position}
                label={{
                  text: String(store.stop_number ?? ""),
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 11,
                  fillColor: color,
                  fillOpacity: 1,
                  strokeColor: "white",
                  strokeWeight: 2,
                }}
                onClick={() =>
                  setSelectedMarker({
                    type: "store",
                    data: store,
                    route,
                    color,
                  })
                }
              />
            );
          });
        })}

        {/* STORE INFO WINDOW */}
        {selectedMarker?.type === "store" && (
          <InfoWindowF
            position={getPosition(selectedMarker.data)}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div
              style={{ minWidth: "240px", maxWidth: "300px", padding: "4px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: selectedMarker.color,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "12px",
                  }}
                >
                  {selectedMarker.data.stop_number}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  >
                    {selectedMarker.data.store_name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6B7280" }}>
                    Route: {selectedMarker.route.route_id}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#374151",
                  lineHeight: "1.6",
                }}
              >
                <div>
                  <strong>Store ID:</strong> {selectedMarker.data.store_id}
                </div>
                <div>
                  <strong>Stop:</strong> {selectedMarker.data.stop_number}
                </div>
                <div>
                  <strong>Latitude:</strong>{" "}
                  {Number(selectedMarker.data.latitude).toFixed(6)}
                </div>
                <div>
                  <strong>Longitude:</strong>{" "}
                  {Number(selectedMarker.data.longitude).toFixed(6)}
                </div>
              </div>
            </div>
          </InfoWindowF>
        )}

        {/* GOOGLE ROAD ROUTES - Only for visible routes */}
        {Object.entries(directions).map(([key, directionData]) => {
          if (!directionData?.response) return null;

          const actualRouteIndex =
            directionData.routeIndex >= 0 ? directionData.routeIndex : 0;
          const color = ROUTE_COLORS[actualRouteIndex % ROUTE_COLORS.length];

          return (
            <DirectionsRenderer
              key={`directions-${key}`}
              directions={directionData.response}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: color,
                  strokeOpacity: showAllRoutes ? 0.75 : 0.9,
                  strokeWeight: showAllRoutes ? 5 : 6,
                  zIndex: showAllRoutes ? actualRouteIndex : 100,
                },
              }}
            />
          );
        })}
      </GoogleMap>

      {/* NO ROUTE SELECTED */}
      {!showAllRoutes && !selectedRoute && (
        <div
          style={{
            position: "absolute",
            top: "95px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.96)",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "10px 16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
            zIndex: 5,
            color: "#6B7280",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          No route selected
        </div>
      )}

      {/* ROUTE LEGEND - Only shows visible routes */}
      <div
        style={{
          position: "absolute",
          bottom: "25px",
          left: "15px",
          background: "rgba(255,255,255,0.96)",
          borderRadius: "10px",
          padding: "12px 14px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          maxWidth: "280px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          Route Legend
        </div>

        {/* Warehouse */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "7px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#111827",
              border: "2px solid white",
              boxShadow: "0 0 0 1px #111827",
            }}
          />
          <span style={{ fontSize: "11px", color: "#374151" }}>Warehouse</span>
        </div>

        {!showAllRoutes && !selectedRoute && (
          <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "5px" }}>
            Select a route to view the road path.
          </div>
        )}

        {/* Show ONLY visible routes in legend */}
        {visibleRoutes.map((route) => {
          const actualRouteIndex = routes.findIndex(
            (r) => r.route_id === route.route_id,
          );
          const color =
            ROUTE_COLORS[
              actualRouteIndex >= 0 ? actualRouteIndex % ROUTE_COLORS.length : 0
            ];

          return (
            <div
              key={`legend-${route.route_id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  width: "25px",
                  height: "4px",
                  background: color,
                  borderRadius: "4px",
                }}
              />
              <span style={{ fontSize: "11px", color: "#374151" }}>
                {route.route_id} — {route.total_distance_km ?? 0} km
              </span>
            </div>
          );
        })}
      </div>

      {/* BOTTOM STATUS */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderTop: "none",
          padding: "12px 18px",
          borderRadius: "0 0 14px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ fontSize: "13px", color: "#475569" }}>
          {showAllRoutes ? (
            <>
              <strong>{routes.length}</strong> routes available
            </>
          ) : selectedRoute ? (
            <>
              <strong>{selectedRoute.route_id}</strong> selected
            </>
          ) : (
            <strong style={{ color: "#6B7280" }}>No route selected</strong>
          )}
        </div>

        <div style={{ fontSize: "12px" }}>
          {directionsLoading ? (
            <strong style={{ color: "#7C3AED" }}>
              🚗 Calculating road route...
            </strong>
          ) : !showAllRoutes && !selectedRoute ? (
            <strong style={{ color: "#9CA3AF" }}>
              Select a route to display road directions
            </strong>
          ) : directionsError ? (
            <strong style={{ color: "#DC2626" }}>
              ⚠️ Road route unavailable
            </strong>
          ) : (
            <strong style={{ color: "#16A34A" }}>
              ✓ Google road directions
            </strong>
          )}
        </div>
      </div>
    </div>
  );
}

export default RouteMap;
