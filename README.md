# Indoor Hotel Map with 3D Visualization

## Overview
This is a mobile-first web application that provides a 3D visualization of a hotel with multiple buildings and six floors. The app includes navigation, pathfinding, and a search feature for various services and rooms. It supports offline usage via a service worker.

## Features
- Flat 3D model of the hotel using Three.js
- Multi-floor navigation with floor switching
- Search functionality for rooms and services
- Basic pathfinding visualization (to be extended)
- Offline support with service worker caching
- Responsive design with brown, beige, and black color scheme

## Technologies Used
- HTML, CSS, JavaScript
- [Three.js](https://threejs.org/) for 3D rendering
- Service Worker for offline support

## File Structure
- `index.html`: Main HTML file
- `styles.css`: Styling with specified color scheme and responsive design
- `app.js`: JavaScript logic for 3D rendering, navigation, search, and offline support
- `data.json`: Data structure for rooms, floors, services, and connections
- `service-worker.js`: Service worker for caching assets and offline support
- `README.md`: This documentation

## Setup and Usage
1. Clone or download the repository.
2. Open `index.html` in a modern web browser.
3. Use the floor navigation buttons to switch floors.
4. Use the search bar to find rooms or services.
5. Click on 3D objects to see their details.
6. The app works offline after the first load due to service worker caching.

## Deployment
This app can be hosted on GitHub Pages or any static web hosting service.

To deploy on GitHub Pages:
1. Push the project to a GitHub repository.
2. In the repository settings, enable GitHub Pages from the main branch.
3. Access the app via the provided GitHub Pages URL.

## Future Improvements
- Implement full pathfinding visualization between points.
- Add more detailed 3D models and textures.
- Enhance search with autocomplete and fuzzy matching.
- Add accessibility improvements.

## License
This project is open source and free to use.
