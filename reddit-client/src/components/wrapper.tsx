import React from 'react'
import { Box } from '@chakra-ui/core';

interface WrapperProps {
  variant?: 'small' | 'regular';
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