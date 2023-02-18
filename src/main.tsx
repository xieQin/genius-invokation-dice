import "./main.css";

import * as dat from "dat.gui";
import debounce from "lodash.debounce";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("[data-canvas]") as HTMLCanvasElement;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new dat.GUI();
const debugObject = {
  color: "#FF00CC",
  radius: 1,
  detail: 0,
};

const onResize = () => {
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, -2);
scene.add(camera);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: debugObject.color });
const vertices = [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1];
const indices = [
  0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2,
];
const octahedronGeometryGeometry = new THREE.OctahedronGeometry(
  debugObject.radius,
  debugObject.detail
);
// const octahedronGeometryMaterial = new THREE.MeshBasicMaterial({ color: debugObject.color });

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// const octahedronGeometry = new THREE.Mesh(octahedronGeometryMaterial);
scene.add(cube);
// scene.add(octahedronGeometry);

gui
  .addColor(debugObject, "color")
  .name("Color")
  .onChange(() => {
    cubeMaterial.color = new THREE.Color(debugObject.color);
  });
// gui
//   .add(cube.rotation, "x")
//   .min(0)
//   .max(Math.PI * 2)
//   .step(0.01)
//   .name("RotationX");
// gui
//   .add(cube.rotation, "y")
//   .min(0)
//   .max(Math.PI * 2)
//   .step(0.01)
//   .name("RotationY");
// gui
//   .add(cube.rotation, "z")
//   .min(0)
//   .max(Math.PI * 2)
//   .step(0.01)
//   .name("RotationZ");
gui.addFolder("THREE.OctahedronGeometry");
gui.add(debugObject, "radius").min(0).max(20).step(0.01).name("radius");
gui.add(debugObject, "detail").min(0).max(5).step(0.01).name("detail");

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

window.addEventListener("resize", debounce(onResize, 100));
tick();

if (import.meta.env.PROD) {
  gui.hide();
  window.showGUI = () => gui.show();
}
