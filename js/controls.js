import * as THREE from 'three';

/**
 * @param {PointerLockControls} controls 
 * @param {THREE.Mesh[]} walls - sienų masyvas kolizijoms tikrinti
 */
export function setupControls(controls, walls) {
  const move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  const speed = 1; // judėjimo greitis m/s

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

  // Paprasta AABB kolizijų patikra tarp taško ir sienų
  function collisionCheck(position) {
    const playerRadius = 0.3; // spindulys aplink žaidėją (galima reguliuoti)
    const playerHeight = 1.8;

    for (const wall of walls) {
      const wallBox = new THREE.Box3().setFromObject(wall);

      // Paprasta žaidėjo "kūno" AABB box (centrinis taškas ant žemės)
      const playerBox = new THREE.Box3(
        new THREE.Vector3(
          position.x - playerRadius,
          position.y,
          position.z - playerRadius
        ),
        new THREE.Vector3(
          position.x + playerRadius,
          position.y + playerHeight,
          position.z + playerRadius
        )
      );

      if (playerBox.intersectsBox(wallBox)) {
        return false;
      }
    }
    return true;
  }

  // Judėjimo atnaujinimas, iškviečiamas frame update cikle
  function updateMovement() {
    const delta = 0.1; // galima naudoti realų delta time iš animation loop (pvz. clock.getDelta())

    // Suskaičiuojam lokalias judėjimo kryptis
    let forward = 0, right = 0;
    if (move.forward) forward += 1;
    if (move.backward) forward -= 1;
    if (move.right) right += 1;
    if (move.left) right -= 1;

    if (forward === 0 && right === 0) return;

    // Normalizuojam kryptį
    const len = Math.sqrt(forward * forward + right * right);
    forward /= len;
    right /= len;

    // Gaunam žiūrėjimo kryptį XZ plokštumoje
    const cameraDirection = new THREE.Vector3();
    controls.getDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    // Dešinės vektorius pagal kamerą
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize();

    // Sumavimas į bendrą kryptį
    const direction = new THREE.Vector3();
    direction.addScaledVector(cameraDirection, forward);
    direction.addScaledVector(rightVector, right);
    direction.normalize();

    const currentPosition = controls.object.position.clone();
    const moveDistance = speed * delta;

    const nextPosition = currentPosition.clone().addScaledVector(direction, moveDistance);

    if (collisionCheck(nextPosition)) {
      // Jei nėra kolizijos, juda tiesiai
      controls.object.position.copy(nextPosition);
    } else {
      // Slide efekto bandymas per ašis atskirai
      // X ašis
      const tryPosX = currentPosition.clone();
      tryPosX.x = nextPosition.x;
      if (collisionCheck(tryPosX)) {
        controls.object.position.x = tryPosX.x;
      }

      // Z ašis
      const tryPosZ = currentPosition.clone();
      tryPosZ.z = nextPosition.z;
      if (collisionCheck(tryPosZ)) {
        controls.object.position.z = tryPosZ.z;
      }
    }
  }

  return { updateMovement };
}