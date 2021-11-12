import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getSocket } from '../redux'
import Head from './head'

const Private = () => {
  const email = useSelector((state) => state.auth.user.email)

  const [nickName, setNickName] = useState('Username')
  const [chatMessage, setChatMessage] = useState('')

  const sendHandler = () => {
    const socket = getSocket()
    const msg = `#${nickName}>> ${chatMessage}`
    setChatMessage('')
    socket.send(msg)
  }

  return (
    <div>
      <Head title="Hello" />
      <div className="flex flex-col items-center justify-center h-screen">
        <div>Hello, {email}. This is Private component!!!</div>
        <div className="flex flex-row border">
          <input
            type="text"
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value)
            }}
          />
          <input
            className="border"
            type="text"
            value={chatMessage}
            placeholder="Enter your message"
            onChange={(e) => {
              setChatMessage(e.target.value)
            }}
          />
          <button type="button" onClick={sendHandler}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

Private.propTypes = {}

export default React.memo(Private)
