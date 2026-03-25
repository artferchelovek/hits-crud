import { Action } from "../models/Action";
import { IElement } from "../models/Element";

export class Whip extends Action {
  constructor(elements: IElement[]) {
    super("Взбить", elements);
  }

  execute() {
    console.log(`[ОК] ${this.getDescription()}`);
  }
}
