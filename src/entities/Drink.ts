import { Action } from "../models/Action";
import { IElement } from "../models/Element";

export class Drink implements IElement {
  private id: string;
  name: string;
  recipe: Action[];

  constructor(name: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.recipe = [];
  }

  addAction(action: Action) {
    this.recipe.push(action);
  }

  printRecipe() {
    console.log(`\n==== РЕЦЕПТ ${this.name} =====`);
    this.recipe.forEach((item, index) => {
      console.log(`${index + 1}. ${item.getDescription()}`);
    });
  }

  prepare() {
    console.log(`\n----- Приготовление ${this.name} -----`);
    try {
      this.recipe.forEach((item) => item.execute());
      console.log("[ОК] Напиток готов\n");
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  }

  getDescription(): string {
    return `Напиток "${this.name}" (состоит из ${this.recipe.length} шагов)`;
  }
}

export class PrepareBase extends Action {
  private baseDrink: Drink;

  constructor(drink: Drink) {
    super(`Приготовление основы (${drink.name})`, [drink]);
    this.baseDrink = drink;
  }

  getDescription(): string {
    let result = `=== Готовим базу: ${this.baseDrink.name} ===\n`;

    this.baseDrink.recipe.forEach((step, index) => {
      result += `      ${index + 1}. ${step.getDescription()}\n`;
    });

    result += `    === Конец подготовки ${this.baseDrink.name} ===`;
    return result;
  }

  execute() {
    this.baseDrink.prepare();
  }
}
