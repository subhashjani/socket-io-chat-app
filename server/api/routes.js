import { Router } from "express";
import Room from "../models/Room.js";
const router = new Router();

router.post("/rooms", async (req, res) => {
  try {
    const abc = new Room(req.body);
    const createRoom = await abc.save();
    res.status(201).send(createRoom);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/rooms", async (req, res) => {
  const rooms = await Room.find();
  res.json({ rooms });
});

export default router;
