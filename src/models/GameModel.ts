import { levels } from "../data/levels";

export class GameModel {
  public currentHoleIndex: number = 1;
  public strokes: number = 0;

  public get par(): number {
    return levels[this.currentHoleIndex].par;
  }

  public get title(): string {
    return levels[this.currentHoleIndex].title;
  }

  public incrementStrokes(): void {
    this.strokes++;
    console.log(this.strokes);
  }

  public resetStrokes(): void {
    this.strokes = 0;
  }

  public nextHole(): void {
    this.currentHoleIndex++;
    this.strokes = 0;
  }
}
