import React from 'react'
import { Formik, Form } from 'formik';
import { Button, Box, Heading } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useMutation, useQuery } from 'urql';
import { useMeQuery, useRegisterMutation } from '../generated/graphql';
import { log } from 'console';
import { toErrorMap } from '../utils/utils';
interface RegisterProps {
}


export const Register: React.FC<RegisterProps> = () => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  //todo - this is not needed
  const [] = useMeQuery();

  return (
    <Wrapper variant="small">
      <Heading mb={10} textAlign="center">Sign Up</Heading>
      <Formik
        initialValues={{
          userName: '',
          password: '',
          firstName: '',
          lastName: ''
        }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const response = await register({
            options: {
              loginInput: {
                userName: values.userName,
                password: values.password
              },
              firstName: values.firstName,
              lastName: values.lastName
            }
          });
          if (!!response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (!!response.data?.register.user) {
            console.log(response);
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="firstName"
              placeholder="firstName"
              label="First Name"
            />
            <Box mt={4}>
              <InputField
                name="lastName"
                placeholder="lastName"
                label="Last Name"
              />
            </Box>
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
export default Register;