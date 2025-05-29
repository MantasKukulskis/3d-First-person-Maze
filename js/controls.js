export function setupControls(controls) {
  const moveSpeed = 5; // judėjimo greitis (vienetai per sekundę)
  
  // Judėjimo būsenos
  const move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  // Klausomės klaviatūros paspaudimų
  function onKeyDown(event) {
    switch(event.code) {
      case 'KeyW':
        move.forward = true;
        break;
      case 'KeyS':
        move.backward = true;
        break;
      case 'KeyA':
        move.left = true;
        break;
      case 'KeyD':
        move.right = true;
        break;
    }
  }

  function onKeyUp(event) {
    switch(event.code) {
      case 'KeyW':
        move.forward = false;
        break;
      case 'KeyS':
        move.backward = false;
        break;
      case 'KeyA':
        move.left = false;
        break;
      case 'KeyD':
        move.right = false;
        break;
    }
  }

  // Pridedame event listener'us
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // Judėjimo atnaujinimas per kiekvieną kadrą
  let prevTime = performance.now();
  let velocity = new THREE.Vector3();

  function updateMovement() {
    const time = performance.now();
    const delta = (time - prevTime) / 1000; // sek.

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    if (move.forward) velocity.z -= moveSpeed * delta;
    if (move.backward) velocity.z += moveSpeed * delta;
    if (move.left) velocity.x -= moveSpeed * delta;
    if (move.right) velocity.x += moveSpeed * delta;

    controls.moveRight(velocity.x);
    controls.moveForward(velocity.z);

    prevTime = time;
  }

  // Grąžiname update funkciją, kad galėtum ją kviesti animacijoje
  return { updateMovement };
}