import { IElement } from "./Element";

export abstract class Action implements IElement {
  name: string;
  elements: IElement[];

  constructor(name: string, elements: IElement[] = []) {
    this.name = name;
    this.elements = elements;
  }

  getDescription(): string {
    const elementDescription = this.elements
      .map((e) => e.getDescription())
      .join(", ");
    return `${this.name} - ${elementDescription}`;
  }

  abstract execute(): void;
}
