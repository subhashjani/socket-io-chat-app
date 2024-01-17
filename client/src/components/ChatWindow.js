import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

export default function ChatWindow() {
  const { socket } = useOutletContext();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const { roomId } = useParams();
  const fileRef = useRef();

  function selectFile() {
    fileRef.current.click();
  }

  function fileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      socket.emit("upload", { data, roomId });
      setChat((prev) => [
        ...prev,
        { message: reader.result, received: false, type: "image" },
      ]);
    };
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("message-from-server", (data) => {
      setChat((prev) => [...prev, { message: data.message, received: true }]);
    });

    socket.on("uploaded", (data) => {
      console.log(data);
      setChat((prev) => [
        ...prev,
        { message: data.buffer, received: true, type: "image" },
      ]);
    });
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-message", { message, roomId });
    setChat((prev) => [...prev, { message, received: false }]);
    setMessage("");
  }

  function handleInput(e) {
    setMessage(e.target.value);
  }

  return (
    <Card
      sx={{
        padding: 2,
        marginTop: 10,
        width: "60%",
        backgroundColor: "gray",
        color: "white",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {roomId && <Typography>Room: {roomId}</Typography>}
      </Box>
      <Box sx={{ marginBottom: 5 }}>
        {chat.map((data) =>
          data.type === "image" ? (
            <img
              style={{ float: data.received ? "left" : "right" }}
              src={data.message}
              alt="my-image"
              width="100"
            />
          ) : (
            <Typography
              sx={{ textAlign: data.received ? "left" : "right" }}
              key={data.message}
            >
              {data.message}
            </Typography>
          )
        )}
      </Box>
      <Box component="form" onSubmit={handleForm}>
        <OutlinedInput
          sx={{ backgroundColor: "white" }}
          size="small"
          fullWidth
          id="message-input"
          value={message}
          placeholder="Write your message"
          inputProps={{ "aria-label": "search google maps" }}
          onChange={handleInput}
          endAdornment={
            <InputAdornment position="end">
              <input
                onChange={fileSelected}
                ref={fileRef}
                type="file"
                style={{ display: "none" }}
              />
              <IconButton
                type="button"
                edge="end"
                sx={{ marginRight: 1 }}
                onClick={selectFile}
              >
                <AttachFileIcon />
              </IconButton>
              <IconButton type="submit" edge="end">
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </Card>
  );
}
