import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export function setupControls(controls) {
  // Judėjimas
  const move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();

  // Greitis
  const speed = 5;

  // Klaviatura
  function onKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        move.forward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        move.left = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        move.backward = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        move.right = true;
        break;
    }
  }

  function onKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        move.forward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        move.left = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        move.backward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        move.right = false;
        break;
    }
  }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  function updateMovement() {
    const delta = 0.1; 

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(move.forward) - Number(move.backward);
    direction.x = Number(move.right) - Number(move.left);
    direction.normalize();

    if (move.forward || move.backward) velocity.z -= direction.z * speed * delta;
    if (move.left || move.right) velocity.x -= direction.x * speed * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }

  return {
    updateMovement,
  };
}