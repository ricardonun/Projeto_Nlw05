import { Router } from "express";
import { SettingsController } from "./controllers/SettingsControlers";
import { UserController } from "./controllers/UsersController";
import { MessagesController } from "./controllers/MessagesController";

/**Variaveis do sistema */
const routes = Router();
const settingsControlers = new SettingsController();
const userController = new UserController();
const messagesController = new MessagesController();

/**Rotas */
routes.post("/settings", settingsControlers.create);

routes.post("/users", userController.create);

routes.post("/messages", messagesController.create);
routes.get("/messages/:id", messagesController.showByUser);

export { routes };
