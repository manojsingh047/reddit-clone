import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";
export const isAuthMiddleware: MiddlewareFn<MyContext> = async ({ context }, next) => {
    console.log('req:::', context.req.session);

    if (!context.req.session.userId) {
        throw new Error("User not authenticated");
    }
    return next();
};