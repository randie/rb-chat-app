import { PubSub } from 'graphql-subscriptions';
import { messages as _messages } from './db';

const pubSub = new PubSub();

const MESSAGE_ADDED = 'MESSAGE_ADDED';

function requireAuth(userId) {
  if (!userId) {
    throw new Error('Unauthorized');
  }
}

const Query = {
  messages: (_root, _args, { userId }) => {
    requireAuth(userId);
    return _messages.list();
  },
};

const Mutation = {
  addMessage: (_root, { input }, { userId }) => {
    requireAuth(userId);
    const messageId = _messages.create({ from: userId, text: input.text });
    const message = _messages.get(messageId);
    pubSub.publish(MESSAGE_ADDED, { messageAdded: message });
    return message;
  },
};

const Subscription = {
  messageAdded: {
    subscribe: () => pubSub.asyncIterator(MESSAGE_ADDED),
  },
};

export default { Query, Mutation, Subscription };
