import { Link } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React from "react";
import Layout from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link'
import { usePostQueryQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostQueryQuery();
  console.log('posts***', data?.posts);

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create Post</Link>
      </NextLink>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

