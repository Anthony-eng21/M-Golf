import * as THREE from "three";

import { SceneView } from "./views/SceneView";
import { BallView } from "./views/BallView";

import { PhysicsController } from "./controllers/PhysicsController";
import { InputController } from "./controllers/InputController";
import { LevelController } from "./controllers/LevelController";
import { CameraController } from "./controllers/CameraController";
import { OverlayController } from "./controllers/OverlayController";

import { GameModel } from "./models/GameModel";
import { levels } from "./data/levels";
import { HUDView } from "./views/HUDView";

const sceneView = new SceneView();
const gameModel = new GameModel();
const levelLoader = new LevelController(levels);

const radius = 0.035;
const ballView = new BallView(sceneView.scene, radius);
const hudView = new HUDView();
const physics = new PhysicsController({
  gravity: { x: 0, y: -9.81, z: 0 },
  ballRadius: radius,
  ballSpawn: levels[gameModel.currentHoleIndex].spawn,
  linvelThreshold: 0.05,
  fallThreshold: levels[gameModel.currentHoleIndex].fallThreshold,
});
const input = new InputController();

const resetBallInput = (): void => {
  hudView.setSliderValues();
  input.resetRotation();
};

input.onShoot(() => {
  if (!physics.isStationary()) return;
  const { pow, chip } = hudView.getSliderValues();
  const shotDir = new THREE.Vector3().subVectors(
    ballView.ballMesh.position,
    sceneView.camera.position,
  );
  shotDir.y = 0;
  shotDir.normalize();
  physics.applyImpulse(shotDir.x * pow, chip * 0.5, shotDir.z * pow);
  gameModel.incrementStrokes();
});

input.onResetToSpawn(() => {
  physics.resetToSpawn();
  gameModel.resetStrokes();
  resetBallInput();
});

const overlay = new OverlayController(gameModel, {
  onReplay: () => {
    overlay.hideOverlay();
    hudView.showSliders();
    physics.resetToSpawn();
    gameModel.resetStrokes();
    input.enable();
    resetBallInput();
  },
  onNextLevel: async () => {
    if (gameModel.isLastHole()) {
      gameModel.commitStrokes();
      overlay.showOverlay("summary");
      return;
    }
    gameModel.commitStrokes();
    overlay.hideOverlay();
    gameModel.nextHole();
    physics.setSpawn(levels[gameModel.currentHoleIndex].spawn);
    physics.setFallThreshold(
      levels[gameModel.currentHoleIndex].fallThreshold ?? -3,
    );
    await loadLevel(gameModel.currentHoleIndex);
    overlay.showOverlay("start");
    resetBallInput();
  },
  onPlay: () => {
    overlay.hideOverlay();
    hudView.showSliders();
    input.enable();
  },
  onPlayAgain: async () => {
    gameModel.resetGame();
    resetBallInput();
    physics.setSpawn(levels[0].spawn);
    physics.setFallThreshold(levels[0].fallThreshold ?? -3);
    await loadLevel(0);
    overlay.showOverlay("start");
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
    hudView.hideSliders();
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

const clock = new THREE.Clock();
let physicsAccumulator = 0;
const PHYSICS_TIMESTEP = 1 / 60;

function animate() {
  requestAnimationFrame(animate);
  const { pow, chip } = hudView.getSliderValues();

  const deltaTime = Math.min(clock.getDelta(), 0.1);
  physicsAccumulator += deltaTime;

  input.update();
  while (physicsAccumulator >= PHYSICS_TIMESTEP) {
    physics.step();
    physicsAccumulator -= PHYSICS_TIMESTEP;
  }
  const t = physics.getBallPosition();
  const r = physics.getBallQuaternion();
  ballView.sync(
    new THREE.Vector3(t.x, t.y, t.z),
    new THREE.Quaternion(r.x, r.y, r.z, r.w),
  );

  sceneView.updateBallLight(t.x, t.y, t.z);
  cameraController.update(
    ballView.ballMesh.position,
    input.getRotation(),
    sceneView.scene,
    !physics.isStationary(),
    levels[gameModel.currentHoleIndex].useAdaptiveCamera ?? {
      active: false,
      lerpNudge: 0,
      lerpSpeed: 0,
    },
  );

  const aimDir = new THREE.Vector3().subVectors(
    ballView.ballMesh.position,
    sceneView.camera.position,
  );
  aimDir.y = 0;
  aimDir.normalize();
  ballView.updateArrow(aimDir, physics.isStationary(), pow, chip);

  sceneView.render();
}

init();
