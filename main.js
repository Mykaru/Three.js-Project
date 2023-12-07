import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
		

let camera, scene, renderer;

// Camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 6 * Math.tan( Math.PI / 6 );
camera.position.z = 6;

// Scene 
scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(10,0,32)');
			
renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 3.5;
controls.maxDistance = 20;
controls.enableDamping = true;
controls.dampingFactor = .06;
controls.maxPolarAngle = Math.PI / 2.2;


const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);



// Constants
const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	1.6,
	0.1,
	0.85
);

bloomPass.threshold = .2; 
bloomPass.strength = 0.35; 
bloomPass.radius =0; 

const outputPass = new OutputPass();
composer.addPass(bloomPass); 
composer.addPass(outputPass);

// Plane
const geometry = new THREE.CircleGeometry(35, 32);
const material = new THREE.MeshStandardMaterial({ color: 'rgb(50,50,30)' });
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
plane.rotation.x = (-Math.PI / 2);
scene.add(plane);

// Box
const box = new THREE.BoxGeometry(.5,.5,.5);
const boxMaterial = new THREE.MeshStandardMaterial({
	color: '#6AE3FF',
	emissive: '#6AE3FF', 
})
const shadowTester = new THREE.Mesh(box, boxMaterial);
shadowTester.castShadow = true;
shadowTester.position.y = 2.5;
scene.add(shadowTester);

// Object Emission
const emissionLight = new THREE.PointLight('#6AE3FF', 2, 10); 
scene.add(emissionLight); 
emissionLight.castShadow = true;

// Text
const fontLoader = new FontLoader();

fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

	const text = new TextGeometry( 'Mykal Coleman', {
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

// scene.add(spotLight);
// scene.add(spotLight.target);


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
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 50;



// Render Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Background


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
	  emissionLight.shadow.bias = -0.009;
  
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
function animate() {
	requestAnimationFrame(animate);

	time += 0.01;

	// Rotate the mesh on a bias
	shadowTester.rotation.x = Math.sin(time) * Math.PI / 2; 
	shadowTester.rotation.y = Math.cos(time) * Math.PI / 4; 
  
	controls.update(); 

	// Flickering Effect
	const randomFactor = Math.random() * 0.2 - 0.1;
	let flickeringIntensity = emissionLight.intensity + randomFactor;
	emissionLight.intensity = flickeringIntensity
	if (emissionLight.intensity < 1.2) {
		emissionLight.intensity = 1.2;
	} else if (emissionLight.intensity > 2) {
		emissionLight.intensity = 2;
	}
	shadowTester.material.emissiveIntensity = flickeringIntensity

	emissionLight.position.copy(shadowTester.position); 
  
	composer.render(renderer);
	// renderer.render(scene, camera);
	

  };

animate ();		
