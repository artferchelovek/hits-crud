import { Action } from "../models/Action";
import { IElement } from "../models/Element";
import { Water } from "./Water";
import { CoffeeBean } from "./CoffeeBean";

export class Pour extends Action {
  constructor(elements: IElement[]) {
    super("Пролить", elements);
  }

  perform() {
    const waterElements = this.elements.filter(
      (e) => e instanceof Water,
    ) as Water[];

    if (waterElements.length > 0) {
      const allBoiled = waterElements.every((w) => w.isBoiled());
      if (!allBoiled) {
        throw new Error(
          `[Ошибка] ${this.name}: Нельзя использовать холодную воду!`,
        );
      }
    }

    const coffeeElements = this.elements.filter(
      (e) => e instanceof CoffeeBean,
    ) as CoffeeBean[];

    if (coffeeElements.length > 0) {
      const allGrinded = coffeeElements.every((w) => w.isGrinded());
      if (!allGrinded) {
        throw new Error(
          `[Ошибка] ${this.name}: Нельзя использовать зерновой кофе!`,
        );
      }

      console.log(`[ОК] ${this.getDescription()}`);
    }
  }
}
