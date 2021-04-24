import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsServices";
import { UserServices } from "../services/UserServices";
import { MessageService } from "../services/MessagesServices";

interface IParams {
  text: string;
  email: string;
}
io.on("connect", (socket) => {
  let user_id = null;

  const connectonsService = new ConnectionsService();
  const userServices = new UserServices();
  const messageService = new MessageService();

  socket.on("client_first_access", async (params) => {
    const socket_id = socket.id;
    const { text, email } = params as IParams;
    const userExist = await userServices.findByEmail(email);

    if (!userExist) {
      const user = await userServices.create(email);
      await connectonsService.create({ socket_id, user_id: user.id });
      user_id = user.id;
    } else {
      user_id = userExist.id;
      const connection = await connectonsService.findByUserId(userExist.id);
      if (!connection) {
        await connectonsService.create({ socket_id, user_id: userExist.id });
      } else {
        connection.socket_id = socket_id;
        await connectonsService.create(connection);
      }
    }

    await messageService.create({
      text,
      user_id,
    });
    const allMessages = await messageService.listByUser(user_id);

    socket.emit("client_list_all_messages", allMessages);
    const allUsers = await connectonsService.findAllWhithoudAdmin();
    io.emit("admin_list_all_users", allUsers);
  });

  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;
    const socket_id = socket.id;
    const { user_id } = await connectonsService.findBySocketID(socket.id);
    const message = await messageService.create({ text, user_id });

    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id,
    });
  });
});
