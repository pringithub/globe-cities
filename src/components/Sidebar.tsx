// using new JSX transform — no default React import needed

type City = { name: string; lat: number; lon: number; population: number };

import { useState, useMemo } from "react";

export default function Sidebar({
  data,
  onCityClick,
}: {
  data: any[];
  onCityClick: (country: string, city: City) => void;
}) {
  const [expanded, setExpanded] = useState<{ [iso2: string]: boolean }>({});
  const [search, setSearch] = useState("");

  // Convert ISO2 country code to flag emoji
  const getFlagEmoji = (iso2: string) => {
    return iso2
      .toUpperCase()
      .split("")
      .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
      .join("");
  };

  // Filter countries and cities by search
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const s = search.trim().toLowerCase();
    return data
      .map((c) => {
        // match country or any city
        const countryMatch = c.country.toLowerCase().includes(s);
        const matchedCities = c.cities.filter((city: City) =>
          city.name.toLowerCase().includes(s)
        );
        if (countryMatch) return { ...c };
        if (matchedCities.length) return { ...c, cities: matchedCities };
        return null;
      })
      .filter(Boolean);
  }, [data, search]);

  // Auto-expand countries with city matches when searching
  const autoExpanded = useMemo(() => {
    if (!search.trim()) return expanded;
    const s = search.trim().toLowerCase();
    const newExpanded = { ...expanded };
    data.forEach((c) => {
      const countryMatch = c.country.toLowerCase().includes(s);
      const cityMatch = c.cities.some((city: City) =>
        city.name.toLowerCase().includes(s)
      );
      if (countryMatch || cityMatch) {
        newExpanded[c.iso2] = true;
      }
    });
    return newExpanded;
  }, [expanded, data, search]);

  const toggle = (iso2: string) => {
    if (!search.trim()) {
      // When no search term, only allow one country open at a time
      setExpanded({ [iso2]: !expanded[iso2] });
    } else {
      // When searching, allow multiple countries open
      setExpanded((e) => ({ ...e, [iso2]: !e[iso2] }));
    }
  };

  return (
    <aside
      style={{
        width: 320,
        height: "100%",
        maxHeight: "calc(100vh - 120px)",
        background: "white",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Sticky header section */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "white",
          zIndex: 10,
          padding: "16px 16px 0 16px",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <h2 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: 600 }}>
          Countries & Cities
        </h2>
        <input
          type="text"
          placeholder="Search countries or cities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "calc(100% - 4px)",
            minWidth: 0,
            marginBottom: 12,
            padding: "6px 10px",
            borderRadius: 4,
            border: "1px solid #ccc",
            fontSize: 14,
            boxSizing: "border-box",
            display: "block",
          }}
        />
      </div>

      {/* Scrollable content section */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px 16px 16px",
        }}
      >
        {filtered.length === 0 && (
          <div style={{ color: "#888", fontSize: 14 }}>No results found.</div>
        )}
        {filtered.map((c) => (
          <div key={c.iso2} style={{ marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                background: autoExpanded[c.iso2] ? "#f0f4ff" : "#f8f8f8",
                borderRadius: 4,
                padding: "6px 8px",
                fontWeight: 600,
                fontSize: 15,
                userSelect: "none",
                border: "1px solid #e0e0e0",
              }}
              onClick={() => toggle(c.iso2)}
            >
              <span style={{ marginRight: 8, fontSize: 18 }}>
                {autoExpanded[c.iso2] ? "▼" : "▶"}
              </span>
              <span style={{ marginRight: 8 }}>{getFlagEmoji(c.iso2)}</span>
              {c.country}
            </div>
            {autoExpanded[c.iso2] && (
              <ul style={{ margin: 0, paddingLeft: 24, listStyle: "none" }}>
                {c.cities.map((city: City) => (
                  <li
                    key={city.name}
                    style={{
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      transition: "background 0.2s",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => onCityClick(c.country, city)}
                  >
                    {city.name} — {city.population.toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
