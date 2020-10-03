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
import { NextPage } from 'next';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');
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
                        password: values.password,
                        rePassword: values.rePassword
                    });
                    if (!!response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors);
                        setErrors(errorMap);
                        if ('token' in errorMap) {
                            setTokenError(errorMap['token']);
                        }
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
                        <Box mt={2}>
                            <p style={{
                                color: 'red'
                            }}>{tokenError}</p>
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

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
