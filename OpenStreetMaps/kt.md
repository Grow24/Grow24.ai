# KT: OpenStreetMaps (Alternative to Google Maps)

## What this is
A lightweight single‑page map app built with Mapbox GL JS. It centers the map on the user’s current location and provides turn‑by‑turn routing via the Mapbox Directions plugin.

## Key features
- Auto‑detects user location (browser geolocation)
- Interactive map with zoom/rotation controls
- Directions UI for route planning

## Tech stack
- HTML/CSS/JavaScript
- Mapbox GL JS + Mapbox Directions plugin

## How to run
- Open [index.html](index.html) in a browser.
- Allow location access when prompted.

## Project structure
- [index.html](index.html): App shell + Mapbox setup and map logic
- [style.css](style.css): Full‑screen map layout
- [script.js](script.js): Placeholder/unused (logic currently in HTML)

## Important config
- Mapbox access token is hardcoded in [index.html](index.html). Replace with your own token for production use.
