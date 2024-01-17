import mongoose from "mongoose";
mongoose.connect("mongodb://localhost:27017/chat-app").then(() => {
  console.log("connected");
});
