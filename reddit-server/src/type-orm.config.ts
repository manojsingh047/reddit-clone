import { IS_PROD } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "manoj1234",
  database: "dbreddit2",
  entities: [Post, User],
  synchronize: true,
  logging: !IS_PROD
};

