import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { createMaze } from './maze.js';
import { setupControls } from './controls.js';

// === Scena ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// === Kamera ===
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(8, 2, 8);

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Šviesa ===
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// === Grindų tekstūra ===
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('/assets/textures/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(2, 2);

const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// === Labirintas ===
createMaze(scene);

// === Kontrolės ===
const controls = new PointerLockControls(camera, document.body);
const controlFuncs = setupControls(controls);
scene.add(controls.object);

// Spustelėjus pelę – aktyvuojamas valdymas
document.body.addEventListener('click', () => {
  controls.lock();
});

// === Langų dydžio keitimo reakcija ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Animacija ===
function animate() {
  requestAnimationFrame(animate);
  controlFuncs.updateMovement();
  renderer.render(scene, camera);
}

animate();