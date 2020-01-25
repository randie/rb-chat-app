import React from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { messagesQuery, addMessageMutation, messageAddedSubscription } from './graphql/queries';
import MessageInput from './message-input';
import MessageList from './message-list';

function useChatMessages() {
  // query - get all chat messages
  const { data } = useQuery(messagesQuery);
  const messages = data ? data.messages : [];

  // subscription - subscribe to new chat messages added
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      client.writeData({
        data: { messages: messages.concat(subscriptionData.data.messageAdded) },
      });
    },
  });

  // mutation - add a chat message
  const [addMessage] = useMutation(addMessageMutation);

  return {
    messages,
    addMessage: text =>
      addMessage({
        variables: { input: { text } },
      }),
  };
}

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
