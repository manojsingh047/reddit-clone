import { Box, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React from "react";
import Layout from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import { usePostQueryQuery } from "../generated/graphql";
const Index = () => {
  const [{ data }] = usePostQueryQuery({
    variables: {
      limit: 10
    }
  });
  console.log('posts***', data?.posts);

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      {data?.posts.map(post => (
        <Stack key={post.id} spacing={8}>
          <Box p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">{post.title}</Heading>
            <Text mt={4}>{post.textSnippet}</Text>
          </Box>
        </Stack>
      ))}

    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

