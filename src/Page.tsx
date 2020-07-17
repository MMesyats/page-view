import React from 'react'
import { IPage } from '../index'

const Page: React.FC<IPage> = ({ children, className }): JSX.Element => {
  return (
    <div
      className={className}
      style={{
        width: 'inherit',
        height: 'inherit',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  )
}

export default Page
