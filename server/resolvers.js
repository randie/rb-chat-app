import { messages as _messages } from './db';

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
    return _messages.get(messageId);
  },
};

export default { Query, Mutation };
