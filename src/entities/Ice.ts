import { Ingredient } from "../models/Ingredient";

export class Ice extends Ingredient {
  constructor(netWeight: number) {
    super("Лёд", netWeight);
  }
}
