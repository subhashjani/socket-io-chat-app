import Room from "../../models/Room.js";
import BaseController from "./BaseController.js";
export default class RoomController extends BaseController {
  joinRoom = ({ roomId }) => {
    this.socket.join(roomId);
  };

  newRoomCreated = ({ roomId }) => {
    const room = new Room({
      name: "Test",
      roomId,
    });
    room.save();
    this.socket.emit("new-room-created", { room });
  };

  roomRemoved = async ({ roomId }) => {
    await Room.deleteOne({ roomId });
    this.socket.emit("room-removed", { roomId });
  };
}
