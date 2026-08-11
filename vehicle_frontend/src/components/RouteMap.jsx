import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const colors = ["#1e88e5", "#d32f2f", "#388e3c", "#fbc02d", "#7b1fa2"];

// Libraries array ko component ke bahar define karein taaki re-renders par re-load na ho
const MAP_LIBRARIES = ["places"];

function RouteMap({ routeData }) {
  // Always use environment variable
  //   const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  // const apiKey = "AIzaSyCEYtEwSiQpIAF-65oNAUfnMPF8KvAW1n4"; // Replace with your actual API key
  const apiKey = "AIzaSyBtEmyBwz_YotZK8Iabl_nQQldaAtN0jhM";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries: MAP_LIBRARIES,
  });

  const routes = useMemo(() => {
    if (!routeData) return [];

    if (Array.isArray(routeData.routes) && routeData.routes.length) {
      return routeData.routes.map((route, index) => ({
        id: index,
        label: route.name || `Route ${index + 1}`,
        stops: route.routeSequence || [],
      }));
    }

    if (Array.isArray(routeData.routeSequence)) {
      return [
        {
          id: 0,
          label: "Primary Route",
          stops: routeData.routeSequence,
        },
      ];
    }

    return [];
  }, [routeData]);

  const [directions, setDirections] = useState(null);

  const computeDirections = useCallback(() => {
    if (!isLoaded || !routes.length) {
      setDirections(null);
      return;
    }

    const primaryRoute = routes[0];
    if (!primaryRoute.stops || primaryRoute.stops.length < 2) {
      setDirections(null);
      return;
    }

    const origin = {
      lat: Number(primaryRoute.stops[0].latitude),
      lng: Number(primaryRoute.stops[0].longitude),
    };
    const destination = {
      lat: Number(primaryRoute.stops[primaryRoute.stops.length - 1].latitude),
      lng: Number(primaryRoute.stops[primaryRoute.stops.length - 1].longitude),
    };

    const waypoints = primaryRoute.stops
      .slice(1, primaryRoute.stops.length - 1)
      .filter((stop) => stop.latitude != null && stop.longitude != null)
      .map((stop) => ({
        location: {
          lat: Number(stop.latitude),
          lng: Number(stop.longitude),
        },
        stopover: true,
      }));

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        } else {
          console.error("Directions request failed due to " + status);
          setDirections(null);
        }
      },
    );
  }, [isLoaded, routes]);

  useEffect(() => {
    computeDirections();
  }, [computeDirections]);

  const center = useMemo(() => {
    if (!routes.length || !routes[0].stops.length) {
      return { lat: 28.519015, lng: 77.2833364 };
    }
    return {
      lat: Number(routes[0].stops[0].latitude),
      lng: Number(routes[0].stops[0].longitude),
    };
  }, [routes]);

  if (loadError) {
    return (
      <div>
        Unable to load Google Maps. Please check your API key and billing
        settings.
      </div>
    );
  }

  if (!isLoaded) {
    return <div>Loading Google Maps…</div>;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: colors[0],
              strokeWeight: 6,
            },
          }}
        />
      )}

      {routes.flatMap((route) =>
        route.stops.map((stop, stopIndex) => (
          <Marker
            key={`marker-${route.id}-${stopIndex}`}
            position={{
              lat: Number(stop.latitude),
              lng: Number(stop.longitude),
            }}
            label={{
              text: stop.isSource ? "S" : `${stopIndex + 1}`,
              color: "#ffffff",
              fontSize: "12px",
            }}
          />
        )),
      )}
    </GoogleMap>
  );
}

export default RouteMap;
