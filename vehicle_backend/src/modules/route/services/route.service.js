const axios = require("axios");
const { Warehouse } = require("../../../core/models");

class RouteService {
  /**
   * Geocoding Fallback: Jab DB me Latitude/Longitude missing ya null ho
   */
  async getLatLngFromAddress(address, apiKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address,
      )}&key=${apiKey}`;
      const response = await axios.get(url);
      if (response.data.status === "OK") {
        const loc = response.data.results[0].geometry.location;
        return { latitude: loc.lat, longitude: loc.lng };
      }
    } catch (error) {
      console.error(`Geocoding error for address: ${address}`, error.message);
    }
    return null;
  }

  /**
   * Geographic Clustering Logic: Stores ko 5 groups (~6 stores each) me baanta hai
   */
  // clusterStoresIntoRoutes(stores, numRoutes = 5) {
  //   const clusters = Array.from({ length: numRoutes }, () => []);

  //   // Geographical sorting (lat/lng sweep)
  //   const sortedStores = [...stores].sort((a, b) => {
  //     return a.latitude - b.latitude || a.longitude - b.longitude;
  //   });

  //   const itemsPerCluster = Math.ceil(sortedStores.length / numRoutes);

  //   sortedStores.forEach((store, index) => {
  //     const clusterIndex = Math.min(
  //       Math.floor(index / itemsPerCluster),
  //       numRoutes - 1,
  //     );
  //     clusters[clusterIndex].push(store);
  //   });

  //   return clusters;
  // }
  clusterStoresIntoRoutes(stores, maxStoresPerRoute = 7) {
    // Geographical sorting (lat/lng sweep)
    const sortedStores = [...stores].sort((a, b) => {
      return a.latitude - b.latitude || a.longitude - b.longitude;
    });

    const clusters = [];
    for (let i = 0; i < sortedStores.length; i += maxStoresPerRoute) {
      clusters.push(sortedStores.slice(i, i + maxStoresPerRoute));
    }

    return clusters;
  }

  /**
   * Main Execution: Route Optimization & Single Shortest Path Extraction
   */
  async calculateOptimalRoute() {
    // Fulfillment Center / Source Point
    const source = {
      id: 0,
      name: "Tata 1mg Plot No. A-188(a), Road. 6-D,, Vishwakarma Industrial Area, Jaipur, Rajasthan, 302013",
      latitude: 26.921106,
      longitude: 75.8069855,
      isSource: true,
    };

    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleApiKey) {
      throw new Error(
        "GOOGLE_MAPS_API_KEY is missing in environment variables.",
      );
    }

    // 1. Database se warehouses fetch karein
    const warehouses = await Warehouse.findAll({
      attributes: ["id", "name", "address", "latitude", "longitude"],
      raw: true,
    });

    if (!warehouses || !warehouses.length) {
      throw new Error("No warehouses found in database.");
    }

    // 2. Validate coordinates / Geocode fallback
    const validStores = [];
    for (const store of warehouses) {
      let lat = parseFloat(store.latitude);
      let lng = parseFloat(store.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        const geoLoc = await this.getLatLngFromAddress(
          store.address || store.name,
          googleApiKey,
        );
        if (geoLoc) {
          lat = geoLoc.latitude;
          lng = geoLoc.longitude;
        } else {
          continue;
        }
      }

      validStores.push({
        id: store.id,
        name: store.name,
        latitude: lat,
        longitude: lng,
      });
    }

    // 3. Cluster Stores (5 Groups)
    const storeClusters = this.clusterStoresIntoRoutes(validStores, 7);
    const calculatedRoutes = [];

    // 4. Calculate Driving Sequences using Google Directions API
    for (let i = 0; i < storeClusters.length; i++) {
      const cluster = storeClusters[i];
      if (!cluster.length) continue;

      const originStr = `${source.latitude},${source.longitude}`;
      const waypointsStr = cluster
        .map((s) => `${s.latitude},${s.longitude}`)
        .join("|");

      // Request Google Directions API with optimize:true flag for shortest road sequence
      const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${originStr}&waypoints=optimize:true|${waypointsStr}&mode=driving&key=${googleApiKey}`;

      const response = await axios.get(directionsUrl);

      if (response.data.status === "OK") {
        const routeData = response.data.routes[0];
        const waypointOrder = routeData.waypoint_order || [];

        // Sum up leg distances & duration
        let totalMeters = 0;
        let totalDurationSeconds = 0;
        routeData.legs.forEach((leg) => {
          totalMeters += leg.distance.value;
          totalDurationSeconds += leg.duration.value;
        });

        const totalKm = parseFloat((totalMeters / 1000).toFixed(2));

        // Re-order stores according to Google's optimized TSP sequence
        const optimizedStores = waypointOrder.map(
          (orderIndex) => cluster[orderIndex],
        );

        // Highlighted Source, Waypoints & Destination Navigation Link
        const sortedWaypointsStr = optimizedStores
          .map((s) => `${s.latitude},${s.longitude}`)
          .join("|");

        // Universal Google Maps Driving Link (Source Point Start -> Stores -> Source Return)
        const googleMapsDrivingUrl = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${originStr}&waypoints=${sortedWaypointsStr}&travelmode=driving`;

        calculatedRoutes.push({
          route_id: `Route_${i + 1}`,
          total_touchpoints: optimizedStores.length,
          total_distance_km: totalKm,
          slot_1_approx_km: parseFloat((totalKm / 2).toFixed(2)),
          slot_2_approx_km: parseFloat((totalKm / 2).toFixed(2)),
          total_duration_mins: Math.round(totalDurationSeconds / 60),
          google_maps_driving_link: googleMapsDrivingUrl,
          source_origin: source,
          destination_end: source,
          stores: optimizedStores.map((store, stopIndex) => ({
            stop_number: stopIndex + 1,
            store_id: store.id,
            store_name: store.name,
            latitude: store.latitude,
            longitude: store.longitude,
          })),
        });
      }
    }

    if (!calculatedRoutes.length) {
      throw new Error("Unable to calculate driving routes.");
    }

    // 5. Shortest Route Selection Logic
    // Sort routes by total distance ascending (Index 0 will be the absolute shortest)
    calculatedRoutes.sort((a, b) => a.total_distance_km - b.total_distance_km);

    const singleShortestRoute = calculatedRoutes[0];

    return {
      success: true,
      fc_origin: source,
      message: "Absolute shortest driving route generated successfully.",
      // Single Shortest Path Result
      // shortest_route: singleShortestRoute,
      // Optional: Complete list of all 5 calculated routes for reference
      all_routes: calculatedRoutes,
    };
  }
}

module.exports = new RouteService();
