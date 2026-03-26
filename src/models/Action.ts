import { IElement } from "./Element";

export abstract class Action implements IElement {
  name: string;
  elements: IElement[];

  constructor(name: string, elements: IElement[] = []) {
    this.name = name;
    this.elements = elements;
  }

  execute(): void {
    this.elements.forEach(el => {
      if (el instanceof Action) {
        el.execute();
      }
    });

    this.perform();
  }

  abstract perform(): void;

  getDescription(): string {
    const details = this.elements.map(e => e.getDescription()).join(", ");
    return `${this.name} { ${details} }`;
  }
}