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
const cameraPosition = new THREE.Vector3(0, 5, 16);
camera.position.copy(cameraPosition);


// Scene 
scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(10,0,32)');
			
renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 3.5;
controls.maxDistance = 30;
controls.enableDamping = true;
controls.dampingFactor = .06;
controls.maxPolarAngle = Math.PI / 1.7;
controls.target.y = 5;


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

// Light Variables
let lightConstant = 2;
let switches1 = true;
let switches2 = true;
let switches3 = true;
let switches4 = true;

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
	emissiveIntensity: 2
})
const shadowTester = new THREE.Mesh(box, boxMaterial);
shadowTester.castShadow = true;
shadowTester.position.set(0, 2.5, 10);
shadowTester.name = 'CentralCube'
scene.add(shadowTester);

// Object Emission
const emissionLight = new THREE.PointLight('#6AE3FF', 2, 10); 
scene.add(emissionLight); 
emissionLight.castShadow = true;
emissionLight.position.copy(shadowTester.position); 

// Text
const fontLoader = new FontLoader();

fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
	// Line One (Name)
	const textLine1 = new TextGeometry( 'Mykal Coleman', {
		font: font,
		size: 0.6,
		height: .075,
		
	} );

	const textMaterial = new THREE.MeshStandardMaterial;
	const textMesh = new THREE.Mesh(textLine1, textMaterial)
	textMesh.position.x = 1;
	textMesh.position.z = 4;
	textMesh.rotation.x = (-Math.PI / 2);
	scene.add(textMesh);

	// Line Two 
	const textLine2 = new TextGeometry( 'Click the lights!\nSample Text\nSample Text', {
		font: font,
		size: 0.4,
		height: .05,
		
	} );

	const textMaterial2 = new THREE.MeshStandardMaterial;
	const textMesh2 = new THREE.Mesh(textLine2, textMaterial2)
	textMesh2.position.x = 1;
	textMesh2.position.z = 4.7;
	textMesh2.rotation.x = (-Math.PI / 2);
	scene.add(textMesh2);
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
spotLight.position.set(0, 5, 0); 
spotLight.target.position.set(0, 0, 0); 
spotLight.castShadow = true;

spotLight.intensity = 5;
spotLight.angle = Math.PI / 4; 
spotLight.penumbra = 0.1; 
spotLight.decay = 1; 
spotLight.distance = 200; 

// scene.add(spotLight);
// scene.add(spotLight.target);


///// Red Emissin Sphere /////
const pointLight = new THREE.PointLight();
pointLight.color.set('rgb(255, 10 ,20)');
pointLight.castShadow = true;

pointLight.intensity = 10;
pointLight.distance = 15;

scene.add(pointLight);

// Red Emission Sphere Mesh //
const sphere = new THREE.SphereGeometry(.3, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({
	color: 'rgb(255, 0, 0)',
	emissive: 'rgb(255, 100, 100)', 
})

const sphereOne = new THREE.Mesh(sphere, sphereMaterial);
sphereOne.name = 'ClickableSphere'
sphereOne.position.set(8, 3, 3);
scene.add(sphereOne);
//////

///// Green Emission Sphere //////
const pointLight2 = new THREE.PointLight();
pointLight2.color.set('rgb(20, 255 ,10)');
pointLight2.castShadow = true;

pointLight2.intensity = 20;
pointLight2.distance = 15;

scene.add(pointLight2);

// Sphere Mesh //
const sphere2 = new THREE.SphereGeometry(.3, 16, 16);
const sphere2Material = new THREE.MeshStandardMaterial({
	color: 'rgb(0, 255, 0)',
	emissive: 'rgb(100, 255, 100)', 
})

const sphereTwo = new THREE.Mesh(sphere2, sphere2Material);
sphereTwo.position.set(0, 4, 8);
sphereTwo.name = 'ClickableSphere2'
scene.add(sphereTwo);
//////

///// Blue Emission Sphere //////
const pointLight3 = new THREE.PointLight();
pointLight3.color.set('rgb(10, 20 ,255)');
pointLight3.castShadow = true;

pointLight3.intensity = 20;
pointLight3.distance = 15;

scene.add(pointLight3);

// Sphere Mesh //
const sphere3 = new THREE.SphereGeometry(.3, 16, 16);
const sphere3Material = new THREE.MeshStandardMaterial({
	color: 'rgb(0, 0, 255)',
	emissive: 'rgb(90, 120, 255)', 
})

const sphereThree = new THREE.Mesh(sphere3, sphere3Material);
sphereThree.position.set(-10, 2, 2);
sphereThree.name = 'ClickableSphere3'
scene.add(sphereThree);
//////

// Shadows
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 50;

// Render Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Fog 
scene.fog = new THREE.Fog( 'rgb(10,0,32)', 10, 27 );

// GLFT Loaders
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
  
	  //scene.add(temple);
	});

const loader2 = new GLTFLoader();
loader2.load('assets/baked_top_sign/Baked_top_sign.gltf', function (gltf) {
	const buildingSignTop = gltf.scene;
	scene.add(buildingSignTop);

});

const loader3 = new GLTFLoader();
loader3.load('assets/main_ac/ac_unit.gltf', function (gltf) {
	const mainAC = gltf.scene;
	scene.add(mainAC);
});

const loader4 = new GLTFLoader();
loader4.load('assets/building_sign_bar/bar_sign.gltf', function (gltf) {
	const signBar = gltf.scene;
	scene.add(signBar);

	signBar.traverse(function (child) {
		if (child.isMesh) {
			if (child.material.emissive !== undefined) {
				child.material.emissiveIntensity = 1.5; 
			}
		}
	});
});

const loader5 = new GLTFLoader();
loader5.load('assets/rain_cover/rain_cover.gltf', function (gltf) {
	const rainCover = gltf.scene;
	scene.add(rainCover);
})

const loader6 = new GLTFLoader();
loader6.load('assets/main_building/main_building.gltf', function (gltf) {
    const building = gltf.scene;
    scene.add(building);

    building.traverse(function (child) {
        if (child.isMesh) {
            if (child.material.emissive !== undefined) {
                child.material.emissiveIntensity = 1.2; 
            }
        }
    });
});

const loader7 = new GLTFLoader();
loader7.load('assets/street_lights/street_lights.gltf', function (gltf) {
    const streetLights = gltf.scene;
    scene.add(streetLights);
	streetLights.position.y = -0.2

    streetLights.traverse(function (child) {
        if (child.isMesh) {
            if (child.material.emissive !== undefined) {
                child.material.emissiveIntensity = 1.2; 
            }
        }
    });
});
const loader71 = new GLTFLoader();
loader71.load('assets/street_lights2/street_lights2.gltf', function (gltf) {
    const streetLights2 = gltf.scene;
    scene.add(streetLights2);
	streetLights2.position.y = -0.2

    streetLights2.traverse(function (child) {
        if (child.isMesh) {
            if (child.material.emissive !== undefined) {
                child.material.emissiveIntensity = 1.2; 
            }
        }
    });
});

const loader8 = new GLTFLoader();
loader8.load('assets/Vending1/street_lights.gltf', function (gltf) {
	const vending1 = gltf.scene;
	scene.add(vending1);
})

const loader9 = new GLTFLoader();
loader9.load('assets/vending2/vending2.gltf', function (gltf) {
	const vending2 = gltf.scene;
	scene.add(vending2);
})

const loader10 = new GLTFLoader();
loader10.load('assets/beer_crates/beer_crates.gltf', function (gltf) {
	const beer = gltf.scene;
	scene.add(beer);
})


  

// On click section
const clickableObjectNames = ['ClickableSphere', 'ClickableSphere2', 'ClickableSphere3', 'CentralCube'];
const switchesToggle = [switches1, switches2, switches3, switches4];

function onMouseClick(event) {
  
  const mouse = new THREE.Vector2();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);
  
	const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    
    for (let i = 0; i < clickableObjectNames.length; i++) {
      if (clickedObject.name === clickableObjectNames[i]) {
        console.log(`Sphere ${i + 1} clicked!`);
        switchesToggle[i] = !switchesToggle[i];
       
		console.log(`Value of switchesToggle[${i}]:`, switchesToggle[4]);
           
        break;
      }
    }
  }
}

renderer.domElement.addEventListener('click', onMouseClick, false);

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
	const randomFactor2 = Math.random() * 0.3 - 0.15;
	const randomFactor3 = Math.random() * 0.6 - 0.3;

	let flickeringIntensity = lightConstant + randomFactor;
	let flickeringIntensity2 = lightConstant + randomFactor2;
	let flickeringIntensity3 = lightConstant + randomFactor3;
	
	if (flickeringIntensity < 1) {
		flickeringIntensity = 1;
	} else if (flickeringIntensity > 2) {
		flickeringIntensity = 2;
	}

	if (flickeringIntensity2 < 1) {
		flickeringIntensity2 = 1;
	} else if (flickeringIntensity2 > 3) {
		flickeringIntensity2 = 2;
	}

	if (flickeringIntensity3 < 1) {
		flickeringIntensity3 = 1;
	} else if (flickeringIntensity3 > 4) {
		flickeringIntensity3 = 4;
	}

	// Point One // 
	if (switchesToggle[0]) {
		pointLight.intensity = (flickeringIntensity * 2) + 9;
		sphereOne.material.emissiveIntensity = flickeringIntensity2;
	} else {
		pointLight.intensity = 0;
		sphereOne.material.emissiveIntensity = 0;
	}
	pointLight.position.copy(sphereOne.position);
	

	// Point Two //
	if (switchesToggle[1]) {
		pointLight2.intensity = (flickeringIntensity2 * 2) + 9;
		sphereTwo.material.emissiveIntensity = flickeringIntensity2;
	} else {
		pointLight2.intensity = 0;
		sphereTwo.material.emissiveIntensity = 0;
	}
	pointLight2.position.copy(sphereTwo.position);
	

	// Point Three //
	if (switchesToggle[2]) {
		pointLight3.intensity = (flickeringIntensity3) + 9;
		sphereThree.material.emissiveIntensity = flickeringIntensity3;
	} else {
		pointLight3.intensity = 0;
		sphereThree.material.emissiveIntensity = 0;
	}
	pointLight3.position.copy(sphereThree.position);

	// Central Cube light 
	if (switchesToggle[3]) {
		shadowTester.material.emissiveIntensity = 2;
		emissionLight.intensity = 2;
	} else {
		shadowTester.material.emissiveIntensity = 0;
		emissionLight.intensity = 0;
	}
	
	composer.render(renderer);
	// renderer.render(scene, camera);
  };

animate ();		