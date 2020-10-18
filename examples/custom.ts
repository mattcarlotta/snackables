import { config } from "snackables";

config({ path: ".env.test", debug: true });

/* eslint-disable-next-line */
console.log("process.env.TESTING", process.env.TESTING);
