/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const Chat: React.FC = () => {
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); 

  const userId1 = localStorage.getItem("userId");
  const userId2 = localStorage.getItem("selectedStudent");
  const username = localStorage.getItem("studentName");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    if (!userId1 || !userId2) {
      setError("Sorry, we are facing some problems currently.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/messages",
        {
          userId1,
          userId2,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setMessages(response.data.data);
        scrollToBottom();
      }
    } catch (err) {
      setError("Please try again after sometime.");
    }
  };

  const handleSendMessage = async () => {
    if (!userId1 || !userId2) {
      setError("Sorry, we are facing some problems currently.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/messages/create",
        {
          content: messageContent,
          sender: [userId1],
          receiver: [userId2],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setMessageContent("");
        setSuccess("");
        scrollToBottom(); 
      }
    } catch (err) {
      setError("Failed to send the message. Please try again.");
    }
  };

  useEffect(() => {
    fetchMessages();

    socket.on("newMessage", (newMessage) => {
      if (
        (newMessage.sender === userId1 && newMessage.receiver === userId2) ||
        (newMessage.sender === userId2 && newMessage.receiver === userId1)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        scrollToBottom(); // Scroll when a new message is received
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [userId1, userId2]);

  useEffect(() => {
    scrollToBottom(); // Scroll whenever messages change
  }, [messages]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>{username}</h1>
      <div
        style={{
          height: "350px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.length > 0 ? (
          messages.map((message) => {
            const isSender = String(message.sender) === String(userId1);
            return (
              <div
                key={message._id}
                style={{
                  textAlign: isSender ? "right" : "left",
                  margin: "10px 0",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: isSender ? "#d1f0ff" : "#e0e0e0",
                    maxWidth: "60%",
                    wordWrap: "break-word",
                  }}
                >
                  {message.content}
                </div>
              </div>
            );
          })
        ) : (
          <p>No messages yet. Start a conversation!</p>
        )}
        <div ref={messagesEndRef} /> {/* Reference to scroll to */}
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", textAlign: "center" }}>{success}</p>
      )}

      <textarea
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        placeholder="Type your message here..."
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
        }}
      />

      <button
        type="button"
        onClick={handleSendMessage}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#2980b9";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#3498db";
        }}
      >
        Send Message
      </button>
    </div>
  );
};

export default Chat;
