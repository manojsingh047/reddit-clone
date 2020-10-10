import React, { FC, InputHTMLAttributes } from 'react'
import { type } from 'os';
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/core';
import { useField } from 'formik';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  isTextArea?: boolean;
};

const InputField: FC<InputFieldProps> = ({
  size: _,
  ...props
}) => {
  const [field, { error, touched }] = useField(props);
  const C = props.isTextArea ? Textarea : Input;
  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <C {...field} {...props} id={field.name} placeholder={props.placeholder} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
}
export default InputField;