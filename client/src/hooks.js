import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { messagesQuery, addMessageMutation, messageAddedSubscription } from './graphql/queries';

export function useChatMessages() {
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
