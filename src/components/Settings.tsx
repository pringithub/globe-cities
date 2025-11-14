// using new JSX transform — no default React import needed

export type SettingsType = {
  mapProvider: "maplibre" | "google"; // Kept for compatibility but not used
  mapStyle: "default" | "satellite" | "terrain";
  autoZoom: boolean;
  showMarkers: boolean;
  markerSize: "small" | "medium" | "large";
};

type Props = {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
  onClose: () => void;
};

export default function Settings({
  settings,
  onSettingsChange,
  onClose,
}: Props) {
  const updateSetting = <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 24,
          maxWidth: 500,
          width: "90%",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Settings</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 28,
              cursor: "pointer",
              color: "#666",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Map Provider - Hidden since we only use Leaflet now */}
        <div style={{ marginBottom: 20, display: "none" }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Map Provider
          </label>
          <select
            value={settings.mapProvider}
            onChange={(e) =>
              updateSetting(
                "mapProvider",
                e.target.value as "maplibre" | "google"
              )
            }
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          >
            <option value="maplibre">Leaflet (Open Source)</option>
          </select>
        </div>

        {/* Map Style */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Map Style
          </label>
          <select
            value={settings.mapStyle}
            onChange={(e) =>
              updateSetting(
                "mapStyle",
                e.target.value as "default" | "satellite" | "terrain"
              )
            }
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
          >
            <option value="default">Default</option>
            <option value="satellite">Satellite</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>

        {/* Auto Zoom */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={settings.autoZoom}
              onChange={(e) => updateSetting("autoZoom", e.target.checked)}
              style={{ marginRight: 8, cursor: "pointer" }}
            />
            <span>
              <strong>Auto-zoom on city selection</strong>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                Automatically zoom to city when clicked
              </div>
            </span>
          </label>
        </div>

        {/* Show Markers */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={settings.showMarkers}
              onChange={(e) => updateSetting("showMarkers", e.target.checked)}
              style={{ marginRight: 8, cursor: "pointer" }}
            />
            <span>
              <strong>Show city markers</strong>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                Display markers for all cities on the globe
              </div>
            </span>
          </label>
        </div>

        {/* Marker Size */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Marker Size
          </label>
          <select
            value={settings.markerSize}
            onChange={(e) =>
              updateSetting(
                "markerSize",
                e.target.value as "small" | "medium" | "large"
              )
            }
            disabled={!settings.showMarkers}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
              opacity: settings.showMarkers ? 1 : 0.5,
            }}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "linear-gradient(135deg, #1e3c72, #2a5298)",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
