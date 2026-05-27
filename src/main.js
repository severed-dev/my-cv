import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import space from './space.jpg';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
torus.position.set(5, 0, -30);
scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(50, 25, 100);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(pointLight, ambientLight);

renderer.render(scene, camera);

// HELPERS
// scene.add(new THREE.PointLightHelper(pointLight));
// scene.add(new THREE.GridHelper(200, 50));
// scene.add(new THREE.AxesHelper(5));
// scene.add(new THREE.CameraHelper(camera));
// scene.add(new THREE.PolarGridHelper(10,16,8,64));

const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });

function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

const textureLoader = new THREE.TextureLoader();
const spaceTexture = textureLoader.load(space);
scene.background = spaceTexture;
const profileTexture = textureLoader.load('eye.jpg');
const profileCube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: profileTexture }));
profileCube.position.set(20, 0, 0);
scene.add(profileCube);

function addBody(posX, posY, posZ, bodyFile, textureFile) {
  const bodyTexture = textureLoader.load(bodyFile);
  const normalTexture = textureFile === undefined ? null : textureLoader.load(textureFile);
  
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshPhongMaterial({ map: bodyTexture, normalMap: normalTexture })
  );
  body.position.set(posX, posY, posZ);
  scene.add(body);
  return body;
}

const moon = addBody(-10, 0, 30, 'src/moon.jpg', 'src/normal.jpg');
const sun = addBody(10, 0, 40, 'src/1024px-Solarsystemscope_texture_2k_sun.jpg');

const qrHelloWorld = new THREE.MeshBasicMaterial({ map: textureLoader.load('src/qr-hello-world.png') });
const qrLorumIpsum = new THREE.MeshBasicMaterial({ map: textureLoader.load('/src/qr-lorum-ipsum.png') });
const qrCube = new THREE.Mesh(new THREE.BoxGeometry(16, 16, 16), [qrHelloWorld, qrLorumIpsum, qrHelloWorld, qrHelloWorld, qrLorumIpsum, qrHelloWorld]);
qrCube.position.set(40, -30, 5);
qrCube.rotation.set(-0.4, -1.2, -0.2);
scene.add(qrCube);

function moveCamera() {
  const top = document.body.getBoundingClientRect().top;

  profileCube.rotation.z = top * 0.005;
  profileCube.rotation.y = top * 0.0007;
  camera.position.z = top * -0.01;
  camera.position.x = top * -0.0002;
  camera.rotation.y = top * -0.02;
}
document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.03;
  torus.rotation.z += 0.08;
  moon.rotation.y += 0.0075;
  moon.rotation.z += 0.0075;
  sun.rotation.y += 0.001;
  qrCube.rotateY(0.01);

  controls.update(); // doesn't seem to make a difference
  renderer.render(scene, camera);
}

animate();
