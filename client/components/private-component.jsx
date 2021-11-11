import React from 'react'
import { useSelector } from 'react-redux'
import Head from './head'

const Private = () => {
  const email = useSelector((state) => state.auth.user.email)
  return (
    <div>
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div>Hello, {email}. This is Private component!!!</div>
      </div>
    </div>
  )
}

Private.propTypes = {}

export default React.memo(Private)
