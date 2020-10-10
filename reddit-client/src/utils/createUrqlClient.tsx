import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from "urql";
import { ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, User } from "../generated/graphql";
import { betterUpdateQuery } from "./utils";
import { filter, pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from 'next/router';

export const errorExchange: Exchange = ({ forward }) => ops$ => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            // If the OperationResult has an error send a request to sentry
            if (error) {
                console.log(error);
                if (error.message.includes("not authenticated")) {
                    Router.replace('/');
                }
            }
        })
    );
};
export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include' as const
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
            updates: {
                Mutation: {
                    logout: (_result, args, cache, info) => {
                        betterUpdateQuery<LogoutMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            () => {
                                return {
                                    me: null
                                }
                            }
                        )
                    },
                    changePassword: (_result, args, cache, info) => {
                        betterUpdateQuery<ChangePasswordMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, cacheData) => {
                                if (result.changePassword.errors) {
                                    return cacheData;
                                }
                                return {
                                    me: result.changePassword,
                                }
                            }
                        )
                    },
                    login: (_result, args, cache, info) => {
                        betterUpdateQuery<LoginMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, cacheData) => {
                                console.log('result', result)
                                console.log('cacheData', cacheData)
                                if (result.login.errors) {
                                    return cacheData;
                                }
                                return {
                                    me: result.login,
                                }
                            }
                        )
                    },
                    register: (_result, args, cache, info) => {
                        betterUpdateQuery<RegisterMutation, MeQuery>(
                            cache,
                            { query: MeDocument },
                            _result,
                            (result, query) => {
                                console.log('result', result)
                                console.log('query', query)
                                if (result.register.errors) {
                                    return query;
                                }
                                return {
                                    me: result.register
                                }
                            }
                        )
                    },
                },
            },
        }),
        ssrExchange,
        errorExchange,
        fetchExchange
    ],
});
