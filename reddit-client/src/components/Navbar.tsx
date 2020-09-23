import { Box, Flex, Link } from '@chakra-ui/core';
import React from 'react'
import { useMeQuery } from '../generated/graphql'
import NextLink from 'next/link'

export const Navbar = () => {
    const [{ fetching, data }] = useMeQuery();
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
                <NextLink href="/login">
                    <Link>Logout</Link>
                </NextLink>
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
