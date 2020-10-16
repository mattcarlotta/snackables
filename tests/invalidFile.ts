import { config } from "snackable";
const result = config({ path: ".env.prod", debug: true });
import chalk from "chalk";

console.log(result);

console.log(chalk.cyan(`process.env.TESTING: ${process.env.TESTING}\n`));
