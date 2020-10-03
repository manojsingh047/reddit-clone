import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from "urql";
import { ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, User } from "../generated/graphql";
import { betterUpdateQuery } from "./utils";

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
        credentials: 'include' as const
    },
    exchanges: [dedupExchange, cacheExchange({
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
        fetchExchange],
});
