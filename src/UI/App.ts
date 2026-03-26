import * as readlineSync from "readline-sync";
import * as fs from "fs";
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
  private readonly DB_PATH = "./drinks.json";

  public start() {
    this.loadFromFile();
    let exit = false;

    while (!exit) {
      console.clear();
      console.log("--- Coffee Paradigms MS-2000 ---");
      console.log(`
      1. Показать все рецепты (Retrieve)
      2. Создать новый напиток (Create)
      3. Редактировать напиток (Update)
      4. Удалить напиток (Delete)
      5. Приготовить напиток (Execute)
      0. Выход
      `);

      const choice = readlineSync.question("Выберите действие: ");

      switch (choice) {
        case "1":
          console.clear();
          this.showDrinks();
          readlineSync.question("\nНажмите Enter...");
          break;
        case "2":
          this.createNewDrink();
          break;
        case "3":
          this.updateExistingDrink();
          break;
        case "4":
          this.deleteDrink();
          break;
        case "5":
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

  private saveToFile() {
    try {
      const data = JSON.stringify(this.drinks, null, 2);
      fs.writeFileSync(this.DB_PATH, data, "utf8");
      console.log("[OK] База данных обновлена.");
    } catch (e) {
      console.log("[ОШИБКА] Не удалось сохранить файл.");
    }
  }

  private loadFromFile() {
    if (!fs.existsSync(this.DB_PATH)) return;

    try {
      const rawData = fs.readFileSync(this.DB_PATH, "utf8");
      const parsed = JSON.parse(rawData);

      this.drinks = parsed.map((d: any) => {
        const drink = new Drink(d.name);
        if (d.rootElement) {
          drink.setRoot(this.reconstructElement(d.rootElement));
        }
        return drink;
      });
      console.log("[OK] Данные загружены.");
    } catch (e) {
      console.log("[ПРЕДУПРЕЖДЕНИЕ] Ошибка парсинга базы, создана новая.");
      this.drinks = [];
    }
  }

  private reconstructElement(data: any): IElement {
    if (data.elements) {
      const children = data.elements.map((el: any) =>
        this.reconstructElement(el),
      );

      if (data.name === "Вскипятить") return new Boil(children);
      if (data.name === "Перемолоть") return new Grind(children);
      if (data.name === "Пролить") return new Pour(children);
      if (data.name === "Взбить") return new Whip(children);
      if (data.name === "Смешать") return new Mix(children);
      if (data.name === "Добавить") return new Add(children);
      if (data.name.includes("Подготовка базы")) {
        const baseName = data.name.replace("Подготовка базы: ", "");
        const baseDrink =
          this.drinks.find((d) => d.name === baseName) || new Drink(baseName);
        return new PrepareBase(baseDrink);
      }
    }

    if (data.name === "Вода") return new Water(data.netWeight);
    if (data.name === "Кофейные зёрна") return new CoffeeBean(data.netWeight);
    if (data.name === "Молоко") return new Milk(data.netWeight);
    if (data.name === "Сироп") return new Syrup(data.netWeight);
    if (data.name === "Лёд") return new Ice(data.netWeight);

    return data;
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

  private createNewDrink() {
    console.clear();
    const name = readlineSync.question("Введите название напитка: ");
    const newDrink = new Drink(name);
    this.manageDrink(newDrink, []);
    this.drinks.push(newDrink);
    this.saveToFile();
  }

  private updateExistingDrink() {
    console.clear();
    this.showDrinks();
    if (this.drinks.length === 0) {
      readlineSync.question("\nНажмите Enter...");
      return;
    }

    const index = readlineSync.questionInt("\nВыберите номер для Update: ");
    if (this.drinks[index]) {
      const drink = this.drinks[index];
      let elements: IElement[] = [];
      if (drink.rootElement && drink.rootElement instanceof Action) {
        elements = [...drink.rootElement.elements];
      } else if (drink.rootElement) {
        elements = [drink.rootElement];
      }
      this.manageDrink(drink, elements);
      this.saveToFile();
    }
  }

  private manageDrink(drink: Drink, initialElements: IElement[]) {
    let currentElements: IElement[] = initialElements;
    let active = true;

    while (active) {
      console.clear();
      console.log(`--- Редактор: ${drink.name} ---`);

      if (currentElements.length > 0) {
        console.log("На столе:");
        currentElements.forEach((el, idx) => {
          console.log(`  [${idx}] ${el.name}`);
        });
      } else {
        console.log("На столе: [ пусто ]");
      }

      console.log(`
    --- ИНГРЕДИЕНТЫ ---        --- ДЕЙСТВИЯ ---
    1. Вода                   3. ВСКИПЯТИТЬ
    2. Зерна                  4. СМОЛОТЬ
    6. Молоко                 5. ПРОЛИТЬ
    10. Сироп                 7. ВЗБИТЬ
    11. Лёд                   8. СМЕШАТЬ
                              12. ДОБАВИТЬ
    
    --- УПРАВЛЕНИЕ РЕЦЕПТОМ ---
    13. ИЗМЕНИТЬ НАЗВАНИЕ напитка
    14. УДАЛИТЬ ЭЛЕМЕНТ со стола (по индексу)
    9.  Вставить БАЗУ
    0.  СОХРАНИТЬ И ВЫЙТИ
    `);

      const choice = readlineSync.question("Выбор: ");

      switch (choice) {
        case "1":
          currentElements.push(new Water(readlineSync.questionInt("Мл: ")));
          break;
        case "2":
          currentElements.push(new CoffeeBean(readlineSync.questionInt("Г: ")));
          break;
        case "3":
          const w = currentElements.filter((e) => e instanceof Water);
          if (w.length > 0) {
            currentElements = [
              ...currentElements.filter((e) => !(e instanceof Water)),
              new Boil(w),
            ];
          } else console.log("[ОШИБКА] Нет воды.");
          break;
        case "4":
          const b = currentElements.filter((e) => e instanceof CoffeeBean);
          if (b.length > 0) {
            currentElements = [
              ...currentElements.filter((e) => !(e instanceof CoffeeBean)),
              new Grind(b),
            ];
          } else console.log("[ОШИБКА] Нет зерен.");
          break;
        case "5":
          currentElements = [new Pour([...currentElements])];
          break;
        case "6":
          currentElements.push(new Milk(readlineSync.questionInt("Мл: ")));
          break;
        case "7":
          const m = currentElements.filter((e) => e instanceof Milk);
          if (m.length > 0) {
            currentElements = [
              ...currentElements.filter((e) => !(e instanceof Milk)),
              new Whip(m),
            ];
          } else console.log("[ОШИБКА] Нет молока.");
          break;
        case "8":
          const acts = currentElements.filter((e) => e instanceof Action);
          const ings = currentElements.filter((e) => !(e instanceof Action));
          if (acts.length >= 2) {
            currentElements = [new Mix(acts), ...ings];
          } else console.log("[ОШИБКА] Нужно минимум 2 процесса.");
          break;
        case "9":
          this.drinks.forEach((d, idx) => console.log(`[${idx}] ${d.name}`));
          const sel = readlineSync.questionInt("ID: ");
          if (this.drinks[sel])
            currentElements.push(new PrepareBase(this.drinks[sel]));
          break;
        case "10":
          currentElements.push(new Syrup(readlineSync.questionInt("Мл: ")));
          break;
        case "11":
          currentElements.push(new Ice(readlineSync.questionInt("Г: ")));
          break;
        case "12":
          const toAdd = currentElements.filter((e) => e instanceof Ingredient);
          const rest = currentElements.filter(
            (e) => !(e instanceof Ingredient),
          );
          if (toAdd.length > 0) {
            currentElements = [...rest, new Add(toAdd)];
          }
          break;

        case "13": {
          const newName = readlineSync.question("Введите новое название: ");
          if (newName.trim()) {
            drink.name = newName;
            console.log("[OK] Название изменено.");
          }
          break;
        }

        case "14": {
          if (currentElements.length === 0) {
            console.log("[ОШИБКА] Стол пуст.");
          } else {
            const idx = readlineSync.questionInt(
              "Введите индекс элемента для удаления: ",
            );
            if (currentElements[idx]) {
              console.log(`[OK] Элемент ${currentElements[idx].name} удален.`);
              currentElements.splice(idx, 1);
            } else {
              console.log("[ОШИБКА] Неверный индекс.");
            }
          }
          break;
        }

        case "0":
          if (currentElements.length > 0) {
            const root =
              currentElements.length === 1
                ? currentElements[0]
                : new Mix([...currentElements]);
            drink.setRoot(root);
            active = false;
            console.log("[OK] Рецепт успешно обновлен.");
          } else {
            console.log("[ОШИБКА] Нельзя сохранить пустой напиток.");
          }
          break;
      }
      if (active) readlineSync.question("\nНажмите Enter...");
    }
  }

  private deleteDrink() {
    this.showDrinks();
    const idx = readlineSync.questionInt("\nУдалить номер: ");
    if (this.drinks[idx]) {
      this.drinks.splice(idx, 1);
      console.log("[OK] Напиток удален.");
    }
    readlineSync.question("\nEnter...");
  }

  private prepareDrink() {
    this.showDrinks();
    const idx = readlineSync.questionInt("\nПриготовить номер: ");
    if (this.drinks[idx]) {
      console.clear();
      this.drinks[idx].prepare();
    }
    readlineSync.question("\nEnter...");
  }
}
