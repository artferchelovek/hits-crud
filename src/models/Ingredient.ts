import { IElement } from "./Element";

export abstract class Ingredient implements IElement {
  name: string;
  netWeight: number;

  constructor(name: string, netWeight: number) {
    this.name = name;
    this.netWeight = netWeight;
  }

  getDescription(): string {
    return `${this.name} ${this.netWeight} г/мл`;
  }
}
