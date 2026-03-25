import { Ingredient } from "../models/Ingredient";

export class Milk extends Ingredient {
  private isWhipped: boolean;

  constructor(netWeight: number) {
    super("Молоко", netWeight);
    this.isWhipped = false;
  }

  whip() {
    this.isWhipped = true;
  }
}
