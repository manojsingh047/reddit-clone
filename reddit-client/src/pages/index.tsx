import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import { usePostQueryQuery } from "../generated/graphql";
const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as string | null
  })
  const [{ data, fetching }] = usePostQueryQuery({ variables });
  // console.log('posts***', data?.posts);
  if (!fetching && !data) {
    return <div>got no data</div>
  }
  return (
    <Layout>
      <Flex alignItems="center" mb={8}>
        <Heading>Reddit Clone</Heading>
        <Box ml="auto">
          <NextLink href="/create-post">
            <Link>Create Post</Link>
          </NextLink>
        </Box>
      </Flex>

      {!data && fetching ? (
        <div>loading...</div>
      ) : (
          data!.posts.posts.map(post => (
            <Stack key={post.id} spacing={8}>
              <Box p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{post.title}</Heading>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
            </Stack>
          ))
        )}

      {!!data && data.posts.hasMore && <Flex>
        <Button m="auto" my={4} onClick={() => setVariables({
          limit: variables.limit,
          cursor: data?.posts.posts[data.posts.posts.length - 1].createdAt
        })} isLoading={fetching}>Load More</Button>
      </Flex>}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

