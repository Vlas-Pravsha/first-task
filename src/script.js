import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const GAP = 40;
const generateGap = (gap) => (Math.random() - 0.5) * gap;

const geometries = [
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
];

const materials = [
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("/textures/earth/aerial_rock_4k.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("/textures/fire/fire.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("/textures/water/water.jpg"),
  }),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("/textures/snow/snow_diff_4k.jpg"),
  }),
];

materials.forEach((material) => {
  material.colorSpace = THREE.SRGBColorSpace;
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const meshArray = [];

const generateBtn = document.getElementById("generate");
const explodeBtn = document.getElementById("explode");

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 10;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

generateBtn.addEventListener("click", (event) => {
  const x = parseInt(document.getElementById("x").value);
  const y = parseInt(document.getElementById("y").value);
  const z = parseInt(document.getElementById("z").value);

  scene.children = [];
  meshArray.length = 0;

  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      for (let k = 0; k < z; k++) {
        const material =
          materials[Math.floor(Math.random() * materials.length)];
        const geometry =
          geometries[Math.floor(Math.random() * geometries.length)];

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(i - x / 2 + 0.5, j - y / 2 + 0.5, k - z / 2 + 0.5);

        scene.add(mesh);
        meshArray.push(mesh);
      }
    }
  }
  event.preventDefault();
});

explodeBtn.addEventListener("click", () => {
  for (let mesh of meshArray) {
    gsap.to(mesh.position, {
      duration: 1,
      delay: 0,
      x: generateGap(GAP),
      y: generateGap(GAP),
      z: generateGap(GAP),
    });

    scene.add(mesh);
  }
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
