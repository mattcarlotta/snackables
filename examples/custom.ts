import { config } from "snackables";

config({ path: ".env.test" });

/* eslint-disable-next-line */
console.log("process.env.TESTING", process.env.TESTING);
