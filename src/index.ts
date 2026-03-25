import { CoffeeBean } from "./entities/CoffeeBean";
import { Water } from "./entities/Water";
import { Drink, PrepareBase } from "./entities/Drink";
import { Pour } from "./entities/Pour";
import { Boil } from "./entities/Boil";
import { Grind } from "./entities/Grind";
import { Milk } from "./entities/Milk";
import { Whip } from "./entities/Whip";
import { Mix } from "./entities/Mix";

const beans = new CoffeeBean(17);
const water = new Water(30);
const milk = new Milk(200);

const espresso = new Drink("Эспрессо");
espresso.addAction(new Boil([water]));
espresso.addAction(new Grind([beans]));
espresso.addAction(new Pour([water, beans]));

const latte = new Drink("Латте");
latte.addAction(new Whip([milk]));
latte.addAction(new PrepareBase(espresso));
latte.addAction(new Mix([espresso, milk]));

latte.prepare();
