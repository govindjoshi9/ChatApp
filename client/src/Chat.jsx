import React, { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./userContext";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id } = useContext(UserContext);
  const [newMessageTest, setNewMessageTest] = useState('')
  const [messages, setMessages] = useState([])
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
    console.log({ev,messageData})
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    }
    else {
      console.log({messageData})
    }
  }
  const onlinePeopleOur = {...onlinePeople };
  delete onlinePeopleOur[id];

  function sendMessage(ev) {
    ev.preventDefault();
    // ws.send('test');
    ws.send(JSON.stringify({
      message: {
        recipient: selectedUserId,
        text: newMessageTest,
      }
    }));
    setNewMessageTest('');
    setMessages(prev => ([...prev,{text: newMessageTest,isOur:true}]))
  }

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 ">
        <Logo />
        {Object.keys(onlinePeopleOur).map((userId) => (
          <div
            key={userId}
            onClick={() => setSelectedUserId(userId)}
            className={`border-b border-gray-100  flex items-center gap-2 cursor-pointer + ${
              userId === selectedUserId ? "bg-blue-50" : ""
            }`}
          >
            {userId === selectedUserId && (
              <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}
            <div className="flex gap-2 pl-4 items-center">
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span>{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex  h-full items-center flex-grow justify-center">
              <div className="text-gray-400">&larr; Select a person for chat</div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <div >
            {messages.map(message => {
              <div>{message.text}</div>
            })}
          </div>
          )}

        {!!selectedUserId && (
        <form className="flex gap-2 " onSubmit={sendMessage } >
          <input
            type="text"
            value={newMessageTest}
            onChange={ev=>setNewMessageTest(ev.target.value)}
            placeholder="Type your message here"
            className="bg-white flex-grow border rounded-sm p-2"
          />
          <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
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
        </form>
        )}
      </div>
    </div>
  );
}
