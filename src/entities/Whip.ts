import { Milk } from "./Milk";
import { Action } from "../models/Action";
import { IElement } from "../models/Element";

export class Whip extends Action {
  constructor(elements: IElement[]) {
    super("Взбить", elements);
  }

  perform(): void {
    this.elements.forEach((el) => {
      if (el instanceof Milk) el.whip();
    });
    console.log(`[Действие] ${this.name}: Молоко взбито в пену.`);
  }
}
