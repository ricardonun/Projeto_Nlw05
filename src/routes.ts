import { Router } from "express";
import { SettingsController } from "./controllers/SettingsControlers";

const routes = Router();
const settingsControlers = new SettingsController();
routes.post("/settings", settingsControlers.create);

export { routes };
