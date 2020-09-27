import React from 'react'
import { Formik, Form } from 'formik';
import { Button, Box, Heading } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/utils';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
interface LoginProps {
}

const Login: React.FC<LoginProps> = () => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Heading mb={10} textAlign="center">Login</Heading>
      <Formik
        initialValues={{
          userName: '',
          password: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const response = await login({
            options: {
              userName: values.userName,
              password: values.password
            }
          });
          if (!!response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (!!response.data?.login.user) {
            console.log(response);
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="userName"
                placeholder="userName"
                label="Username"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                type="password"
                label="Password"
              />
            </Box>
            <Button mt={4} type="submit" isLoading={isSubmitting} variantColor="teal">
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
export default withUrqlClient(createUrqlClient)(Login);