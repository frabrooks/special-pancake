import * as THREE from 'three';

let scene, camera, renderer;
let player, blocks = [];
let playerSpeed = 0.1;
let blockSpeed = 0.02;
let gameOver = false;
let keys = {};

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Player
  let playerGeometry = new THREE.CircleGeometry(0.5, 32);
  let playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.y = -4;
  scene.add(player);

  // Blocks
  for (let i = 0; i < 10; i++) {
    let blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    let blockMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let block = new THREE.Mesh(blockGeometry, blockMaterial);
    block.position.x = Math.random() * 10 - 5;
    block.position.y = Math.random() * 10;
    blocks.push(block);
    scene.add(block);
  }

  document.addEventListener('keydown', onDocumentKeyDown, false);
  document.addEventListener('keyup', onDocumentKeyUp, false);
}


function onDocumentKeyDown(event) {
  keys[event.keyCode] = true;
}

function onDocumentKeyUp(event) {
  keys[event.keyCode] = false;
}

function updatePlayerPosition() {
  if (keys[87]) {
    player.position.y += playerSpeed; // W key
  }
  if (keys[83]) {
    player.position.y -= playerSpeed; // S key
  }
  if (keys[65]) {
    player.position.x -= playerSpeed; // A key
  }
  if (keys[68]) {
    player.position.x += playerSpeed; // D key
  }
}

document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);


function animate() {
  if (gameOver) return;

  requestAnimationFrame(animate);


  updatePlayerPosition();

  // Move blocks
  blocks.forEach(block => {
    block.position.y -= blockSpeed;
    if (block.position.y < -5) {
      block.position.y = 5;
      block.position.x = Math.random() * 10 - 5;
    }

    // Check collision with player
    if (block.position.distanceTo(player.position) < 1) {
      player.position.y -= blockSpeed;
    }
  });

  // Check if player is off screen
  if (player.position.y < -5) {
    gameOver = true;
    alert('Game Over!');
  }

  renderer.render(scene, camera);
}