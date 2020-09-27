import { Cache, QueryInput } from "@urql/exchange-graphcache";
import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  return errors.reduce((acc: any, { field, message }) => {
    acc[field] = message;
    return acc;
  }, {});
};

//to get proper types for our operations
export function betterUpdateQuery<Result, Query>(cache: Cache, qi: QueryInput, result: any, fn: (r: Result, q: Query) => Query) {
  cache.updateQuery(qi, data => fn(result, data as any) as any);
}

export const isServer = (): boolean => typeof window === 'undefined';