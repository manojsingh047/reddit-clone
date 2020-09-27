import { Box, Flex, Link } from '@chakra-ui/core';
import React from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import NextLink from 'next/link'
import { isServer } from '../utils/utils';
export const Navbar = () => {
    const [{ fetching, data }] = useMeQuery({
        pause: isServer()
    });
    const [, logout] = useLogoutMutation();
    let renderEle;
    if (!data?.me) {
        //logged out
        renderEle = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>Register</Link>
                </NextLink>
            </>
        )
    } else {
        renderEle = (
            <>
                <Link mr={2}>{data?.me?.userName}</Link>
                <Link onClick={() => logout()}>Logout</Link>
            </>
        )
    }
    return (
        <Flex backgroundColor="tomato" p={4}>
            <Box ml="auto">
                {renderEle}
            </Box>
        </Flex>
    )
}
