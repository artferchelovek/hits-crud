import { Action } from "../models/Action";
import { IElement } from "../models/Element";

export class Add extends Action {
  constructor(elements: IElement[]) {
    super("Добавить", elements);
  }

  perform(): void {
    if (this.elements.length === 0) {
      throw new Error(
        `[Ошибка: ${this.name}] Нечего добавлять! Список элементов пуст.`,
      );
    }

    const addedNames = this.elements.map((e) => e.name).join(", ");

    console.log(
      `[ПРОЦЕСС] ${this.name}: ${addedNames} — успешно внесено в состав.`,
    );
  }

  getDescription(): string {
    const list = this.elements.map((e) => e.getDescription()).join(" + ");
    return `${this.name} [ ${list} ]`;
  }
}
