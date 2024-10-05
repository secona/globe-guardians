export class ElementState {
  ph: number;
  nitrate: number;
  potassium: number;
  phosphorus: number;

  constructor() {
    this.ph = 80 + Math.floor(Math.random() * 20);
    this.nitrate = 80 + Math.floor(Math.random() * 20);
    this.potassium = 80 + Math.floor(Math.random() * 20);
    this.phosphorus = 80 + Math.floor(Math.random() * 20);
  }

  decrement(key: 'ph' | 'nitrate' | 'potassium' | 'phosphorus', value: number) {
    switch (key) {
      case 'ph': this.ph = Math.max(this.ph - value, 0); break;
      case 'nitrate': this.nitrate = Math.max(this.nitrate - value, 0); break;
      case 'potassium': this.potassium = Math.max(this.potassium - value, 0); break;
      case 'phosphorus': this.phosphorus = Math.max(this.phosphorus - value, 0); break;
    }
  }

  decrementAll(modifier: number) {
    this.decrement('ph', 0.02 * Math.log10(modifier))
    this.decrement('nitrate', 0.02 * Math.log10(modifier))
    this.decrement('potassium', 0.02 * Math.log10(modifier))
    this.decrement('phosphorus', 0.02 * Math.log10(modifier))
  }
}
