import React from 'react'
import { Box } from '@chakra-ui/core';

export type WrapperVariant = 'small' | 'regular';
interface WrapperProps {
  variant?: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ variant, children }) => {
  return (
    <Box
      mt={8}
      width="100%"
      mx="auto"
      maxW={variant === 'small' ? '400px' : '800px'}
    >
      {children}
    </Box>
  );
}

export default Wrapper;