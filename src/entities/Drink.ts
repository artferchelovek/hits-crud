import { IElement } from "../models/Element";

export class Drink implements IElement {
  private id: string;
  name: string;
  rootElement: IElement | null = null;

  constructor(name: string) {
    this.id = crypto.randomUUID();
    this.name = name;
  }

  setRoot(element: IElement) {
    this.rootElement = element;
  }

  printRecipe() {
    console.log(`\n==== РЕЦЕПТ ${this.name} =====`);
    if (this.rootElement) {
      console.log(this.rootElement.getDescription());
    }
  }

  prepare() {
    console.log(`\n----- Приготовление ${this.name} -----`);
    if (this.rootElement) {
      if ('execute' in this.rootElement) {
        (this.rootElement as any).execute();
      }
    }
    console.log("[ОК] Напиток готов\n");
  }

  getDescription(): string {
    return `Напиток "${this.name}"`;
  }
}