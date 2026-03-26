import * as readlineSync from 'readline-sync';
import { Grind } from "../entities/Grind";
import { Drink } from "../entities/Drink";
import { Boil } from "../entities/Boil";
import { Water } from "../entities/Water";
import { CoffeeBean } from "../entities/CoffeeBean";

export class App {
  private drinks: Drink[] = [];

  public start() {
    let exit = false;

    console.log("--- Добро пожаловать в Coffee Paradigms MS-2000 ---");

    while (!exit) {
      console.log(`
      1. Показать все рецепты (Retrieve)
      2. Создать новый напиток (Create)
      3. Удалить напиток (Delete)
      4. Приготовить напиток (Execute)
      0. Выход
      `);

      const choice = readlineSync.question("Выберите действие: ");

      switch (choice) {
        case '1': this.showDrinks(); break;
        case '2': this.createDrink(); break;
        case '3': this.deleteDrink(); break;
        case '4': this.prepareDrink(); break;
        case '0': exit = true; break;
        default: console.log("Неверный ввод.");
      }
    }
  }

  private showDrinks() {
    if (this.drinks.length === 0) {
      console.log("Список напитков пуст.");
      return;
    }
    this.drinks.forEach((d, i) => {
      console.log(`\n[${i}] ${d.name}`);
      d.printRecipe();
    });
  }

  private createDrink() {
    const name = readlineSync.question("Введите название напитка: ");
    const newDrink = new Drink(name);

    let addingActions = true;
    while (addingActions) {
      console.log(`
      Добавить шаг в рецепт для ${name}:
      1. Вскипятить воду
      2. Помол кофе
      3. Пролить воду через кофе
      0. Закончить создание
      `);

      const actionChoice = readlineSync.question("Выберите шаг: ");

      if (actionChoice === '1') {
        const weight = readlineSync.questionInt("Сколько мл воды? ");
        newDrink.addAction(new Boil([new Water(weight)]));
      }
      else if (actionChoice === '2') {
        const weight = readlineSync.questionInt("Сколько грамм зерен? ");
        newDrink.addAction(new Grind([new CoffeeBean(weight)]));
      } else if (actionChoice === '3') {
        const
      }
      else if (actionChoice === '0') {
        addingActions = false;
      }
    }

    this.drinks.push(newDrink);
    console.log(`Напиток ${name} успешно сохранен!`);
  }

  private deleteDrink() {
    this.showDrinks();
    const index = readlineSync.questionInt("Введите номер напитка для удаления: ");
    if (this.drinks[index]) {
      const removed = this.drinks.splice(index, 1);
      console.log(`Напиток ${removed[0].name} удален.`);
    }
  }

  private prepareDrink() {
    this.showDrinks();
    const index = readlineSync.questionInt("Какой напиток приготовить? ");
    if (this.drinks[index]) {
      this.drinks[index].prepare();
    }
  }
}