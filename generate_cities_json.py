import os
import zipfile
import urllib.request
import json
from collections import defaultdict

GEONAMES_URL = "https://download.geonames.org/export/dump/cities5000.zip"
GEONAMES_ZIP = "cities5000.zip"
GEONAMES_TXT = "cities5000.txt"
OUTPUT_JSON = "src/data/cities.json"

def download_and_extract():
    if not os.path.exists(GEONAMES_ZIP):
        print("Downloading GeoNames cities5000.zip...")
        urllib.request.urlretrieve(GEONAMES_URL, GEONAMES_ZIP)
    if not os.path.exists(GEONAMES_TXT):
        print("Extracting cities5000.txt...")
        with zipfile.ZipFile(GEONAMES_ZIP, "r") as zip_ref:
            zip_ref.extract(GEONAMES_TXT)

def parse_geonames():
    countries = defaultdict(list)
    with open(GEONAMES_TXT, encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) < 15:
                continue
            name = parts[1]
            lat = float(parts[4])
            lon = float(parts[5])
            country = parts[8]
            population = int(parts[14])
            wiki = f"https://en.wikipedia.org/wiki/{name.replace(' ', '_')}"
            countries[country].append({
                "name": name,
                "lat": lat,
                "lon": lon,
                "population": population,
                "wiki": wiki
            })
    return countries

def get_country_names():
    url = "https://download.geonames.org/export/dump/countryInfo.txt"
    country_names = {}
    with urllib.request.urlopen(url) as f:
        for line in f:
            if line.startswith(b"#") or not line.strip():
                continue
            parts = line.decode("utf-8").strip().split("\t")
            if len(parts) > 4:
                iso = parts[0]
                name = parts[4]
                country_names[iso] = name
    return country_names

def main():
    download_and_extract()
    countries = parse_geonames()
    country_names = get_country_names()
    result = []
    for iso2, cities in countries.items():
        total_pop = sum(c["population"] for c in cities)
        n = 10 if total_pop >= 1_000_000 else 3
        top_cities = sorted(cities, key=lambda c: c["population"], reverse=True)[:n]
        if not top_cities:
            continue
        result.append({
            "country": country_names.get(iso2, iso2),
            "iso2": iso2,
            "cities": top_cities
        })
    # Sort by country name
    result.sort(key=lambda x: x["country"])
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"Done! Wrote {len(result)} countries to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
