import { CoffeeBean } from "./entities/CoffeeBean";
import { Water } from "./entities/Water";
import { Grind } from "./entities/Grind";
import { Boil } from "./entities/Boil";
import { Pour } from "./entities/Pour";
import { Milk } from "./entities/Milk";
import { Whip } from "./entities/Whip";
import { Mix } from "./entities/Mix";
import { Drink } from "./entities/Drink";

const beans = new CoffeeBean(17);
const water = new Water(30);
const grind = new Grind([beans]);
const boil = new Boil([water]);
const pour = new Pour([boil, grind]);

const milk = new Milk(200);
const whip = new Whip([milk]);

const finalMix = new Mix([pour, whip]);

const latte = new Drink("Латте");
latte.setRoot(finalMix);

latte.printRecipe()