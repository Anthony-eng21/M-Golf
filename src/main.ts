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

const params = { pow: 2.5, chipPow: 0 };
const gui = new GUI();
gui.add(params, "pow", 0.1, 5.0).step(0.1).name("Power").listen();
gui.add(params, "chipPow", 0.0, 2.5).step(0.1).name("Chip Power").listen();

const radius = 0.035;
const ballView = new BallView(sceneView.scene, radius);
const physics = new PhysicsController({
  gravity: { x: 0, y: -9.81, z: 0 },
  ballRadius: radius,
  ballSpawn: { x: 0.5, y: 0.65, z: 0 },
  linvelThreshold: 0.025,
  fallThreshold: levels[gameModel.currentHoleIndex].fallThreshold,
});
const input = new InputController();

input.onShoot(() => {
  if (!physics.isStationary()) return;
  const shotDir = new THREE.Vector3().subVectors(
    ballView.ballMesh.position,
    sceneView.camera.position,
  );
  shotDir.y = 0;
  shotDir.normalize();
  physics.applyImpulse(
    shotDir.x * params.pow,
    params.chipPow * 0.5,
    shotDir.z * params.pow,
  );
  gameModel.incrementStrokes();
});

input.onReset(() => {
  physics.resetBall();
});

input.onResetToSpawn(() => {
  physics.resetToSpawn();
  gameModel.resetStrokes();
  params.pow = 2.5;
  params.chipPow = 0;
});

physics.onHoleEntered(() => {
  console.log(`Strokes Taken: ${gameModel.strokes}`);
  gameModel.resetStrokes();
  params.pow = 2.5;
  params.chipPow = 0;
});

async function init() {
  await physics.init();

  const { scene, colliders, triggers } = await levelLoader.load(
    gameModel.currentHoleIndex,
  );
  sceneView.scene.add(scene);
  colliders.forEach((c) => physics.addTrimesh(c.vertices, c.indices));
  triggers.forEach((t) => physics.addSensor(t.vertices, t.indices));

  animate();
}

const cameraController = new CameraController(
  sceneView.camera,
  new THREE.Vector3(-1.75, 0.7, 0),
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
