// app.js - Main JavaScript for Indoor Hotel Map 3D Visualization

// Global variables
let currentFloorIndex = 0;
let hotelData = null;
let scene, camera, renderer;
let floorGroup;
let raycaster, mouse;
let searchResults = [];
let searchInput, searchResultsContainer;

// Initialize Three.js scene
function initThreeJS() {
  const container = document.getElementById('threejs-container');

  scene = new THREE.Scene();

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 10, 20);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('resize', onWindowResize, false);
  container.addEventListener('click', onClick, false);

  animate();
}

// Handle window resize
function onWindowResize() {
  const container = document.getElementById('threejs-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

// Animate loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Load hotel data from JSON
async function loadHotelData() {
  const response = await fetch('data.json');
  hotelData = await response.json();
}

// Clear current floor group from scene
function clearFloor() {
  if (floorGroup) {
    scene.remove(floorGroup);
    floorGroup.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
    floorGroup = null;
  }
}

// Create 3D floor model
function createFloorModel(floor) {
  floorGroup = new THREE.Group();

  // Floor base
  const floorGeometry = new THREE.PlaneGeometry(10, 10);
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xdeb887, side: THREE.DoubleSide }); // beige
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = -Math.PI / 2;
  floorGroup.add(floorMesh);

  // Rooms and services
  floor.rooms.forEach((room) => {
    const boxGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 }); // brown
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(room.position[0], 0.5, room.position[2]);
    box.userData = { id: room.id, name: room.name, type: room.type };
    floorGroup.add(box);
  });

  floor.services.forEach((service) => {
    const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 }); // black
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(service.position[0], 0.5, service.position[2]);
    sphere.userData = { id: service.id, name: service.name, type: service.type };
    floorGroup.add(sphere);
  });

  scene.add(floorGroup);
}

// Update floor display
function updateFloor() {
  clearFloor();
  const building = hotelData.buildings[0];
  const floor = building.floors[currentFloorIndex];
  createFloorModel(floor);
  document.getElementById('current-floor').textContent = `Floor ${floor.floorNumber}`;
}

// Floor navigation handlers
function setupFloorNavigation() {
  document.getElementById('prev-floor').addEventListener('click', () => {
    if (currentFloorIndex > 0) {
      currentFloorIndex--;
      updateFloor();
    }
  });

  document.getElementById('next-floor').addEventListener('click', () => {
    const building = hotelData.buildings[0];
    if (currentFloorIndex < building.floors.length - 1) {
      currentFloorIndex++;
      updateFloor();
    }
  });
}

// Search functionality
function setupSearch() {
  searchInput = document.getElementById('search-input');
  searchResultsContainer = document.getElementById('search-results');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    searchResultsContainer.innerHTML = '';

    if (!query) return;

    const building = hotelData.buildings[0];
    const floor = building.floors[currentFloorIndex];

    searchResults = [];

    floor.rooms.forEach((room) => {
      if (room.name.toLowerCase().includes(query)) {
        searchResults.push(room);
      }
    });

    floor.services.forEach((service) => {
      if (service.name.toLowerCase().includes(query)) {
        searchResults.push(service);
      }
    });

    searchResults.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.name;
      li.tabIndex = 0;
      li.addEventListener('click', () => {
        highlightObject(item.id);
        searchResultsContainer.innerHTML = '';
        searchInput.value = '';
      });
      searchResultsContainer.appendChild(li);
    });
  });
}

// Highlight selected object in 3D scene
function highlightObject(id) {
  floorGroup.children.forEach((child) => {
    if (child.userData && child.userData.id === id) {
      child.material.emissive = new THREE.Color(0xffff00); // yellow highlight
    } else if (child.material.emissive) {
      child.material.emissive = new THREE.Color(0x000000);
    }
  });
}

// Handle click on 3D objects
function onClick(event) {
  event.preventDefault();
  const container = document.getElementById('threejs-container');
  const rect = container.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(floorGroup.children);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    alert(`Selected: ${obj.userData.name} (${obj.userData.type})`);
  }
}

// Initialize app
async function init() {
  await loadHotelData();
  initThreeJS();
  setupFloorNavigation();
  setupSearch();
  updateFloor();
}

// Load Three.js and OrbitControls scripts dynamically
function loadScripts(callback) {
  const threeScript = document.createElement('script');
  threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js';
  threeScript.onload = () => {
    const controlsScript = document.createElement('script');
    controlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/js/controls/OrbitControls.min.js';
    controlsScript.onload = callback;
    document.head.appendChild(controlsScript);
  };
  document.head.appendChild(threeScript);
}

// Start app after scripts load
loadScripts(() => {
  init();
});

// Offline support with service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  });
}
