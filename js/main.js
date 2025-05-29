import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { createMaze } from './maze.js';
import { generateMaze } from './mazeGenerator.js';
import { setupControls } from './controls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// Pridedame debesius (fog)
scene.fog = new THREE.FogExp2(0x202020, 0.06);

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(2, 2, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// === Maze ===
const mazeWidth = 21;
const mazeHeight = 21;
const tileSize = 2;
const mazeLayout = generateMaze(mazeWidth, mazeHeight);

//Sky//
const skyTexture = new THREE.TextureLoader().load('/assets/textures/sky.jpg');
scene.background = skyTexture;

const skyCamera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
skyCamera.position.set(8, 2, 8);

// === Floor ===
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('/assets/textures/floor.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(mazeWidth, mazeHeight);
floorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const floorGeometry = new THREE.PlaneGeometry(mazeWidth * tileSize, mazeHeight * tileSize);
const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.set(
  (mazeWidth * tileSize) / 2 - tileSize / 2,
  0,
  (mazeHeight * tileSize) / 2 - tileSize / 2
);
scene.add(floor);

createMaze(scene, mazeLayout, tileSize);

const controls = new PointerLockControls(camera, document.body);
const controlFuncs = setupControls(controls);
scene.add(controls.object);

document.body.addEventListener('click', () => {
  controls.lock();
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controlFuncs.updateMovement();
  renderer.render(scene, camera);
}

animate();