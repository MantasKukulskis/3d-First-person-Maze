import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { createMaze, walls, exitDoor } from './maze.js';
import { generateMaze } from './mazeGenerator.js';
import { setupControls } from './controls.js';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x202020, 0.06);

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(2, 2, 2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Apšvietimas
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Labirinto generavimas
const mazeWidth = 21;
const mazeHeight = 21;
const tileSize = 2;
const mazeLayout = generateMaze(mazeWidth, mazeHeight);

// Foninis dangus
const skyTexture = new THREE.TextureLoader().load('/assets/textures/sky.jpg');
scene.background = skyTexture;

// Grindys
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

// Labirinto sienos su durimis
createMaze(scene, mazeLayout, tileSize);

// Kontrolės
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

const controlFuncs = setupControls(controls, walls);

// Žaidimo logika
let mazeCompleted = false;
const clock = new THREE.Clock();

document.body.addEventListener('click', () => {
  controls.lock();
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Rodyti pranešimą ekrane
function showWinMessage() {
  const winDiv = document.getElementById('winMessage');
  if (winDiv) {
    winDiv.style.display = 'block';
  }
}

// Animacijos ciklas
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (!mazeCompleted) {
    controlFuncs.updateMovement(delta);

    if (exitDoor) {
      const playerPos = controls.getObject().position;
      const distanceToExit = exitDoor.position.distanceTo(playerPos);

      if (distanceToExit < 1.5) {
        mazeCompleted = true;
        showWinMessage();
      }
    }
  }

  renderer.render(scene, camera);
}

animate();