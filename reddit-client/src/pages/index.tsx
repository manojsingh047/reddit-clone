import { Box, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React from "react";
import Layout from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import { usePostQueryQuery } from "../generated/graphql";
function Feature({ title, desc, ...rest }) {
  return (
    <Box p={5} shadow="md" borderWidth="1px" {...rest}>
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4}>{desc}</Text>
    </Box>
  );
}
const Index = () => {
  const [{ data }] = usePostQueryQuery();
  console.log('posts***', data?.posts);

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
      {data?.posts.map(post => (
        <Stack spacing={8}>
          <Feature
            title={post.title}
            desc={post.text}
          />
        </Stack>
      ))}

    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

