import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Head from './head'

const Private = () => {
  const userName = useSelector((state) => state.auth.user.email)
  const userName2 = useSelector((state) => state.auth.user)

  useEffect(() => {
    console.log(userName)
    console.log(userName2)
  }, [userName])


  return (
    <div>
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-gray-800 hover:text-red-500 text-white font-bold rounded-lg border shadow-lg p-10">
          Hello, {userName} <br />
          This is Private component
        </div>
      </div>
    </div>
  )
}

Private.propTypes = {}

export default React.memo(Private)
