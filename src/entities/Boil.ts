import { Action } from "../models/Action";
import { IElement } from "../models/Element";
import { Water } from "./Water";

export class Boil extends Action {
  constructor(elements: IElement[]) {
    super("Вскипятить", elements);
  }

  perform(): void {
    const water = this.elements.filter(e => e instanceof Water) as Water[];
    water.forEach(w => w.boil());
    console.log(`[Действие] ${this.name}: Вода нагрета.`);
  }
}