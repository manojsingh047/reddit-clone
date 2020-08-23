import { MikroORM } from "@mikro-orm/core";
import { __serverPort__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();
  app.listen(__serverPort__, () => {
    console.log("running server on 4000..");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });
  apolloServer.applyMiddleware({ app });
};

main().catch((err) => {
  console.error(err);
});
