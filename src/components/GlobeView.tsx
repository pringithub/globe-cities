import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Type declaration for Google Maps (when loaded via script)
declare global {
  interface Window {
    google: any;
  }
}

type Props = {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ id: string; lon: number; lat: number }>;
  onMarkerClick?: (id: string) => void;
  selectedMarkerId?: string;
  markerSize?: "small" | "medium" | "large";
  mapProvider?: "maplibre" | "google";
  mapStyle?: "default" | "satellite" | "terrain";
};

export default function GlobeView({
  center = [0, 20],
  zoom = 1.2,
  markers = [],
  onMarkerClick,
  selectedMarkerId,
  markerSize = "medium",
  mapProvider = "maplibre",
  mapStyle = "default",
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRefs = useRef<any[]>([]);
  const googleMapRef = useRef<any>(null);

  const getMarkerSizePx = () => {
    switch (markerSize) {
      case "small":
        return 12;
      case "large":
        return 20;
      default:
        return 16;
    }
  };

  const getMapStyle = () => {
    if (mapProvider === "google") return null;

    switch (mapStyle) {
      case "satellite":
        return "https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL";
      case "terrain":
        return "https://api.maptiler.com/maps/outdoor/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL";
      default:
        return "https://demotiles.maplibre.org/style.json";
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    if (mapProvider === "google") {
      // Google Maps implementation
      // Note: Requires Google Maps API loaded in index.html
      if (typeof window.google !== "undefined" && window.google.maps) {
        googleMapRef.current = new window.google.maps.Map(
          mapContainer.current,
          {
            center: { lat: center[1], lng: center[0] },
            zoom: zoom,
            mapTypeId:
              mapStyle === "satellite"
                ? "satellite"
                : mapStyle === "terrain"
                ? "terrain"
                : "roadmap",
          }
        );
      }
    } else {
      // MapLibre implementation
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style: getMapStyle(),
        center: center as [number, number],
        zoom,
        projection: "globe",
      });

      // enable globe lighting
      mapRef.current.on("style.load", () => {
        mapRef.current.setFog && mapRef.current.setFog({});
      });
    }

    return () => {
      if (mapRef.current) mapRef.current.remove();
      if (googleMapRef.current) googleMapRef.current = null;
    };
  }, [mapProvider, mapStyle]);

  useEffect(() => {
    if (mapProvider === "google" && googleMapRef.current) {
      googleMapRef.current.setCenter({ lat: center[1], lng: center[0] });
      googleMapRef.current.setZoom(zoom);
    } else if (mapRef.current) {
      mapRef.current.easeTo({ center, zoom, duration: 1000 });
    }
  }, [center, zoom, mapProvider]);

  useEffect(() => {
    const currentMap =
      mapProvider === "google" ? googleMapRef.current : mapRef.current;
    if (!currentMap) return;

    // remove existing marker objects
    markerRefs.current.forEach((mr) => {
      try {
        if (mapProvider === "google") {
          mr.setMap(null);
        } else {
          mr.remove();
        }
      } catch (e) {
        // ignore
      }
    });
    markerRefs.current = [];

    const size = getMarkerSizePx();

    markers.forEach((m) => {
      const isSelected = m.id === selectedMarkerId;

      if (
        mapProvider === "google" &&
        typeof window.google !== "undefined" &&
        window.google.maps
      ) {
        // Google Maps marker
        const marker = new window.google.maps.Marker({
          position: { lat: m.lat, lng: m.lon },
          map: currentMap,
          title: m.id,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: size / 2,
            fillColor: isSelected ? "#FF0000" : "#FFA03C",
            fillOpacity: 0.9,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
        });
        marker.addListener("click", () => onMarkerClick && onMarkerClick(m.id));
        markerRefs.current.push(marker);
      } else {
        // MapLibre marker
        const el = document.createElement("div");
        el.className = isSelected ? "city-marker selected" : "city-marker";
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.background = isSelected
          ? "rgba(255, 0, 0, 0.95)"
          : "rgba(255, 160, 60, 0.9)";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.cursor = "pointer";
        el.style.boxShadow = "none";
        el.title = m.id;

        const markerObj = new maplibregl.Marker({
          element: el,
          anchor: "center",
        })
          .setLngLat([m.lon, m.lat])
          .addTo(currentMap);

        // Add click handler to the marker element
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (onMarkerClick) {
            onMarkerClick(m.id);
          }
        });

        markerRefs.current.push(markerObj);
      }
    });
  }, [markers, onMarkerClick, selectedMarkerId, markerSize, mapProvider]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}
