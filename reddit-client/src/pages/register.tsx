import React from 'react'
import {Formik, Form} from 'formik';
import { FormControl, FormLabel, Input } from '@chakra-ui/core';
interface RegisterProps {
}

export const Register: React.FC<RegisterProps> = () => {
    return (
      <Formik
        initialValues={{
          userName:'',
          password:'',
          firstName:'',
          lastName:''
        }}
        onSubmit={
          (values) => console.log(values)
        }
      >
        {({values}) => (
          <Form>
<FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input id="username" placeholder="username" />
                {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
              </FormControl>
          </Form>
        )}
      </Formik>
    );
}
export default Register;