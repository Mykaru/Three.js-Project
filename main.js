		import * as THREE from 'three';
		import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
		import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
		

		let camera, scene, renderer;

const aspectRatio = window.innerWidth / window.innerHeight;

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2 * Math.tan( Math.PI / 6 );
camera.position.z = 2;

scene = new THREE.Scene();
			
renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color for the cube
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Create directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Set blue background color
scene.background = new THREE.Color('#BFE6FA');

const loader = new GLTFLoader();

// Load the glTF model
loader.load(
  'temple.gltf', 
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('Error loading the model', error);
  }
);


		

// Render function
const animate = function () {
	requestAnimationFrame(animate);

  
	controls.update(); // Update controls
  
	renderer.render(scene, camera);
  };
  
// Start animation
animate();
		
