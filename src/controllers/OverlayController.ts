import { GameModel } from "../models/GameModel";

interface OverlayCallbacks {
  onReplay: () => void;
  onNextLevel: () => void;
  onPlay: () => void;
}

export class OverlayController {
  private gameModel: GameModel;
  private overlay: Element;
  private titleEl: Element;
  private parEl: Element;
  private strokesEl: Element;
  private scoreEl: Element;
  private nextBtn: Element;

  constructor(gameModel: GameModel, cb: OverlayCallbacks) {
    this.gameModel = gameModel;
    this.overlay = document.querySelector(".overlay")!;
    this.titleEl = this.overlay.querySelector(".title")!;
    this.parEl = this.overlay.querySelector(".par")!;
    this.strokesEl = this.overlay.querySelector(".strokes")!;
    this.scoreEl = this.overlay.querySelector(".score")!;
    this.nextBtn = document.querySelector(".next")!;

    this.overlay
      .querySelector(".replay")
      ?.addEventListener("click", cb.onReplay);
    this.overlay
      .querySelector(".next")
      ?.addEventListener("click", cb.onNextLevel);
    this.overlay.querySelector(".play")?.addEventListener("click", cb.onPlay);
  }

  public showOverlay(mode: "start" | "complete"): void {
    this.overlay.classList.remove("start", "complete");
    this.overlay.classList.add(mode, "show");

    this.titleEl.textContent = this.gameModel.title;
    this.parEl.textContent = `Par ${this.gameModel.par}`;

    if (mode === "complete") {
      this.strokesEl.textContent = `Strokes: ${this.gameModel.strokes}`;
      const parDiff = this.gameModel.strokes - this.gameModel.par;
      if (parDiff > 0) {
        this.scoreEl.textContent = `${parDiff} over par`;
      } else if (parDiff < 0) {
        this.scoreEl.textContent = `${Math.abs(parDiff)} under par`;
      } else {
        this.scoreEl.textContent = `Even par!`;
      }
      this.nextBtn.textContent = this.gameModel.isLastHole()
        ? "Finish"
        : "Next Hole";
    }
  }

  public hideOverlay(): void {
    this.overlay.classList.remove("show");
  }
}
