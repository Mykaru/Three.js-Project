import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

		

let camera, scene, renderer;

// Camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2 * Math.tan( Math.PI / 6 );
camera.position.z = 2;

scene = new THREE.Scene();
			
renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

// Plane
const geometry = new THREE.CircleGeometry(30, 32);
const material = new THREE.MeshStandardMaterial({ color: 'rgb(50,50,30)' });
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
plane.rotation.x = (-Math.PI / 2);
scene.add(plane);

// Box
const box = new THREE.BoxGeometry(.5,.5,.5);
const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6AE3FF'})
const shadowTester = new THREE.Mesh(box, boxMaterial);
shadowTester.castShadow = true;
scene.add(shadowTester);

// Text
const fontLoader = new FontLoader();

fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

	const text = new TextGeometry( 'Example Text', {
		font: font,
		size: 0.6,
		height: .1,
		
	} );

	const textMaterial = new THREE.MeshStandardMaterial;
	const textMesh = new THREE.Mesh(text, textMaterial)
	textMesh.position.x = 1;
	textMesh.position.z = 4;
	textMesh.rotation.x = (-Math.PI / 2);
	scene.add(textMesh);
} );

// Ambient Light 
const ambientLight = new THREE.AmbientLight('rgb(100,100,100)', 0);
scene.add(ambientLight);

// Directional Light 
const directionalLight = new THREE.DirectionalLight(0xffffff, 0);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Spot Light
const spotLight = new THREE.SpotLight(0x0000ff); 
spotLight.position.set(0, 5, 0); // Position 
spotLight.target.position.set(0, 0, 0); // Target postion 
spotLight.castShadow = true;

spotLight.intensity = 5;
spotLight.angle = Math.PI / 4; // Cone angle
spotLight.penumbra = 0.1; // Softens the edge of the spotlight's light cone
spotLight.decay = 1; // Intensity decay
spotLight.distance = 200; // Maximum distance of the light

scene.add(spotLight);
scene.add(spotLight.target);


// Point Light Red
const pointLight = new THREE.PointLight();
pointLight.color.set('rgb(255, 10 ,20)');
pointLight.position.set(4, 3, 3);
pointLight.castShadow = true;

pointLight.intensity = 20;
pointLight.distance = 15;

scene.add(pointLight);

// Point Light Green
const pointLight2 = new THREE.PointLight();
pointLight2.color.set('rgb(20, 255 ,10)');
pointLight2.position.set(0, 3, -4);
pointLight2.castShadow = true;

pointLight2.intensity = 20;
pointLight2.distance = 15;

scene.add(pointLight2);

// Point Light blue
const pointLight3 = new THREE.PointLight();
pointLight3.color.set('rgb(10, 20 ,255)');
pointLight3.position.set(-4, 3, 2);
pointLight3.castShadow = true;

pointLight3.intensity = 20;
pointLight3.distance = 15;

scene.add(pointLight3);

// Shadows
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Render Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Background
renderer.setClearColor( 0x000000, 0 );

// Fog 
scene.fog = new THREE.Fog( 'rgb(10,0,32)', 10, 27 );

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
	  spotLight.shadow.bias = -0.009;
	  pointLight.shadow.bias = -0.009;
	  pointLight2.shadow.bias = -0.009;
	  pointLight3.shadow.bias = -0.009;
  
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
	shadowTester.rotation.x = Math.sin(time) * Math.PI / 2; 
	shadowTester.rotation.y = Math.cos(time) * Math.PI / 4; 
  
	// Oscillate the mesh up and down
	shadowTester.position.y = Math.sin(time * 2) + 3;
  

	controls.update(); 
  
	renderer.render(scene, camera);
  };
  
// Start animation
animate();
		
