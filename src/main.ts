// src/main.ts
import * as THREE from "three";
import { GUI } from "lil-gui";
import { SceneView } from "./views/SceneView";
import { BallView } from "./views/BallView";
import { PhysicsController } from "./controllers/PhysicsController";
import { InputController } from "./controllers/InputController";
import { LevelController } from "./controllers/LevelController";
import { GameModel } from "./models/GameModel";
import { levels } from "./data/levels";
import { CameraController } from "./controllers/CameraController";

const sceneView = new SceneView();
const gameModel = new GameModel();
const levelLoader = new LevelController(levels);

const params = { pow: 2.5 };
const gui = new GUI();
gui.add(params, "pow", 0.0, 5.0).step(0.1).name("Power");

const radius = 0.035;
const ballView = new BallView(sceneView.scene, radius);
const physics = new PhysicsController({
  gravity: { x: 0, y: -9.81, z: 0 },
  ballRadius: radius,
  ballSpawn: { x: 0.5, y: 0.65, z: 0 },
  linvelThreshold: 0.025,
});
const input = new InputController();
const viewOffset = new THREE.Vector3(-1.75, 0.6, 0);

input.onShoot(() => {
  if (!physics.isStationary()) return;
  const sd = new THREE.Vector3().subVectors(
    ballView.ballMesh.position,
    sceneView.camera.position,
  );
  sd.y = 0;
  sd.normalize();
  physics.applyImpulse(sd.x * params.pow, 0, sd.z * params.pow);
  gameModel.incrementStrokes();
});

input.onReset(() => {
  physics.resetBall(0.5, 0.65, 0);
});

async function init() {
  await physics.init();

  const { scene, colliders } = await levelLoader.load(
    gameModel.currentHoleIndex,
  );
  sceneView.scene.add(scene);
  colliders.forEach((c) => physics.addTrimesh(c.vertices, c.indices));

  animate();
}

const cameraController = new CameraController(
  sceneView.camera,
  new THREE.Vector3(-1.75, 0.6, 0),
);

function animate() {
  requestAnimationFrame(animate);

  input.update();
  physics.step();

  const t = physics.getBallPosition();
  const r = physics.getBallQuaternion();
  ballView.sync(
    new THREE.Vector3(t.x, t.y, t.z),
    new THREE.Quaternion(r.x, r.y, r.z, r.w),
  );

  cameraController.update(ballView.ballMesh.position, input.getRotation());

  const aimDir = new THREE.Vector3().subVectors(
    ballView.ballMesh.position,
    sceneView.camera.position,
  );
  aimDir.y = 0;
  aimDir.normalize();
  ballView.updateArrow(aimDir, physics.isStationary());

  sceneView.render();
}

init();
