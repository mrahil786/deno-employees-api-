import { Application } from "https://deno.land/x/abc@v1.0.0-rc2/mod.ts";
import "https://deno.land/x/denv/mod.ts";
import {
  fetchAllEmployees,
  createEmployee,
  fetchOneEmployee,
  updateEmployee,
  deleteEmployee,
} from "./controllers/employees.ts";
import { ErrorMiddleware } from "./utils/middlewares.ts";
import { createRent, fetchAllRents, findOneRent } from "./controllers/rent.ts";

const app = new Application();

app.use(ErrorMiddleware);

app.get("/employees", fetchAllEmployees)
  .post("/employees", createEmployee)
  .get("/employees/:id", fetchOneEmployee)
  .put("/employees/:id", updateEmployee)
  .delete("/employees/:id", deleteEmployee)
  .post("/rent", createRent)
  .get("/rent",fetchAllRents)
  .put("/rent/:month",findOneRent)
  .start({ port: 5000 });

console.log(`server listening on http://localhost:5000`);
