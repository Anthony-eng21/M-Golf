export class InputController {
  private keys: Record<string, boolean> = {};
  private currentRotation: number = 0;
  private shootCallback?: () => void;
  private resetToSpawnCallback?: () => void;
  private active: boolean = false;

  private isShiftDown: boolean = false;
  private isSlowed: boolean = false;
  private isAimingLeft: boolean = false;
  private isAimingRight: boolean = false;

  constructor() {
    this.initListeners();
  }

  // DOM user input/events
  private initListeners(): void {
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
    window.addEventListener("keydown", (e) => this.onKeyDown(e));

    const sensitivityLabel = document.getElementById("aim-sensitivity-mode");
    const sensitivitySwitch = document.getElementById("aim-sensitivity-switch");
    sensitivitySwitch?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      this.isSlowed = target.checked;

      if (sensitivityLabel) {
        sensitivityLabel.textContent = target.checked ? "Fast Aim" : "Slow Aim";
      }
    });

    const inputShoot = document.getElementById("input-shoot");
    inputShoot?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (this.active) this.shootCallback?.();
    });

    const inputLeft = document.getElementById("input-left");
    inputLeft?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.isAimingLeft = true;
    });
    inputLeft?.addEventListener("pointerup", (e) => {
      e.preventDefault();
      this.isAimingLeft = false;
    });
    inputLeft?.addEventListener("pointerleave", (e) => {
      e.preventDefault();
      this.isAimingLeft = false;
    });

    const inputRight = document.getElementById("input-right");
    inputRight?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.isAimingRight = true;
    });
    inputRight?.addEventListener("pointerup", (e) => {
      e.preventDefault();
      this.isAimingRight = false;
    });
    inputRight?.addEventListener("pointerleave", (e) => {
      e.preventDefault();
      this.isAimingRight = false;
    });
  }

  // State to disable/enable user input/events in game.
  public enable(): void {
    this.active = true;
  }

  public disable(): void {
    this.active = false;
    this.isAimingLeft = false;
    this.isAimingRight = false;
  }

  // Keyboard user input/events
  private onKeyDown(e: KeyboardEvent): void {
    if (!this.active) return;
    if (e.key === "Shift") this.isShiftDown = true;
    this.keys[e.code] = true;
    if (e.code === "Space") this.shootCallback?.();
    if (e.code == "KeyR" && e.ctrlKey) this.resetToSpawnCallback?.();
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (e.key === "Shift") this.isShiftDown = false;
    this.keys[e.code] = false;
  }

  // CBs
  public onShoot(cb: () => void): void {
    this.shootCallback = cb;
  }

  public onResetToSpawn(cb: () => void): void {
    this.resetToSpawnCallback = cb;
  }

  public update(): void {
    const rotationSpeed =
      this.isShiftDown || this.isSlowed ? 0.01 * 0.5 : 0.015;
    const aimSensitivity = rotationSpeed;
    if (this.keys["KeyD"] || this.keys["ArrowRight"] || this.isAimingRight) {
      this.currentRotation -= aimSensitivity;
    }
    if (this.keys["KeyA"] || this.keys["ArrowLeft"] || this.isAimingLeft) {
      this.currentRotation += aimSensitivity;
    }
  }

  public resetRotation(): void {
    this.currentRotation = 0;
  }

  public getRotation(): number {
    return this.currentRotation;
  }
}
