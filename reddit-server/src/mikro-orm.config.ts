import { IS_PROD } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
export default {
  dbName: "dbreddit",
  user: "postgres",
  password: "manoj1234",
  type: "postgresql",
  entities: [Post,User],
  debug: !IS_PROD,
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
} as Parameters<typeof MikroORM.init>[0];
