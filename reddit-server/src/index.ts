import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __serverPort__, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from 'cors';

let RedisStore = connectRedis(session);
let redisClient = redis.createClient();

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();
  app.listen(__serverPort__, () => {
    console.log("running server on 4000..");
  });
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //almost 10 years
        httpOnly: true, //coookie can't be accessed by frontend code
        secure: __prod__, //cookie works only on https
        sameSite: "lax", //csrf
      },
      name: "sessionId",
      secret: "password",
      resave: false,
      saveUninitialized: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
};

main().catch((err) => {
  console.error(err);
});
