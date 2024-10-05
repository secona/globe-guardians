export class ElementState {
  ph: number;
  nitrate: number;
  potassium: number;
  phosphorus: number;

  constructor() {
    this.ph = 0;
    this.nitrate = 0;
    this.potassium = 0;
    this.phosphorus = 0;
  }

  increment(key: 'ph' | 'nitrate' | 'potassium' | 'phosphorus', value: number) {
    switch (key) {
      case 'ph': this.ph = Math.min(this.ph + value, 100); break;
      case 'nitrate': this.nitrate = Math.min(this.nitrate + value, 100); break;
      case 'potassium': this.potassium = Math.min(this.potassium + value, 100); break;
      case 'phosphorus': this.phosphorus = Math.min(this.phosphorus + value, 100); break;
    }
  }
}
