export class StatsState {
  money: number;
  energy: number;

  constructor() {
    this.money = 20;
    this.energy = 20;
  }

  decrement(key: 'energy' | 'money', value: number) {
    switch (key) {
      case 'energy':
        if (this.energy >= value) this.energy -= value;
        break;
      case 'money':
        if (this.money >= value) this.money -= value;
        break;
    }
  }

  enoughForBurning() {
    return this.money >= 1 && this.energy >= 1;
  }

  payForBurning() {
    this.decrement('money', 1);
    this.decrement('energy', 1);
  }

  enoughForCutting() {
    return this.money >= 2 && this.energy >= 5;
  }

  payForCutting() {
    this.decrement('money', 2)
    this.decrement('energy', 5)
  }
}
