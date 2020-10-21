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
  // console.log('qi', qi);
  // console.log('__result', result);
  // console.log('_cache', cache);

  cache.updateQuery(qi, data => {
    const updateResult = fn(result, data as any) as any;
    // console.log('updateResult', updateResult);
    return updateResult
  });
}

export const isServer = (): boolean => typeof window === 'undefined';