export class HUDView {
  private mobileButtons: NodeListOf<HTMLElement>;
  private powerSlider: HTMLInputElement;
  private chipSlider: HTMLInputElement;
  private containers: NodeListOf<HTMLElement>;

  constructor() {
    this.powerSlider = document.getElementById(
      "xz-linvel-f",
    ) as HTMLInputElement;
    this.chipSlider = document.getElementById("y-linvel-f") as HTMLInputElement;
    this.containers = document.querySelectorAll(".slider-container");

    if (this.powerSlider)
      this.powerSlider.value = this.powerSlider.defaultValue;
    if (this.chipSlider) this.chipSlider.value = this.chipSlider.defaultValue;

    this.updateSliderFill(this.powerSlider);
    this.updateSliderFill(this.chipSlider);
    this.initListeners();
  }

  private initListeners(): void {
    const preventKey = (e: KeyboardEvent) => {
      //prevent keydown on arrows events from manipulating the range inputs/power sliders
      if (e.key) e.preventDefault();
    };
    this.powerSlider?.addEventListener("keydown", preventKey);
    this.chipSlider?.addEventListener("keydown", preventKey);

    this.powerSlider?.addEventListener("input", () => {
      this.updateSliderFill(this.powerSlider);
      this.shakeSlider(this.powerSlider, 0.75, "X");
    });
    this.chipSlider?.addEventListener("input", () => {
      this.updateSliderFill(this.chipSlider);
      this.shakeSlider(this.chipSlider, 0.6, "Y");
    });
  }

  public getSliderValues(): { pow: number; chip: number } {
    return {
      pow: parseFloat(this.powerSlider?.value || "0"),
      chip: parseFloat(this.chipSlider?.value || "0"),
    };
  }

  public setSliderValues(values?: { pow?: number; chip?: number }): void {
    if (this.powerSlider) {
      this.powerSlider.value =
        values?.pow !== undefined
          ? values.pow.toString()
          : this.powerSlider.defaultValue;
      this.powerSlider.className = "slider";
      this.updateSliderFill(this.powerSlider);
    }

    if (this.chipSlider) {
      this.chipSlider.value =
        values?.chip !== undefined
          ? values.chip.toString()
          : this.chipSlider.defaultValue;
      this.chipSlider.className = "slider";
      this.updateSliderFill(this.chipSlider);
    }
  }

  // https://stackoverflow.com/questions/75589343/how-do-i-make-a-slider-in-html-that-fill-itself-in-behind-with-a-gradient
  private updateSliderFill(slider: HTMLInputElement): void {
    if (!slider) return;
    const val = parseFloat(slider.value);
    const min = parseFloat(slider.min);
    const max = parseFloat(slider.max);
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.setProperty("--pc", `${percentage}%`);
  }

  private shakeSlider(
    slider: HTMLInputElement,
    targetVal: number,
    dir: string,
  ): void {
    const val = parseFloat(slider.value);
    const max = parseFloat(slider.max);
    const target = max * targetVal;

    if (val > target) {
      slider.className = `slider shake${dir}`;
    } else if (val < target) {
      slider.className = "slider";
    }
  }

  public showSliders(): void {
    this.containers.forEach((container) => (container.style.display = "flex"));
  }

  public hideSliders(): void {
    this.containers.forEach((container) => (container.style.display = "none"));
  }
}
