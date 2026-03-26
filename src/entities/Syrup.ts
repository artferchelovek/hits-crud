import { Ingredient } from "../models/Ingredient";

export class Syrup extends Ingredient {
  constructor(netWeight: number) {
    super("Сироп", netWeight);
  }
}
