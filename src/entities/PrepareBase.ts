import { Action } from "../models/Action";
import { Drink } from "./Drink";

export class PrepareBase extends Action {
  private baseDrink: Drink;

  constructor(drink: Drink) {
    super(`Подготовка базы: ${drink.name}`, [drink]);
    this.baseDrink = drink;
  }

  perform(): void {
    console.log(`\n>>> Начинаем приготовление основы: ${this.baseDrink.name}`);

    this.baseDrink.prepare();

    console.log(`<<< Основа ${this.baseDrink.name} готова.\n`);
  }

  getDescription(): string {
    let description = `[БАЗА: ${this.baseDrink.name}]\n`;

    if (this.baseDrink.rootElement) {
      const baseRecipe = this.baseDrink.rootElement.getDescription();
      description += `      └─ ${baseRecipe.replace(/\n/g, "\n      ")}`;
    }

    return description;
  }
}
