import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import GlobeView from "./components/GlobeView";
import CityDetails from "./components/CityDetails";
import Settings from "./components/Settings";
import type { SettingsType } from "./components/Settings";

import citiesData from "./data/cities.json";

function App() {
  const [selectedCity, setSelectedCity] = useState<any | null>(null);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [zoom, setZoom] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsType>({
    mapProvider: "maplibre", // Not used anymore, keeping for compatibility
    mapStyle: "default",
    autoZoom: true,
    showMarkers: true,
    markerSize: "medium",
  });

  const markers = useMemo(() => {
    const out: Array<{ id: string; lon: number; lat: number }> = [];
    citiesData.forEach((c: any) => {
      c.cities.forEach((city: any) => {
        out.push({
          id: `${c.iso2}:${city.name}`,
          lon: city.lon,
          lat: city.lat,
        });
      });
    });
    return out;
  }, []);

  useEffect(() => {
    if (!selectedCity || !settings.autoZoom) return;
    setCenter([selectedCity.lon, selectedCity.lat]);
    setZoom(6);
  }, [selectedCity, settings.autoZoom]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Header */}
      <header className="app-header">
        <h1>🌍 Global Cities Explorer</h1>
        <p>Explore the most populous cities across the world</p>
        {/* Settings button */}
        <button
          className="settings-button"
          aria-label="Settings"
          onClick={() => setSettingsOpen(true)}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>⚙️</span>
        </button>
      </header>

      {/* Full-screen map */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <GlobeView
          center={center}
          zoom={zoom}
          markers={settings.showMarkers ? markers : []}
          markerSize={settings.markerSize}
          mapProvider={settings.mapProvider}
          mapStyle={settings.mapStyle}
          selectedCity={selectedCity}
          selectedMarkerId={
            selectedCity
              ? `${
                  citiesData.find((c: any) =>
                    c.cities.some((city: any) => city === selectedCity)
                  )?.iso2
                }:${selectedCity.name}`
              : undefined
          }
          onMarkerClick={(id) => {
            const [, cityName] = id.split(":");
            const found = citiesData
              .flatMap((c: any) => c.cities)
              .find((cc: any) => cc.name === cityName);
            if (found) setSelectedCity(found);
          }}
        />
      </div>

      {/* Floating Sidebar with chevron toggle */}
      <div className={`floating-sidebar${sidebarOpen ? " open" : ""}`}>
        <Sidebar
          data={citiesData}
          onCityClick={(_: string, city: any) => {
            setSelectedCity(city);
            setSidebarOpen(false); // auto-close sidebar on mobile after selection
          }}
        />
        {/* Chevron toggle button */}
        <button
          className="sidebar-chevron-toggle"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          onClick={() => {
            setSidebarOpen((v) => !v);
            // Close city card when chevron is clicked
            if (selectedCity) {
              setSelectedCity(null);
            }
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>
            {sidebarOpen ? "◀" : "▶"}
          </span>
        </button>
      </div>

      {/* Overlay for closing sidebar on mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating City Details */}
      {selectedCity && (
        <div className="floating-city-details">
          <CityDetails city={selectedCity} />
          {/* Close button for mobile bottom sheet */}
          <button
            className="city-details-close"
            aria-label="Close details"
            onClick={() => setSelectedCity(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <Settings
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
