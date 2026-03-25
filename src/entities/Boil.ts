import { Action } from "../models/Action";
import { IElement } from "../models/Element";
import { Water } from "./Water";

export class Boil extends Action {
  constructor(elements: IElement[]) {
    super("Вскипятить", elements);
  }

  execute() {
    const waterElements = this.elements.filter(
      (e) => e instanceof Water,
    ) as Water[];

    if (waterElements.length === 0) {
      throw new Error(`[Ошибка] В действии нет воды `);
    }

    waterElements.forEach((water) => {
      water.boil();
      console.log(`[OK] Вода (${water.netWeight}мл) теперь вскипячена.`);
    });
  }
}
