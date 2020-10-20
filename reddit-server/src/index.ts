import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from 'cors';
import express from "express";
import session from "express-session";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from 'typeorm';
import { COOKIE_NAME, IS_PROD, SERVER_PORT } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import path from 'path';

const Redis = require("ioredis");
let RedisStore = connectRedis(session);
let redisClient = new Redis();

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "manoj1234",
    database: "dbreddit2",
    entities: [Post, User],
    synchronize: true,
    logging: !IS_PROD,
    migrations: [path.join(__dirname, './migrations/*')]
  });

  // await conn.runMigrations();

  // await Post.delete({});

  const app = express();
  app.listen(SERVER_PORT, () => {
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
        secure: IS_PROD, //cookie works only on https
        sameSite: "lax", //csrf
      },
      name: COOKIE_NAME,
      secret: "password", //some password
      resave: false,
      saveUninitialized: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res, }) => ({ req, res, redisClient }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
};

main().catch((err) => {
  console.error(err);
});
