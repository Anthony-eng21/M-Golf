export class InputController {
  private keys: Record<string, boolean> = {};
  private isShiftDown: boolean = false;
  private currentRotation: number = 0;
  private shootCallback?: () => void;
  private resetToSpawnCallback?: () => void;
  private active: boolean = false;

  private isAimingLeft: boolean = false;
  private isAimingRight: boolean = false;

  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));

    this.initMobileListeners();
  }

  private initMobileListeners(): void {
    const sensitivityLabel = document.getElementById("aim-sensitivity-mode");
    const sensitivitySwitch = document.getElementById("aim-sensitivity-switch");
    sensitivitySwitch?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      this.isShiftDown = target.checked;

      if (sensitivityLabel) {
        sensitivityLabel.textContent = target.checked ? "Fast Aim" : "Slow Aim";
      }
    });

    const mobileShoot = document.getElementById("mobile-shoot");
    mobileShoot?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (this.active) this.shootCallback?.();
    });

    const mobileLeft = document.getElementById("mobile-left");
    mobileLeft?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.isAimingLeft = true;
    });
    mobileLeft?.addEventListener("pointerup", (e) => {
      e.preventDefault();
      this.isAimingLeft = false;
    });
    mobileLeft?.addEventListener("pointerleave", (e) => {
      e.preventDefault();
      this.isAimingLeft = false;
    });

    const mobileRight = document.getElementById("mobile-right");
    mobileRight?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.isAimingRight = true;
    });
    mobileRight?.addEventListener("pointerup", (e) => {
      e.preventDefault();
      this.isAimingRight = false;
    });
    mobileRight?.addEventListener("pointerleave", (e) => {
      e.preventDefault();
      this.isAimingRight = false;
    });
  }

  public enable(): void {
    this.active = true;
  }

  public disable(): void {
    this.active = false;
    this.isAimingLeft = false;
    this.isAimingRight = false;
  }
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

  public onShoot(cb: () => void): void {
    this.shootCallback = cb;
  }

  public onResetToSpawn(cb: () => void): void {
    this.resetToSpawnCallback = cb;
  }

  public update(): void {
    const rotationSpeed = this.isShiftDown ? 0.01 * 0.5 : 0.015;
    const aimSensitivity = rotationSpeed;
    if (this.keys["KeyD"] || this.keys["ArrowRight"] || this.isAimingRight) {
      this.currentRotation -= aimSensitivity;
    }
    if (this.keys["KeyA"] || this.keys["ArrowLeft"] || this.isAimingLeft) {
      this.currentRotation += aimSensitivity;
    }
  }

  resetRotation(): void {
    this.currentRotation = 0;
  }

  public getRotation(): number {
    return this.currentRotation;
  }
}
