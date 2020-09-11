import React, { FC, InputHTMLAttributes } from 'react'
import { type } from 'os';
import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/core';
import { useField } from 'formik';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

const InputField: FC<InputFieldProps> = ({
  size: _,
  ...props
}) => {
  const [field, { error, touched }] = useField(props);
  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input {...field} {...props} id={field.name} placeholder={props.placeholder} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
export default InputField;