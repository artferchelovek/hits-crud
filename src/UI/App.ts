import * as readlineSync from "readline-sync";
import { Grind } from "../entities/Grind";
import { Drink } from "../entities/Drink";
import { Boil } from "../entities/Boil";
import { Water } from "../entities/Water";
import { CoffeeBean } from "../entities/CoffeeBean";
import { Pour } from "../entities/Pour";
import { IElement } from "../models/Element";
import { Mix } from "../entities/Mix";
import { Milk } from "../entities/Milk";
import { Whip } from "../entities/Whip";
import { PrepareBase } from "../entities/PrepareBase";
import { Syrup } from "../entities/Syrup";
import { Ice } from "../entities/Ice";
import { Ingredient } from "../models/Ingredient";
import { Add } from "../entities/Add";
import { Action } from "../models/Action";

export class App {
  private drinks: Drink[] = [];

  public start() {
    let exit = false;

    while (!exit) {
      console.clear();
      console.log("--- Coffee Paradigms MS-2000 ---");
      console.log(`
      1. Показать все рецепты (Retrieve)
      2. Создать новый напиток (Create)
      3. Удалить напиток (Delete)
      4. Приготовить напиток (Execute)
      0. Выход
      `);

      const choice = readlineSync.question("Выберите действие: ");

      switch (choice) {
        case "1":
          console.clear();
          this.showDrinks();
          readlineSync.question("\nНажмите Enter для продолжения...");
          break;
        case "2":
          this.createDrink();
          break;
        case "3":
          this.deleteDrink();
          break;
        case "4":
          this.prepareDrink();
          break;
        case "0":
          exit = true;
          break;
        default:
          console.log("[ОШИБКА] Неверный ввод.");
          readlineSync.question();
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
    console.clear();
    const name = readlineSync.question("Введите название напитка: ");
    const newDrink = new Drink(name);
    let currentElements: IElement[] = [];

    let addingActions = true;
    while (addingActions) {
      console.clear();
      console.log(`--- Редактор: ${name} ---`);

      const tableInfo =
        currentElements.length > 0
          ? currentElements.map((e) => e.name).join(", ")
          : "пусто";

      console.log(`На столе: [ ${tableInfo} ]`);

      console.log(`
    1. Подготовить воду (Water)
    2. Подготовить зерна (Beans)
    3. ВСКИПЯТИТЬ (Boil)
    4. СМОЛОТЬ (Grind)
    5. ПРОЛИТЬ (Pour)
    6. Добавить МОЛОКО (Milk)
    7. ВЗБИТЬ молоко (Whip)
    8. СМЕШАТЬ процессы (Mix)
    9. Добавить ГОТОВЫЙ напиток (PrepareBase)
    10. Добавить сироп (Syrup)
    11. Добавить лёд (Ice)
    12. Упаковать в ДОБАВИТЬ (Add)
    0. Сохранить напиток
    `);

      const choice = readlineSync.question("Выберите шаг: ");

      switch (choice) {
        case "1":
          currentElements.push(
            new Water(readlineSync.questionInt("Мл воды: ")),
          );
          break;

        case "2":
          currentElements.push(
            new CoffeeBean(readlineSync.questionInt("Грамм кофе: ")),
          );
          break;

        case "3": {
          const hasWater = currentElements.some((e) => e instanceof Water);
          if (!hasWater) {
            console.log("[ОШИБКА] На столе нет воды!");
          } else {
            const water = currentElements.filter((e) => e instanceof Water);
            const others = currentElements.filter((e) => !(e instanceof Water));
            currentElements = [...others, new Boil(water)];
            console.log("[OK] Действие Boil добавлено.");
          }
          break;
        }

        case "4": {
          const hasBeans = currentElements.some((e) => e instanceof CoffeeBean);
          if (!hasBeans) {
            console.log("[ОШИБКА] Нет зерен для помола!");
          } else {
            const beans = currentElements.filter(
              (e) => e instanceof CoffeeBean,
            );
            const others = currentElements.filter(
              (e) => !(e instanceof CoffeeBean),
            );
            currentElements = [...others, new Grind(beans)];
            console.log("[OK] Действие Grind добавлено.");
          }
          break;
        }

        case "5": {
          const hasWatery = currentElements.some(
            (e) => e instanceof Water || e instanceof Boil,
          );
          const hasCoffeey = currentElements.some(
            (e) => e instanceof CoffeeBean || e instanceof Grind,
          );
          if (!hasWatery || !hasCoffeey) {
            console.log("[ОШИБКА] Для проливки нужны и вода, и кофе!");
          } else {
            const pourAction = new Pour([...currentElements]);
            currentElements = [pourAction];
            console.log("[OK] Действие Pour сформировано.");
          }
          break;
        }

        case "6":
          currentElements.push(
            new Milk(readlineSync.questionInt("Мл молока: ")),
          );
          break;

        case "7": {
          const milkOnTable = currentElements.some((e) => e instanceof Milk);
          if (!milkOnTable) {
            console.log("[ОШИБКА] На столе нет молока!");
          } else {
            const milkElements = currentElements.filter(
              (e) => e instanceof Milk,
            );
            const otherElements = currentElements.filter(
              (e) => !(e instanceof Milk),
            );
            currentElements = [...otherElements, new Whip(milkElements)];
            console.log("[OK] Действие Whip добавлено.");
          }
          break;
        }

        case "8": {
          const actionsToMix = currentElements.filter(
            (e) => e instanceof Action,
          );
          const ingredientsLeft = currentElements.filter(
            (e) => !(e instanceof Action),
          );
          if (actionsToMix.length < 2) {
            console.log("[ОШИБКА] Нужно минимум 2 процесса для смешивания!");
          } else {
            currentElements = [new Mix(actionsToMix), ...ingredientsLeft];
            console.log("[OK] Процессы объединены в Mix.");
          }
          break;
        }

        case "9": {
          if (this.drinks.length === 0) {
            console.log("[ОШИБКА] Нет сохраненных напитков для базы.");
            break;
          }
          this.drinks.forEach((d, i) => console.log(`[${i}] ${d.name}`));
          const drinkIndex = readlineSync.questionInt("Введите номер: ");
          if (this.drinks[drinkIndex]) {
            currentElements.push(new PrepareBase(this.drinks[drinkIndex]));
            console.log("[OK] База добавлена.");
          }
          break;
        }

        case "10":
          currentElements.push(
            new Syrup(readlineSync.questionInt("Мл сиропа: ")),
          );
          break;

        case "11":
          currentElements.push(
            new Ice(readlineSync.questionInt("Грамм льда: ")),
          );
          break;

        case "12": {
          const itemsToAdd = currentElements.filter(
            (e) => e instanceof Ingredient,
          );
          const other = currentElements.filter(
            (e) => !(e instanceof Ingredient),
          );
          if (itemsToAdd.length === 0) {
            console.log("[ОШИБКА] Нет свободных ингредиентов на столе.");
          } else {
            currentElements = [...other, new Add(itemsToAdd)];
            console.log("[OK] Ингредиенты упакованы в Add.");
          }
          break;
        }

        case "0":
          if (currentElements.length === 0) {
            console.log("[ОШИБКА] Нельзя сохранить пустой напиток.");
          } else if (currentElements.length === 1) {
            newDrink.setRoot(currentElements[0]);
            addingActions = false;
          } else {
            console.log(
              "[ПРЕДУПРЕЖДЕНИЕ] На столе несколько компонентов. Автоматическое смешивание...",
            );
            newDrink.setRoot(new Mix([...currentElements]));
            addingActions = false;
          }
          break;
      }
      if (addingActions) readlineSync.question("\nНажмите Enter...");
    }
    this.drinks.push(newDrink);
  }

  private deleteDrink() {
    console.clear();
    this.showDrinks();
    const index = readlineSync.questionInt("\nНомер для удаления: ");
    if (this.drinks[index]) {
      const name = this.drinks[index].name;
      this.drinks.splice(index, 1);
      console.log(`[OK] Напиток ${name} удален.`);
    }
    readlineSync.question("\nНажмите Enter...");
  }

  private prepareDrink() {
    console.clear();
    this.showDrinks();
    const index = readlineSync.questionInt("\nВыберите напиток: ");
    if (this.drinks[index]) {
      console.clear();
      this.drinks[index].prepare();
    }
    readlineSync.question("\nНажмите Enter для выхода в меню...");
  }
}
