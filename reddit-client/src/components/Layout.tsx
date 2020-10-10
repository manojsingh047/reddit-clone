import React, { Children, FC } from 'react'
import { Navbar } from './Navbar'
import Wrapper, { WrapperVariant } from './Wrapper'
export interface IProps {
    variant?: WrapperVariant,
}
const Layout: FC<IProps> = ({ children, variant }) => {
    return (
        <>
            <Navbar />
            <Wrapper variant={variant}>
                {children}
            </Wrapper>
        </>
    )
}

export default Layout
