// using new JSX transform — no default React import needed

import { useState, useEffect } from "react";

export default function CityDetails({ city }: { city: any | null }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fetch city image from Wikipedia API
  useEffect(() => {
    if (!city) return;

    setImageUrl(null);
    setImageLoading(true);
    setImageError(false);

    // Extract Wikipedia page title from URL
    const wikiTitle = city.wiki ? city.wiki.split("/wiki/")[1] : city.name;

    // Fetch the main image from Wikipedia page
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        wikiTitle
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.thumbnail?.source) {
          // Get a larger version of the image
          const imgUrl = data.thumbnail.source.replace(/\/\d+px-/, "/400px-");
          setImageUrl(imgUrl);
        } else if (data.originalimage?.source) {
          setImageUrl(data.originalimage.source);
        } else {
          setImageError(true);
        }
        setImageLoading(false);
      })
      .catch(() => {
        setImageError(true);
        setImageLoading(false);
      });
  }, [city]);

  if (!city)
    return (
      <div style={{ padding: 16, minWidth: 280 }}>
        <p style={{ margin: 0, color: "#666" }}>Select a city to see details</p>
      </div>
    );
  return (
    <div
      style={{ padding: "16px 40px 16px 16px", minWidth: 280, maxWidth: 400 }}
    >
      <h2 style={{ margin: "0 0 12px 0", fontSize: "20px", fontWeight: 600 }}>
        {city.name}
      </h2>

      {/* City Image */}
      {imageLoading && (
        <div
          style={{
            width: "100%",
            height: 200,
            background: "#f0f0f0",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            fontSize: 14,
            color: "#888",
          }}
        >
          Loading image...
        </div>
      )}
      {imageUrl && !imageError && (
        <img
          src={imageUrl}
          alt={city.name}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: 250,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          onError={() => setImageError(true)}
        />
      )}

      <p style={{ margin: "4px 0", fontSize: "14px" }}>
        <strong>Population:</strong> {city.population.toLocaleString()}
      </p>
      <p style={{ margin: "4px 0", fontSize: "14px" }}>
        <strong>Coordinates:</strong> {city.lat.toFixed(4)},{" "}
        {city.lon.toFixed(4)}
      </p>
      <p style={{ margin: "8px 0" }}>
        <a
          href={city.wiki}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: "14px" }}
        >
          📖 Wikipedia
        </a>
      </p>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 600 }}>
          Photos
        </h4>
        <div style={{ fontSize: "14px" }}>
          <a
            href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
              city.name
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            Search images
          </a>
          {" • "}
          <a
            href={`https://commons.wikimedia.org/wiki/Special:Search?search=${encodeURIComponent(
              city.name
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            Wikimedia
          </a>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 600 }}>
          Experience
        </h4>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${city.lat},${city.lon}`
              )
            }
            style={{ fontSize: "13px", padding: "6px 12px" }}
          >
            🗺️ Street View
          </button>
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/place/${encodeURIComponent(
                  city.name
                )}/@${city.lat},${city.lon},15z`
              )
            }
            style={{ fontSize: "13px", padding: "6px 12px" }}
          >
            🏙️ 3D View
          </button>
        </div>
      </div>
    </div>
  );
}
