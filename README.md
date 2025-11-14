# 🌍 Global Cities Explorer

An interactive 3D globe application to explore the most populous cities across the world, built with React, TypeScript, and MapLibre GL.

![Globe Cities Explorer](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![MapLibre](https://img.shields.io/badge/MapLibre-5.9-green)

## ✨ Features

- **Interactive 3D Globe** - Explore cities on a beautiful 3D globe with smooth navigation
- **Comprehensive City Data** - Data for thousands of cities worldwide from GeoNames
- **Search & Filter** - Quickly find cities and countries with the search bar
- **City Details** - View population, coordinates, Wikipedia links, and images
- **Multiple Map Styles** - Choose between default, satellite, and terrain views
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Customizable Settings** - Adjust markers, zoom behavior, and map provider

## 🚀 Live Demo

Visit the live demo: [https://pringithub.github.io/globe-cities](https://pringithub.github.io/globe-cities)

## 🛠️ Technologies

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **MapLibre GL JS** - Open-source 3D globe visualization
- **Vite** - Fast build tool and dev server
- **Wikipedia API** - Fetch city images and information

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/pringithub/globe-cities.git
cd globe-cities

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

## 🌐 Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

```bash
# Install gh-pages package (if not already installed)
npm install --save-dev gh-pages
# or
yarn add -D gh-pages

# Build and deploy
npm run deploy
# or
yarn deploy
```

The deploy script will:

1. Build the production bundle
2. Deploy to the `gh-pages` branch
3. Make the site available at `https://pringithub.github.io/globe-cities`

## 📁 Project Structure

```
globe-cities/
├── src/
│   ├── components/
│   │   ├── GlobeView.tsx      # 3D globe map component
│   │   ├── Sidebar.tsx         # Countries & cities navigation
│   │   ├── CityDetails.tsx     # City information panel
│   │   └── Settings.tsx        # Settings modal
│   ├── data/
│   │   └── cities.json         # City database
│   ├── App.tsx                 # Main application
│   ├── App.css                 # Global styles
│   └── main.tsx                # Entry point
├── generate_cities_json.py     # Script to update city data
└── package.json
```

## 🎮 Usage

1. **Browse Cities**: Use the sidebar to explore countries and their cities
2. **Search**: Type in the search bar to filter countries and cities
3. **Click Markers**: Click any city marker on the globe to view details
4. **View Details**: See population, coordinates, images, and links
5. **Settings**: Click the ⚙️ icon to customize the experience
   - Switch map providers (MapLibre/Google Maps)
   - Change map styles (default/satellite/terrain)
   - Toggle auto-zoom and markers
   - Adjust marker size

## 🔧 Settings

- **Map Provider** - Choose between MapLibre (open-source) or Google Maps
- **Map Style** - Select default, satellite, or terrain views
- **Auto-zoom** - Automatically zoom to cities when selected
- **Show Markers** - Toggle visibility of all city markers
- **Marker Size** - Adjust marker size (small/medium/large)

## 📊 Data Source

City data is sourced from [GeoNames](https://www.geonames.org/), a free geographical database. The dataset includes:

- City names and countries
- Geographic coordinates (latitude/longitude)
- Population figures
- Wikipedia links

To update the dataset, run the Python script:

```bash
python3 generate_cities_json.py
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [GeoNames](https://www.geonames.org/) for city data
- [MapLibre GL JS](https://maplibre.org/) for the 3D globe
- [Wikipedia API](https://www.mediawiki.org/wiki/API) for city images
- [React](https://react.dev/) and [Vite](https://vitejs.dev/) for the framework

---

Made with ❤️ by [pringithub](https://github.com/pringithub)
