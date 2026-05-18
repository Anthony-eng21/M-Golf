import { levels } from "../data/levels";

export class GameModel {
  public currentHoleIndex: number = 0;
  public strokes: number = 0;
  public totalStrokes: number = 0;

  public get par(): number {
    return levels[this.currentHoleIndex].par;
  }

  public get title(): string {
    return levels[this.currentHoleIndex].title;
  }

  public get totalPar(): number {
    return levels.reduce((sum, l) => sum + l.par, 0);
  }

  public incrementStrokes(): void {
    this.strokes++;
  }

  public resetStrokes(): void {
    this.strokes = 0;
  }

  public commitStrokes(): void {
    this.totalStrokes += this.strokes;
  }

  public nextHole(): void {
    this.currentHoleIndex++;
    this.strokes = 0;
  }

  public isLastHole(): boolean {
    return this.currentHoleIndex >= levels.length - 1;
  }

  public resetGame(): void {
    this.currentHoleIndex = 0;
    this.strokes = 0;
    this.totalStrokes = 0;
  }
}
