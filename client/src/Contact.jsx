import React from 'react'

export default function Contact({userId}) {
  return (
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
        <Avatar online={true} username={onlinePeople[userId]} userId={userId} />
        <span>{onlinePeople[userId]}</span>
      </div>
    </div>
  );
}
