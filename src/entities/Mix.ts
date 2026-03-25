import { Action } from "../models/Action";
import { IElement } from "../models/Element";

export class Mix extends Action {
  constructor(elements: IElement[]) {
    super("Смешать", elements);
  }

  execute() {
    console.log(`[OK] ${this.getDescription()}`);
  }
}
