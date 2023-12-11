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
scene.background = new THREE.Color('rgb(8,0,22)');
			
renderer = new THREE.WebGLRenderer( { alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 3.5;
controls.maxDistance = 30;
controls.enableDamping = true;
controls.dampingFactor = .06;
controls.maxPolarAngle = Math.PI / 1.9;
controls.target.y = 4;


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
const geometry = new THREE.CircleGeometry(60, 32);
const material = new THREE.MeshStandardMaterial({ color: 'rgb(50,50,30)' });
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
plane.rotation.x = (-Math.PI / 2);
scene.add(plane);



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
	textMesh.position.z = 4+8;
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
	textMesh2.position.z = 4.7+8;
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

// Fog 
scene.fog = new THREE.Fog( 'rgb(8,0,22)', 10, 50 );

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

//// Top Building Sign ////
const loader2 = new GLTFLoader();
let topSign;
loader2.load('assets/baked_top_sign/Baked_top_sign.gltf', function (gltf) {
	topSign = gltf.scene;
	scene.add(topSign);
	topSign.traverse( function (child) {
		if (child.isMesh) {
			child.castShadow = true;
			child.name = 'Top Sign'
		  	child.receiveShadow = true;
			if (child.material.emissive !== undefined) {
				child.material.emissiveIntensity = 1.5; 
			}
		}
	})

});

let topSignSwitch = true;

// Box
const box = new THREE.BoxGeometry(.05,.05,.05);
const boxMaterial = new THREE.MeshStandardMaterial({
	color: 'rgb(255, 200. 85)',
	emissive: 'rgb(255, 200, 85)', 
	emissiveIntensity: 0
})
const shadowTester = new THREE.Mesh(box, boxMaterial);
shadowTester.castShadow = true;
shadowTester.position.set(5.76, 9.7, 2);
shadowTester.name = 'CentralCube'
scene.add(shadowTester);

// Object Emission
const emissionLight = new THREE.PointLight('rgb(255, 200, 85)', 2, 14); 
scene.add(emissionLight); 
emissionLight.castShadow = true;
emissionLight.position.copy(shadowTester.position); 
///////////////////////////////////

//// Main Building AC Unit ////
const loader3 = new GLTFLoader();
loader3.load('assets/main_ac/ac_unit.gltf', function (gltf) {
	const mainAC = gltf.scene;
	scene.add(mainAC);
});

//// Main Building Bar Sign ////
let signBar;
const loader4 = new GLTFLoader();
loader4.load('assets/building_sign_bar/bar_sign.gltf', function (gltf) {
	signBar = gltf.scene;
	scene.add(signBar);

	signBar.traverse(function (child) {
		if (child.isMesh) {
			child.castShadow = true;
			child.name = 'Bar Sign'
		  	child.receiveShadow = true;
			if (child.material.emissive !== undefined) {
				child.material.emissiveIntensity = 1.5; 
			}
		}
	});
});

let barSignSwitch = true

///// Green Emission Sphere //////
const pointLight2 = new THREE.PointLight();
pointLight2.color.set('rgb(255, 140 ,40)');
pointLight2.castShadow = true;

pointLight2.intensity = 20;
pointLight2.distance = 15;

scene.add(pointLight2);

// Sphere Mesh //
const sphere2 = new THREE.SphereGeometry(.2, 16, 16);
const sphere2Material = new THREE.MeshStandardMaterial({
	color: 'rgb(255, 170, 0)',
	emissive: 'rgb(255, 170, 0)', 
})

const sphereTwo = new THREE.Mesh(sphere2, sphere2Material);
sphereTwo.position.set(3, 4.85, 1.5);
sphereTwo.name = 'ClickableSphere2'
scene.add(sphereTwo);
////////////////////////////////////

//// Main Building Rain Cover ////
const loader5 = new GLTFLoader();
loader5.load('assets/rain_cover/rain_cover.gltf', function (gltf) {
	const rainCover = gltf.scene;
	scene.add(rainCover);
})

//// Main Building ////
let building;
const loader6 = new GLTFLoader();
loader6.load('assets/main_building/main_building.gltf', function (gltf) {
    building = gltf.scene;
    scene.add(building);
	
	building.position.y = -0.1

    building.traverse(function (child) {
        if (child.isMesh) {
			child.castShadow = true;
			child.name = 'mainBuildingFront';
		  	child.receiveShadow = true;
            if (child.material.emissive !== undefined) {
                child.material.emissiveIntensity = 1.2; 
            }
        }
    });
});

let mainBuildingSwitch = true;


/// Main Building Light ///
const pointLight = new THREE.PointLight();
pointLight.color.set('rgb(230, 200, 100)');
pointLight.castShadow = true;

pointLight.intensity = 10;
pointLight.distance = 15;

scene.add(pointLight);

// Light Indicator //
const sphere = new THREE.SphereGeometry(.3, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({
	color: 'rgb(255, 255, 0)',
	emissive: 'rgb(230, 200, 100)', 
})

const sphereOne = new THREE.Mesh(sphere, sphereMaterial);
sphereOne.name = 'ClickableSphere'
sphereOne.position.set(3, 1.8, .8);
scene.add(sphereOne);
/////////////////////////////////////////////////

//// Street Light One ////
const loader7 = new GLTFLoader();
let lampOne;
loader7.load('assets/street_lights/street_lights.gltf', function (gltf) {
    lampOne = gltf.scene;
    scene.add(lampOne);
	lampOne.position.y = -0.2

    lampOne.traverse(function (child) {
        if (child.isMesh) {
			child.name = 'Lamp One'
			child.castShadow = true;
		  	child.receiveShadow = true;
            if (child.material.emissive !== undefined) {
                child.material.emissiveIntensity = 1.2; 
            }
        }
    });
});

let lampSwitch1 = true;

// Spot Light
const spotLight = new THREE.SpotLight('rgb(230, 200, 100)'); 
spotLight.position.set(-6.5, 5.3, 3.5); 
spotLight.target.position.set(-6.5, 0, 3.5); 
spotLight.castShadow = true;

spotLight.intensity = 5;
spotLight.angle = Math.PI / 4; 
spotLight.penumbra = 0.1; 
spotLight.decay = 1; 
spotLight.distance = 200; 

scene.add(spotLight);
scene.add(spotLight.target);

//// Street Light Two ////
const loader71 = new GLTFLoader();
let lampTwo;
loader71.load('assets/street_lights2/street_lights2.gltf', function (gltf) {
    lampTwo = gltf.scene;
    scene.add(lampTwo);
	lampTwo.position.y = -0.2

    lampTwo.traverse(function (child) {
        if (child.isMesh) {
			child.name = 'Lamp Two'
			child.castShadow = true;
		  	child.receiveShadow = true;
            if (child.material.emissive !== undefined) {
                child.material.emissiveIntensity = 1.2; 
            }
        }
    });
});

let lampSwitch2 = true;
// Spot Light 2
const spotLight2 = new THREE.SpotLight('rgb(230, 200, 100)'); 
spotLight2.position.set(9.5, 5.3, 3.5); 
spotLight2.target.position.set(9.4, 0, 3.5); 
spotLight2.castShadow = true;

spotLight2.intensity = 5;
spotLight2.angle = Math.PI / 4; 
spotLight2.penumbra = 0.1; 
spotLight2.decay = 1; 
spotLight2.distance = 200; 

scene.add(spotLight2);
scene.add(spotLight2.target);

//// Vending Machine White ////
const loader8 = new GLTFLoader();
let vendingWhite;
loader8.load('assets/Vending1/vending1.gltf', function (gltf) {
	vendingWhite = gltf.scene;
	scene.add(vendingWhite);

	vendingWhite.traverse((child) => {
		if (child.isMesh) {
		  child.geometry.computeVertexNormals();
		  child.castShadow = true;
		  child.receiveShadow = true;
		  child.name = 'Vending White'

		  if (child.material.emissive !== undefined) {
			child.material.emissiveIntensity = 1.2; 
		}
		}
	  });
  
})

let vendingWhiteSwitch = true;

//// Vending Machine Red ////
const loader9 = new GLTFLoader();
let vendingRed;
loader9.load('assets/vending2/vending2.gltf', function (gltf) {
	vendingRed = gltf.scene;
	scene.add(vendingRed);

	vendingRed.traverse((child) => {
		if (child.isMesh) {
		  child.geometry.computeVertexNormals();
		  child.castShadow = true;
		  child.receiveShadow = true;
		  child.name = 'Vending Red'

		  if (child.material.emissive !== undefined) {
			child.material.emissiveIntensity = 1.2; 
		}
		}
	  });
})

let vendingRedSwitch = true;

//// Pile of Beer Crates ////
const loader10 = new GLTFLoader();
loader10.load('assets/beer_crates/beer_crates.gltf', function (gltf) {
	const beer = gltf.scene;
	scene.add(beer);

	beer.traverse((child) => {
		if (child.isMesh) {
		  child.geometry.computeVertexNormals();
  
		  child.castShadow = true;
		  child.receiveShadow = true;
		}
	  });
})

//// Scene Ground ////
const loader11 = new GLTFLoader();
loader11.load('assets/ground/ground.gltf', function (gltf) {
	const ground = gltf.scene;
	scene.add(ground);

	ground.traverse((child) => {
		if (child.isMesh) {
		  child.geometry.computeVertexNormals();
  
		  child.castShadow = true;
		  child.receiveShadow = true;
		}
	  });
})

//// Ground Sign One ////
const pointLightSign = new THREE.PointLight();
const loader12 = new GLTFLoader();
let sign;
loader12.load('assets/sign1/sign1.gltf', function (gltf) {
	sign = gltf.scene;
	scene.add(sign);

	pointLightSign.shadow.bias = -0.009;

	sign.traverse(function (child) {
        if (child.isMesh) {
			child.name = 'Sign';
			child.castShadow = true;
		  	child.receiveShadow = true;
            if (child.material.emissive !== undefined) {
                child.material.emissiveIntensity = 1; 
            }
        }
    });
})

let signSwitch = true

/// Main Building Light ///

pointLightSign.color.set('rgb(255, 255, 255)');
pointLightSign.castShadow = true;

pointLightSign.intensity = 10;
pointLightSign.distance = 15;
pointLightSign.position.set(6.34, 1.3, 4.2);

scene.add(pointLightSign);

// Light Indicator //
const sphereSign = new THREE.SphereGeometry(.02, 16, 16);
const sphereMaterialSign = new THREE.MeshStandardMaterial({
	color: 'rgb(255, 255, 255)',
	emissive: 'rgb(255, 255, 255)', 
})

const signTargtet = new THREE.Mesh(sphereSign, sphereMaterialSign);
scene.add(signTargtet);
/////////////////////////////////////////////////

//// 711 ////
const loader13 = new GLTFLoader();
let seven11;
loader13.load('assets/711/711.gltf', function (gltf) {
	seven11 = gltf.scene;
	scene.add(seven11);

	seven11.traverse(function (child) {
        if (child.isMesh) {
			child.name = '711';
			child.castShadow = true;
		  	child.receiveShadow = true;
            if (child.material.emissive !== undefined) {
                child.material.emissiveIntensity = .5; 
            }
        }
    });
})

let seven11Switch = true;

///// Blue Emission Sphere //////
const pointLight3 = new THREE.PointLight();
pointLight3.color.set('rgb(255, 255 ,220)');
pointLight3.castShadow = true;

pointLight3.distance = 20;

scene.add(pointLight3);

// Sphere Mesh //
const sphere3 = new THREE.SphereGeometry(.1, 16, 16);
const sphere3Material = new THREE.MeshStandardMaterial({
	color: 'rgb(255, 255 ,220)',
	emissive: 'rgb(255, 255 ,220)', 
})

const sphereThree = new THREE.Mesh(sphere3, sphere3Material);
sphereThree.position.set(-7.4, 4.9, .75);
sphereThree.name = 'ClickableSphere3'
scene.add(sphereThree);
//////

// On click section
const clickableObjectNames = ['ClickableSphere', 'ClickableSphere2', 'ClickableSphere3', 'CentralCube', 'mainBuildingFront', 'Bar Sign', 'Top Sign', '711', 'Vending White', 'Vending Red', 'Lamp One', 'Lamp Two', 'Sign'];
const switchesToggle = [switches1, switches2, switches3, switches4, mainBuildingSwitch, barSignSwitch, topSignSwitch, seven11Switch, vendingWhiteSwitch, vendingRedSwitch, lampSwitch1, lampSwitch2, signSwitch];

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
        console.log(`Object ${i + 1} clicked!`);
        switchesToggle[i] = !switchesToggle[i];
       
		console.log(`Value of switchesToggle[${i}]:`, switchesToggle[5]);
           
        break;
      }
    } 
	}
}	

// Shadows
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 50;

// Render Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.domElement.addEventListener('click', onMouseClick, false);

// Render
function animate() {
	requestAnimationFrame(animate);

  
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

	// Main Building Front // 
	if (switchesToggle[4]) {
		pointLight.intensity = 9;
		if (building) {
			building.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 1; 
					}
				}
			});
		}
		
	} else {
		pointLight.intensity = 0;
		if (building) {
			building.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 0; 
					}
				}
			});
		}
		
	}
	pointLight.position.copy(sphereOne.position);
	

	// Bar Sign //
	if (switchesToggle[5]) {
		pointLight2.intensity =  9;
		if (signBar) {
			signBar.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 1; 
					}
				}
			});
		}
	} else {
		pointLight2.intensity = 0;
		if (signBar) {
			signBar.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 0; 
					}
				}
			});
		}
	}
	pointLight2.position.copy(sphereTwo.position);
	

	// 711 Light //
	if (switchesToggle[7]) {
		pointLight3.intensity = (flickeringIntensity3) + 12;
		if (seven11) {
			seven11.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = .7; 
					}
				}
			});
		}
	} else {
		pointLight3.intensity = 0;
		if (seven11) {
			seven11.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 0; 
					}
				}
			});
		}
	}
	pointLight3.position.copy(sphereThree.position);

	// Top Sign Light 
	if (switchesToggle[6]) {
		emissionLight.intensity =  4;
		if (topSign) {
			topSign.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 1; 
					}
				}
			});
		}
	} else {
		emissionLight.intensity = 0;
		if (topSign) {
			topSign.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 0; 
					}
				}
			});
		}
	}
	
	// Vending White //
	if (switchesToggle[8]) {
		if (vendingWhite) {
			vendingWhite.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 1; 
					}
				}
			});
		}
	} else {
		if (vendingWhite) {
			vendingWhite.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 0; 
					}
				}
			});
		}
	}

	// Vending Red //
	if (switchesToggle[9]) {
		if (vendingRed) {
			vendingRed.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 1; 
					}
				}
			});
		}
	} else {
		if (vendingRed) {
			vendingRed.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 0; 
					}
				}
			});
		}
	}

	// Street Light One //
	if (switchesToggle[10]) {
		spotLight.intensity = (flickeringIntensity3 * 7) - 5;
		if (lampOne) {
			lampOne.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 1; 
					}
				}
			});
		}
	} else {
		spotLight.intensity = 0;
		if (lampOne) {
			lampOne.traverse(function (child) {
				if (child.isMesh) {
					if (child.material.emissive !== undefined) {
						child.material.emissiveIntensity = 0; 
					}
				}
			});
		}
	}

// Street Light Two//
if (switchesToggle[11]) {
	spotLight2.intensity = (flickeringIntensity2 * 7) + 2;
	if (lampTwo) {
		lampTwo.traverse(function (child) {
			if (child.isMesh) {
				if (child.material.emissive !== undefined) {
					child.material.emissiveIntensity = 1; 
				}
			}
		});
	}
} else {
	spotLight2.intensity = 0;
	if (lampTwo) {
		lampTwo.traverse(function (child) {
			if (child.isMesh) {
				if (child.material.emissive !== undefined) {
					child.material.emissiveIntensity = 0; 
				}
			}
		});
	}
}

// Street Sign//
if (switchesToggle[12]) {
	pointLightSign.intensity = 4;
	if (sign) {
		sign.traverse(function (child) {
			if (child.isMesh) {
				if (child.material.emissive !== undefined) {
					child.material.emissiveIntensity = 1; 
				}
			}
		});
	}
} else {
	pointLightSign.intensity = 0;
	if (sign) {
		sign.traverse(function (child) {
			if (child.isMesh) {
				if (child.material.emissive !== undefined) {
					child.material.emissiveIntensity = 0; 
				}
			}
		});
	}
}


	composer.render(renderer);
	// renderer.render(scene, camera);
  };

animate ();		