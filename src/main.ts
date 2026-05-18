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
import { OverlayController } from "./controllers/OverlayController";

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
  ballSpawn: levels[gameModel.currentHoleIndex].spawn,
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
  input.resetRotation();
});

const overlay = new OverlayController(gameModel, {
  onReplay: () => {
    overlay.hideOverlay();
    physics.resetToSpawn();
    gameModel.resetStrokes();
    input.enable();
  },
  onNextLevel: async () => {
    overlay.hideOverlay();
    gameModel.nextHole();
    await loadLevel(gameModel.currentHoleIndex);
    overlay.showOverlay("start");
    params.pow = 2.5;
    params.chipPow = 0;
    input.resetRotation();
  },
  onPlay: () => {
    overlay.hideOverlay();
    input.enable();
  },
});

async function loadLevel(idx: number): Promise<void> {
  const { scene, colliders, triggers } = await levelLoader.load(idx);
  physics.setSpawn(levels[idx].spawn);
  physics.setFallThreshold(levels[idx].fallThreshold ?? -3);
  physics.resetWorld();
  sceneView.setLevel(scene);

  colliders.forEach((c) => physics.addTrimesh(c.vertices, c.indices));
  triggers.forEach((t) => physics.addSensor(t.vertices, t.indices));

  physics.onHoleEntered(() => {
    input.disable();
    overlay.showOverlay("complete");
  });
}

async function init() {
  await physics.init();
  await loadLevel(gameModel.currentHoleIndex);
  overlay.showOverlay("start");
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
