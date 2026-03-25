import { Ingredient } from "../models/Ingredient";

export class CoffeeBean extends Ingredient {
  private grinded: boolean;

  constructor(netWeight: number) {
    super("Кофейные зёрна", netWeight);
    this.grinded = false;
  }

  grind() {
    this.grinded = true;
  }

  isGrinded(): boolean {
    return this.grinded;
  }
}
