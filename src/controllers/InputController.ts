export class InputController {
  private keys: Record<string, boolean> = {};
  private currentRotation: number = 0;
  private shootCallback?: () => void;
  private resetCallback?: () => void;
  private resetToSpawnCallback?: () => void;

  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keys[e.code] = true;
    if (e.code === "Space") this.shootCallback?.();
    //if (e.code === "KeyR" && !e.shiftKey) this.resetCallback?.();
    if (e.code == "KeyR" && e.shiftKey) this.resetToSpawnCallback?.();
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys[e.code] = false;
  }

  public onShoot(cb: () => void): void {
    this.shootCallback = cb;
  }

  public onReset(cb: () => void): void {
    this.resetCallback = cb;
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

  public getRotation(): number {
    return this.currentRotation;
  }
}
