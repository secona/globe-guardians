export class MainMenuState {
  selected: number;

  constructor() {
    this.selected = 0;
  }

  next() {
    if (this.selected < 1) {
      this.selected++;
    }
  }

  prev() {
    if (this.selected > 0) {
      this.selected--;
    }
  }
}
