import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ id: string; lon: number; lat: number }>;
  onMarkerClick?: (id: string) => void;
  selectedMarkerId?: string;
  markerSize?: "small" | "medium" | "large";
  mapProvider?: "maplibre" | "google"; // Keep for compatibility but ignore
  mapStyle?: "default" | "satellite" | "terrain";
  selectedCity?: any; // Pass selected city for mobile offset calculation
};

export default function GlobeView({
  center = [0, 20],
  zoom = 3,
  markers = [],
  onMarkerClick,
  selectedMarkerId,
  markerSize = "medium",
  mapStyle = "default",
  selectedCity,
}: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<L.CircleMarker[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);

  const getMarkerSizePx = () => {
    switch (markerSize) {
      case "small":
        return 6;
      case "large":
        return 10;
      default:
        return 8;
    }
  };

  const getTileLayerConfig = () => {
    switch (mapStyle) {
      case "satellite":
        // ESRI World Imagery
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          maxZoom: 18,
        };
      case "terrain":
        // OpenTopoMap
        return {
          url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          maxZoom: 17,
        };
      default:
        // OpenStreetMap
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        };
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current, {
      center: [center[1], center[0]] as L.LatLngExpression,
      zoom: zoom,
      zoomControl: false, // Remove zoom control
      attributionControl: true,
      worldCopyJump: true, // Enable world wrap with smooth jump
      maxBounds: undefined, // Allow infinite horizontal scrolling
    });

    const config = getTileLayerConfig();
    tileLayerRef.current = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      noWrap: false, // Allow tiles to wrap around the world
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update tile layer when style changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }
    if (labelsLayerRef.current) {
      mapRef.current.removeLayer(labelsLayerRef.current);
      labelsLayerRef.current = null;
    }

    const config = getTileLayerConfig();
    tileLayerRef.current = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      noWrap: false, // Allow tiles to wrap around the world
    }).addTo(mapRef.current);

    // Add labels overlay for satellite view
    if (mapStyle === "satellite") {
      labelsLayerRef.current = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
          pane: "shadowPane", // Ensure labels are on top
          noWrap: false, // Allow labels to wrap around the world
        }
      ).addTo(mapRef.current);
    }
  }, [mapStyle]);

  // Update center and zoom
  useEffect(() => {
    if (!mapRef.current) return;

    // Check if we're on mobile/tablet and if a city is selected
    const isMobile = window.innerWidth <= 768;

    if (isMobile && selectedCity) {
      // On mobile with selected city, calculate offset position
      const map = mapRef.current;
      const targetLatLng = L.latLng(center[1], center[0]);

      // First set zoom
      map.setZoom(zoom, { animate: false });

      // Calculate the point with offset
      const targetPoint = map.project(targetLatLng, zoom);
      const offsetPixels = window.innerHeight * 0.2;
      targetPoint.y += offsetPixels;

      // Convert back to lat/lng and set view
      const offsetLatLng = map.unproject(targetPoint, zoom);
      map.setView(offsetLatLng, zoom, { animate: true, duration: 1 });
    } else {
      // Normal centering for desktop or when no city selected
      mapRef.current.setView([center[1], center[0]], zoom, {
        animate: true,
        duration: 1,
      });
    }
  }, [center, zoom, selectedCity]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markerRefs.current.forEach((marker) => {
      mapRef.current?.removeLayer(marker);
    });
    markerRefs.current = [];

    const radius = getMarkerSizePx();

    // Add new markers
    markers.forEach((m) => {
      const isSelected = m.id === selectedMarkerId;

      const marker = L.circleMarker([m.lat, m.lon], {
        radius: radius,
        fillColor: isSelected ? "#FF0000" : "#FFA03C",
        fillOpacity: 0.9,
        color: "#FFFFFF",
        weight: 2,
        className: isSelected ? "city-marker selected" : "city-marker",
      });

      marker.on("click", (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        if (onMarkerClick) {
          onMarkerClick(m.id);
        }
      });

      if (mapRef.current) {
        marker.addTo(mapRef.current);
        markerRefs.current.push(marker);
      }
    });

    // Bring selected marker to front
    if (selectedMarkerId) {
      const selectedMarker = markerRefs.current.find(
        (_, idx) => markers[idx]?.id === selectedMarkerId
      );
      if (selectedMarker) {
        selectedMarker.bringToFront();
      }
    }
  }, [markers, onMarkerClick, selectedMarkerId, markerSize]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}
