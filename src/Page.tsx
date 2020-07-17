import React from 'react'
import { IPage } from '../index';

const Page:React.FC<IPage> = ({children}):JSX.Element => {
    return (
        <div style={{
            width:'inherit',
            height: 'inherit',
            overflow: 'hidden',
        }}>
            {children}
        </div>
    )
}

export default Page