import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import { ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation, User, VoteMutationVariables } from "../generated/graphql";
import { betterUpdateQuery, isServer } from "./utils";
import { pipe, tap } from 'wonka';
import { Exchange } from 'urql';
import Router from 'next/router';
import gql from 'graphql-tag';
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
const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;
        const allFields = cache.inspectFields(entityKey);
        const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }

        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isItInTheCache = cache.resolve(
            cache.resolveFieldByKey(entityKey, fieldKey) as string,
            "posts"
        );
        info.partial = !isItInTheCache;
        let hasMore = true;
        const results: string[] = [];
        fieldInfos.forEach((fi) => {
            const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
            const data = cache.resolve(key, "posts") as string[];
            const _hasMore = cache.resolve(key, "hasMore");
            if (!_hasMore) {
                hasMore = _hasMore as boolean;
            }
            results.push(...data);
        });

        return {
            __typename: "PaginatedPosts",
            hasMore,
            posts: results,
        };
    };
};
export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = '';
    if (isServer()) {
        cookie = ctx.req.headers.cookie
    }
    return {
        url: 'http://localhost:4000/graphql',
        fetchOptions: {
            credentials: 'include' as const,
            headers: {
                cookie
            }
        },
        exchanges: [
            dedupExchange,
            cacheExchange({
                resolvers: {
                    Query: {
                        posts: cursorPagination(),
                    },
                },
                updates: {
                    Mutation: {
                        vote: (_result, args, cache, info) => {
                            const { postId, value } = args as VoteMutationVariables;
                            const data = cache.readFragment(
                                gql`
                            fragment _ on Post{
                                id
                                points
                                voteStatus
                            }`,
                                { id: postId } as any
                            );
                            if (data) {
                                if (data.voteStatus === value) {
                                    return;
                                }
                                const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                                cache.writeFragment(
                                    gql`
                                fragment _ on Post{
                                    points
                                    voteStatus
                                }`,
                                    { id: postId, points: newPoints, voteStatus: value } as any
                                );
                            }
                        },
                        createPost: (_result, args, cache, info) => {
                            const allFields = cache.inspectFields("Query");
                            const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
                            fieldInfos.forEach((fi) => {
                                cache.invalidate("Query", "posts", fi.arguments || {})
                            });
                        },
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
    }
};
