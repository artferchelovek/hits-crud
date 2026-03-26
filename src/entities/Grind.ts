import { Action } from "../models/Action";
import { IElement } from "../models/Element";
import { CoffeeBean } from "./CoffeeBean";

export class Grind extends Action {
  constructor(elements: IElement[]) {
    super("Перемолоть", elements);
  }

  perform() {
    const coffeeElements = this.elements.filter(
      (e) => e instanceof CoffeeBean,
    ) as CoffeeBean[];

    if (coffeeElements.length === 0) {
      throw new Error(`[Ошибка] В действии нет кофе `);
    }

    coffeeElements.forEach((bean) => {
      bean.grind();
      console.log(`[OK] Кофе (${bean.netWeight}г) теперь молотый.`);
    });
  }
}
