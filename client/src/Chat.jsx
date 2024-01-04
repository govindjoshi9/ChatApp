import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);
  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
  }

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 pl-4 pt-4">
        <div className="text-blue-600 font-bold flex gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          Random Chat
        </div>
        {Object.keys(onlinePeople).map((userId) => (
          <div className="border-b border-gray-100 py-2 flex items-center gap-2 cursor-pointer">
            <Avatar username={onlinePeople[userId]} userId ={userId} />
            <span>{onlinePeople[userId]}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">messages with selected person</div>
        <div className="flex gap-2 mx-2">
          <input
            type="text"
            placeholder="Type your message here"
            className="bg-white flex-grow border rounded-sm p-2"
          />
          <button className="bg-blue-500 p-2 text-white rounded-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
