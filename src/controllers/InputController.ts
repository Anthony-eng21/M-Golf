export class InputController {
  private keys: Record<string, boolean> = {};
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
    this.keys[e.code] = true;
    if (e.code === "Space") this.shootCallback?.();
    if (e.code == "KeyR" && e.ctrlKey) this.resetToSpawnCallback?.();
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys[e.code] = false;
  }

  public onShoot(cb: () => void): void {
    this.shootCallback = cb;
  }

  public onResetToSpawn(cb: () => void): void {
    this.resetToSpawnCallback = cb;
  }

  public update(): void {
    if (this.keys["KeyD"] || this.keys["ArrowRight"]) {
      this.currentRotation -= 0.03;
    } else if (this.isAimingRight) {
      this.currentRotation -= 0.015;
    }
    if (this.keys["KeyA"] || this.keys["ArrowLeft"]) {
      this.currentRotation += 0.03;
    } else if (this.isAimingLeft) {
      this.currentRotation += 0.015;
    }
  }

  resetRotation(): void {
    this.currentRotation = 0;
  }

  public getRotation(): number {
    return this.currentRotation;
  }
}
