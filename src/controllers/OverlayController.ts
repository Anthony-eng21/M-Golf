import { GameModel } from "../models/GameModel";

interface OverlayCallbacks {
  onReplay: () => void;
  onNextLevel: () => void;
  onPlay: () => void;
  onPlayAgain: () => void;
}

export class OverlayController {
  private gameModel: GameModel;
  private overlay: Element;
  private titleEl: Element;
  private parEl: Element;
  private strokesEl: Element;
  private scoreEl: Element;
  private totalStrokesEl: Element;
  private totalScoreEl: Element;
  private nextBtn: Element;

  constructor(gameModel: GameModel, callbacks: OverlayCallbacks) {
    this.gameModel = gameModel;
    this.overlay = document.querySelector(".overlay")!;
    this.titleEl = this.overlay.querySelector(".title")!;
    this.parEl = this.overlay.querySelector(".par")!;
    this.strokesEl = this.overlay.querySelector(".strokes")!;
    this.scoreEl = this.overlay.querySelector(".score")!;
    this.totalStrokesEl = this.overlay.querySelector(".total-strokes")!;
    this.totalScoreEl = this.overlay.querySelector(".total-score")!;
    this.nextBtn = this.overlay.querySelector(".next")!;

    this.overlay
      .querySelector(".replay")
      ?.addEventListener("click", callbacks.onReplay);
    this.overlay
      .querySelector(".next")
      ?.addEventListener("click", callbacks.onNextLevel);
    this.overlay
      .querySelector(".play")
      ?.addEventListener("click", callbacks.onPlay);
    this.overlay
      .querySelector(".play-again")
      ?.addEventListener("click", callbacks.onPlayAgain);
  }

  public showOverlay(mode: "start" | "complete" | "summary"): void {
    this.overlay.classList.remove("start", "complete", "summary");
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

    if (mode === "summary") {
      this.titleEl.textContent = "Game Complete!";
      this.totalStrokesEl.textContent = `Total Strokes: ${this.gameModel.totalStrokes}`;
      const totalDiff = this.gameModel.totalStrokes - this.gameModel.totalPar;
      if (totalDiff > 0) {
        this.totalScoreEl.textContent = `${totalDiff} over par`;
      } else if (totalDiff < 0) {
        this.totalScoreEl.textContent = `${Math.abs(totalDiff)} under par`;
      } else {
        this.totalScoreEl.textContent = `Even par!`;
      }
    }
  }

  public hideOverlay(): void {
    this.overlay.classList.remove("show");
  }
}
