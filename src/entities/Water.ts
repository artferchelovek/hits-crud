import { Ingredient } from "../models/Ingredient";

export class Water extends Ingredient {
  private boiled: boolean = false;

  constructor(netWeight: number) {
    super("Вода", netWeight);
  }

  boil(): void {
    this.boiled = true;
  }

  isBoiled(): boolean {
    return this.boiled;
  }
}
