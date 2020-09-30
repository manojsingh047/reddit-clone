import { Box, Button, Heading } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword = () => {
    const [, forgot] = useForgotPasswordMutation();
    const [msg, setMsg] = useState('');
    return (
        <Wrapper variant="small">
            <Heading mb={10} textAlign="center">Forgot Password</Heading>
            <Formik
                initialValues={{
                    email: '',
                }}
                onSubmit={async (values) => {
                    console.log(values);
                    await forgot({
                        email: values.email
                    });
                    setMsg('An password reset link as been sent to your email.')
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <Box mt={4}>
                            <InputField
                                name="email"
                                placeholder="email"
                                label="Email"
                                type="email"
                                required
                            />
                        </Box>
                        <Box mt={2}>
                            <p>{msg}</p>
                        </Box>
                        <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(ForgotPassword);
