import React from 'react'
import { Formik, Form } from 'formik';
import { Button, Box, Heading } from '@chakra-ui/core';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
interface RegisterProps {
}

export const Register: React.FC<RegisterProps> = () => {
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
        onSubmit={
          (values) => console.log(values)
        }
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