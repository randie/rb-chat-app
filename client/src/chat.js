import React from 'react';
import { useChatMessages } from './hooks';
import MessageInput from './message-input';
import MessageList from './message-list';

function Chat({ user }) {
  const { messages, addMessage } = useChatMessages();

  const handleSend = async text => {
    await addMessage(text);
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
}

export default Chat;
