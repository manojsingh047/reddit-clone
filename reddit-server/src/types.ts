import { Request, Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request & { session: Express.Session }; //& joins the types
  res: Response;
  redisClient: Redis;
};
