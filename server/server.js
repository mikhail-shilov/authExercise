import express from 'express'
import path from 'path'
import cors from 'cors'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import passportJWT from './services/passport'
import auth from './middleware/auth'

import mongooseService from './services/mongoose'
import User from './model/User.model'

import config from './config'
import Html from '../client/html'

require('colors')

let Root
mongooseService.connect()

/*
// This code is testing db operations. It's creating new dummy-user.

const user = new User({
email: 'test@test.com',
password: 'test'
})

user.save()
 */

try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/ssr/root.bundle').default
} catch {
  console.log('SSR not found. Please run "yarn run build:ssr"'.red)
}

let connections = []
const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  passport.initialize(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  express.json({ limit: '50mb', extended: true }),
  cookieParser()
]
passport.use('jwt', passportJWT.jwt)

middleware.forEach((it) => server.use(it))

server.get('/api/v1/cookies', (req, res) => {
  res.cookie('serverSide', 'Set!', { path: '/', maxAge: 60 * 60, httpOnly: true })
  res.json({ req: req.cookies, status: 'ok!' })
})

/*
// Simple testing api.
server.post('/api/v1/auth', (req, res) => {
  console.log(req.body)
  res.json({ body: req.body, status: 'ok!' })
})
 */

server.post('/api/v1/auth', async (req, res) => {
  try {
    const userRecord = await User.findAndValidateUser(req.body)
    const payload = { uid: userRecord.id }
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    const user = { id: userRecord.id, email: userRecord.email }
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user })
  } catch (err) {
    console.log(err)
    res.json({ status: 'error', err })
  }
})

server.get('/api/v1/auth', async (req, res) => {
  console.log('connections', connections)

  try {
    const jwtUser = jwt.verify(req.cookies.token, config.secret)
    const userRecord = await User.findById(jwtUser.uid)
    const payload = { uid: userRecord.id }
    const token = jwt.sign(payload, config.secret, { expiresIn: '48h' })
    // const { password, ...user } = userRecord
    connections.forEach((connection) => connection.write('fsdfsdfsdf'))
    const user = { id: userRecord.id, email: userRecord.email }
    console.log('user',user)
    console.log('userRecord',userRecord)
    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 48 })
    res.json({ status: 'ok', token, user })
  } catch (err) {
    console.log(err)
    res.json({ status: 'error', err })
  }
})

server.get('/api/v1/user-info', auth(['user']), (req, res) => {
  res.json({ status: 'pass' })
})

server.post('/api/v1/msg', (req, res) => {
  connections.forEach((connection) => {
    connection.write(req.body.message)
  })
  console.log(connections)
  res.json({ added: req.body.message})
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {

    connections.push(conn)
    // console.log('connection is!', connections)
    // console.log(`${connections.length} items of connections`)

    conn.on('data', async () => {
    })

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
console.log(`Serving at http://localhost:${port}`)
