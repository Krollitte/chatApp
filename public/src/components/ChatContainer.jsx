import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { ChatInput } from "./ChatInput";
import { Logout } from "./Logout";

import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
export function ChatContainer({ currentChat, currentUser, socket }) {
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const handleSendMessage = async (message) => {
    const data = await JSON.parse(localStorage.getItem("chat-app-user"));
    await axios.post(
      sendMessageRoute,
      {
        from: data._id,
        to: currentChat._id,
        message: message,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    socket.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg: message,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: message });
    setMessages(msgs);
  };

  const getAllMessages = async () => {
    if (currentChat !== undefined) {
      const data = await JSON.parse(localStorage.getItem("chat-app-user"));
      const response = await axios.post(
        getAllMessagesRoute,
        {
          from: data._id,
          to: currentChat._id,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      setMessages(response.data);
    }
  };
  useEffect(() => {
    getAllMessages();
  }, [currentChat]);
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem("chat-app-user"))._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  useEffect(() => {
    if (socket) {
      socket.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  });

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((message) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "recieved"
                    }`}
                  >
                    <div className="content">
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
                // <Messages />
              );
            })}
          </div>
          <div className="chat-input">
            <ChatInput handleSendMessage={handleSendMessage} />
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
