import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { createMaze } from './maze.js'; // mes dar jį sukursim
import { setupControls } from './controls.js'; // irgi darysim

// === Scena ir renderer ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// === Kamera ===
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);

// === Renderer ===
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Šviesa ===
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
scene.add(light);

// === Maze ===
createMaze(scene); // ši funkcija pridės sienas

// === Controls (WASD + Mouse) ===
const controls = new PointerLockControls(camera, document.body);
const controlFuncs = setupControls(controls);
scene.add(controls.getObject());

// === Resize handler ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Animacijos ciklas ===
function animate() {
  requestAnimationFrame(animate);

  controlFuncs.updateMovement(); // Čia atnaujinam judėjimą kiekviename kadre

  renderer.render(scene, camera);
}

animate();