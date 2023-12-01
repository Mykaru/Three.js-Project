import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
		

let camera, scene, renderer;

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
const geometry = new THREE.BoxGeometry(15,.25,15);
const material = new THREE.MeshStandardMaterial({ color: '#93E15A' });
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
scene.add(plane);

// Box
const box = new THREE.BoxGeometry(.5,.5,.5);
const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6AE3FF'})
const shadowTester = new THREE.Mesh(box, boxMaterial);
shadowTester.castShadow = true;
scene.add(shadowTester);

// Ambient Light 
const ambientLight = new THREE.AmbientLight('rgb(1,1,1)', 0.1);
scene.add(ambientLight);

// Directional Light 
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Background
scene.background = new THREE.Color('rgb(1,1,1)');

// GLFT Loader
const loader = new GLTFLoader();
loader.load(
	'temple.gltf',
	function (gltf) {
	  const temple = gltf.scene;
  
	  temple.traverse((child) => {
		if (child.isMesh) {
		  // Recalculate normals
		  child.geometry.computeVertexNormals();
  
		  child.castShadow = true;
		  child.receiveShadow = true;
		}
	  });
  
	  // Adjust shadow bias
	  directionalLight.shadow.bias = -0.001;
  
	  // Set shadow map properties
	  renderer.shadowMap.enabled = true;
	  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
	  scene.add(temple);
	},
	undefined,
	function (error) {
	  console.error('Error loading the model', error);
	}
  );

  let time = 0;

// Render
const animate = function () {
	requestAnimationFrame(animate);

	time += 0.01;

	// Rotate the mesh on a bias
	shadowTester.rotation.x = Math.sin(time) * Math.PI / 4; 
	shadowTester.rotation.y = Math.cos(time) * Math.PI / 4; 
  
	// Oscillate the mesh up and down
	shadowTester.position.y = Math.sin((time * 2) * -3) + 3;
  

	controls.update(); 
  
	renderer.render(scene, camera);
  };
  
// Start animation
animate();
		
