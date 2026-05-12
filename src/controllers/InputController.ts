export class InputController {
  private keys: Record<string, boolean> = {};
  private currentRotation: number = 0;
  private shootCallback?: () => void;
  private resetCallback?: () => void;

  constructor() {
    window.addEventListener("keydown", (e) => this.onKeyDown(e));
    window.addEventListener("keyup", (e) => this.onKeyUp(e));
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keys[e.code] = true;
    if (e.code === "Space") this.shootCallback?.();
    if (e.code === "KeyR") this.resetCallback?.();
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys[e.code] = false;
  }

  public onShoot(callback: () => void): void {
    this.shootCallback = callback;
  }

  public onReset(callback: () => void): void {
    this.resetCallback = callback;
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
