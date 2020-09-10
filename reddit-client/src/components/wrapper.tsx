import React from 'react'
import { Box } from '@chakra-ui/core';

interface WrapperProps {
  variant? : 'small' | 'regular';
}

const Wrapper: React.FC<WrapperProps> = ({variant}) => {
    return (
      <Box 
      mt={8}
      width={variant === 'small' ? '400px' : '100px'}
      maxW={"100%"}
      ></Box>
    );
}

export default Wrapper;