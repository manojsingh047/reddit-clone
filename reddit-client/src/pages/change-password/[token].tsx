import { Box, Button, Heading } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router'
import { toErrorMap } from '../../utils/utils';

const ForgotPassword = () => {
    const [, changePassword] = useChangePasswordMutation();
    const router = useRouter()
    const { token } = router.query;
    return (
        <Wrapper variant="small">
            <Heading mb={10} textAlign="center">Change Password</Heading>
            <Formik
                initialValues={{
                    password: '',
                    rePassword: ''
                }}
                onSubmit={async (values, { setErrors }) => {
                    console.log(values);
                    const response = await changePassword({
                        token: token as string,
                        password: values.password
                    });
                    if (!!response.data?.changePassword.errors) {
                        setErrors(toErrorMap(response.data.changePassword.errors));
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="password"
                                type="password"
                                required
                            />
                            <InputField
                                name="rePassword"
                                placeholder="enter same password again"
                                label="re-password"
                                type="password"
                                required
                            />
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
