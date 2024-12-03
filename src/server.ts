import app from "./app";
import RabbitListener from "./services/RabbitListener";
import { socketIo } from "./web-socket";
app.listen(3003, () => {
    console.log("users API started on port 3003!");
    new RabbitListener().listeners();
});
socketIo.listen(5000, () => console.log('web socket listen on port 5000!'));
