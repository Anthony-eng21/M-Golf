export class InputController {
  private keys: Record<string, boolean> = {};
  private currentRotation: number = 0;
  private shootCallback?: () => void;
  private resetToSpawnCallback?: () => void;
  private active: boolean = false;
  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  public enable(): void {
    this.active = true;
  }

  public disable(): void {
    this.active = false;
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
    if (this.keys["KeyD"] || this.keys["ArrowRight"])
      this.currentRotation -= 0.03;
    if (this.keys["KeyA"] || this.keys["ArrowLeft"])
      this.currentRotation += 0.03;
  }

  resetRotation(): void {
    this.currentRotation = 0;
  }

  public getRotation(): number {
    return this.currentRotation;
  }
}
