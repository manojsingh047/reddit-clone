import { Heading, Box, Flex, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const CreatePost = () => {
    const [{ data, fetching }] = useMeQuery();
    const router = useRouter();

    console.log("create me", data);

    useEffect(() => {
        if (!fetching && !data?.me?.user) {
            router.replace('/login');
            console.log('not logged in');
        }
    }, [data, fetching, router])

    const [, createPost] = useCreatePostMutation();

    return (
        <Layout variant="small">
            <Heading mb={10} textAlign="center">Create Post</Heading>
            <Formik
                initialValues={{
                    text: '',
                    title: '',
                }}
                onSubmit={async (values) => {
                    console.log(values);
                    const response = await createPost(values);
                    if (!response.error) {
                        router.push('/');
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <Box mt={4}>
                            <InputField
                                name="title"
                                placeholder="Title"
                                label="Title"
                            />
                        </Box>
                        <Box mt={4}>
                            <InputField
                                isTextArea
                                name="text"
                                placeholder="Text..."
                                label="Text"
                            />
                        </Box>
                        <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
                            Create
                        </Button>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(CreatePost);
