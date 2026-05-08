import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import RAPIER from "@dimforge/rapier3d-compat";
import resize from "./utils";
import { GUI } from "lil-gui";

const params = {
  pow: 2.5,
};

const gui = new GUI();
gui.add(params, "pow", 0.0, 5.0).step(0.1).name("Power");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const radius = 0.035;
const linvelReady = 0.025;
const ballMesh = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffffff }),
);
scene.add(ballMesh);

const arrowHelper = new THREE.ArrowHelper(
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(),
  0.5,
  0xff0000,
);
scene.add(arrowHelper);

let world: RAPIER.World;
let ballBody: RAPIER.RigidBody;
let debugLines: THREE.LineSegments;
const keys: Record<string, boolean> = {};
let currentRotation = 0;
const viewOffset = new THREE.Vector3(-1.75, 0.6, 0);

async function init() {
  await RAPIER.init();
  world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.5, 0.65, 0)
    .setLinearDamping(0.8)
    .setAngularDamping(0.8)
    .setCcdEnabled(true);
  ballBody = world.createRigidBody(bodyDesc);

  const ballCollider = RAPIER.ColliderDesc.ball(radius)
    .setRestitution(0.0)
    .setFriction(1.5)
    .setMass(0.075)
    .setContactSkin(0.01);
  world.createCollider(ballCollider, ballBody);

  const debugMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
  });
  debugLines = new THREE.LineSegments(
    new THREE.BufferGeometry(),
    debugMaterial,
  );
  //scene.add(debugLines);

  const LevelData = [
    { model: "/m-golf-hole-1.glb", MeshNames: ["Track_Visual", "Track_Collider"] },
    { model: "/m-golf-hole-2.glb", MeshNames: ["2_Track_Visual", "2_Track_Collider"] },
  ]
  const currentLevelIndex = 1 
  const level = LevelData[currentLevelIndex]
  const loader = new GLTFLoader();
  loader.load(level.model, (gltf) => {
    const visualMesh = gltf.scene.getObjectByName(level.MeshNames[0]) as THREE.Mesh;
    const colliderMesh = gltf.scene.getObjectByName(
      level.MeshNames[1]
    ) as THREE.Mesh;

    if (!colliderMesh || !visualMesh) {
      console.error("Missing meshes!");
      return;
    }
    colliderMesh.visible = false;

    colliderMesh.updateWorldMatrix(true, false);
    const geom = colliderMesh.geometry
      .clone()
      .applyMatrix4(colliderMesh.matrixWorld);

    const vertices = geom.attributes.position.array as Float32Array;
    const indices = geom.index
      ? (geom.index.array as Uint32Array)
      : new Uint32Array(vertices.length / 3).map((_, i) => i);

    const worldBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const worldBody = world.createRigidBody(worldBodyDesc);

    const worldCollider = RAPIER.ColliderDesc.trimesh(
      vertices,
      indices,
      RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
    )
      .setRestitution(0.1)
      .setFriction(0.7)
      .setContactSkin(0.01);

    world.createCollider(worldCollider, worldBody);

    scene.add(gltf.scene);
  });

  animate();
}

window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "Space") {
    const v = ballBody.linvel();
    if (Math.sqrt(v.x ** 2 + v.z ** 2) < linvelReady) {
      const sd = new THREE.Vector3().subVectors(
        ballMesh.position,
        camera.position,
      );
      sd.y = 0;
      sd.normalize();
      const pow = params.pow;
      const impulse = { x: sd.x * pow, y: 0, z: sd.z * pow };
      ballBody.applyImpulse(impulse, true);
    }
  }
  if (e.code === "KeyR") {
    ballBody.setTranslation({ x: 0.5, y: 0.65, z: 0 }, false);
    ballBody.setAngvel({ x: 0, y: 0, z: 0 }, false);
    ballBody.setLinvel({ x: 0, y: 0, z: 0 }, false);
  }
});

window.addEventListener("keyup", (e) => (keys[e.code] = false));

resize(camera, renderer);

function animate() {
  requestAnimationFrame(animate);

  if (keys["KeyD"] || keys["ArrowRight"]) currentRotation -= 0.03;
  if (keys["KeyA"] || keys["ArrowLeft"]) currentRotation += 0.03;
  world.step();

  const { vertices, colors } = world.debugRender();
  debugLines.geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3),
  );
  debugLines.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 4),
  );

  const t = ballBody.translation();
  const r = ballBody.rotation();
  ballMesh.position.set(t.x, t.y, t.z);
  ballMesh.quaternion.set(r.x, r.y, r.z, r.w);

  const rotatedOffset = new THREE.Vector3()
    .copy(viewOffset)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), currentRotation);
  camera.position.copy(ballMesh.position).add(rotatedOffset);
  camera.lookAt(ballMesh.position);

  const aimDir = new THREE.Vector3().subVectors(
    ballMesh.position,
    camera.position,
  );
  aimDir.y = 0;
  aimDir.normalize();
  arrowHelper.setDirection(aimDir);
  arrowHelper.position.copy(ballMesh.position);

  const v = ballBody.linvel();
  arrowHelper.visible = Math.sqrt(v.x ** 2 + v.z ** 2) < linvelReady;

  renderer.render(scene, camera);
}

init();
