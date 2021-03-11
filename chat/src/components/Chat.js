import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import queryString from "query-string";
import Message from "./Message";
import UserList from "./UserList";
import { Input, Transition, List, Menu, Sidebar } from "semantic-ui-react";

let socket;

export default function Chat({ location }) {
  const [room, setRoom] = useState();
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(ENDPOINT);
    setRoom(room);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        let newName = prompt("Enter your name");
        window.location.href = `http://localhost:3000/chat?name=${newName}&room=${room}`;
      }
    });
  }, [location.search, ENDPOINT]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    return (() => {
      socket.off()
    })
  }, [messages]);

  useEffect(() => {
    socket.on("roomData", ({ users }) => {
      setUsersInRoom([
        users.map((name) => {
          return name.name;
        }),
      ]);
      setLoaded(true);
    });
  }, [usersInRoom]);

  const sendMessage = (event) => {
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  const clipboardLink = () => {
    navigator.clipboard.writeText(
      `http://localhost:3000/chat?name=&room=${room}`
    );
  };

  return (
    <div className="chat">
      <Menu>
        <Menu.Item name="Link to chat" onClick={clipboardLink}>
          Link to chat
        </Menu.Item>
      </Menu>

      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible
        width="thin"
      >
        {loaded ? <UserList usersArray={usersInRoom[0]} /> : "loading"}
      </Sidebar>

      <h1>Test Chat</h1>

      <div className="messageBox">
        <Transition.Group
          as={List}
          duration={1500}
          divided
          size="small"
          verticalAlign="middle"
        >
          {messages.map((elem, i) => {
            return (
              <List.Item key={i}>
                <Message
                  key={i}
                  username={elem.user}
                  time={elem.time}
                  text={elem.text}
                />
              </List.Item>
            );
          })}
        </Transition.Group>
      </div>
      <div className='message-input'>
        <Input
          type="text"
          value={message}
          placeholder="..."
          onChange={(event) => setMessage(event.target.value)}
          onKeyPress={(event) => (event.key === "Enter" ? sendMessage() : null)}
        />
      </div>
    </div>
  );
}
