import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
		

let camera, scene, renderer;

const aspectRatio = window.innerWidth / window.innerHeight;

// Camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2 * Math.tan( Math.PI / 6 );
camera.position.z = 2;

scene = new THREE.Scene();
			
renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

// Plane
const geometry = new THREE.BoxGeometry(30,.25,30);
const material = new THREE.MeshStandardMaterial({ color: '#93E15A' }); // Red color for the cube
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
plane.castShadow = true;
scene.add(plane);

// Ambient Light 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Directional Light 
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Shadows
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Render Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

// Background
scene.background = new THREE.Color('#BFE6FA');

// GLFT Loader
const loader = new GLTFLoader();
loader.load(
  'temple.gltf', 
  function (gltf) {
    const temple = gltf.scene;
	temple.receiveShadow = true;	
	temple.castShadow = true;
    scene.add(temple);
  },
  undefined,
  function (error) {
    console.error('Error loading the model', error);
  }
);

// Render
const animate = function () {
	requestAnimationFrame(animate);

  
	controls.update(); // Update controls
  
	renderer.render(scene, camera);
  };
  
// Start animation
animate();
		
