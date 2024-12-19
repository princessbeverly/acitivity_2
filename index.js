import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

scene.background = new THREE.Color(0xe4e0ba); // Replace with your desired color

// Load the GLTF model
const loader = new GLTFLoader();
let model; // Store the loaded model
loader.load(
    './donut.glb', // Ensure this path is correct relative to your HTML or JS file
    function (glb) {
        console.log(glb);
        model = glb.scene;
        scene.add(model);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
        console.error('An error occurred:', error);
    }
);

// Adding Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Adding Directional Light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(1, 0.5, 0)
scene.add(directionalLight)

// Addingg HemisphereLight

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

// Adding PointLight
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

// SpotLight
const spotLight = new THREE.SpotLight(0x078ff0, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3)
spotLight.target.position.x = -0.75
scene.add(spotLight.target)
scene.add(spotLight)


// Sizes
const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.set(0, 1, 2);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, // Enables smoother edges
});

renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
directionalLight.castShadow = true
console.log(directionalLight.castShadow)
if (model) {
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth damping effect

// Update on window resize
window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate);

    controls.update(); // Update controls for damping effect
    renderer.render(scene, camera);
};
animate();
