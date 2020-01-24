import http from 'http';
import { readFileSync } from 'fs';
import { ApolloServer } from 'apollo-server-express';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressJwt from 'express-jwt';
import { sign, verify } from 'jsonwebtoken';
import { users } from './db';
import resolvers from './resolvers';

const port = 9000;
const jwtSecret = Buffer.from('xkMBdsE+P6242Z2dPV3RD91BPbLIko7t', 'base64');

const app = express();
app.use(
  cors(),
  json(),
  expressJwt({
    credentialsRequired: false,
    secret: jwtSecret,
  })
);

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf8' });

function context({ req, connection }) {
  // for http (queries and mutations)
  if (req && req.user) {
    return { userId: req.user.sub };
  }
  // for websocket (subscriptions)
  if (connection && connection.context && connection.context.accessToken) {
    const decodedToken = verify(connection.context.accessToken, jwtSecret);
    return { userId: decodedToken.sub };
  }
  return {};
}

const apolloServer = new ApolloServer({ typeDefs, resolvers, context });
apolloServer.applyMiddleware({ app, path: '/graphql' });

app.post('/login', (req, res) => {
  const { name, password } = req.body;
  const user = users.get(name);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);
httpServer.listen(port, () =>
  console.log(`server is listening on http://localhost:${port}/graphql`)
);
