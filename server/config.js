require('dotenv').config()

const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
 // isSocketsEnabled: process.env.ENABLE_SOCKETS,
  isSocketsEnabled: false,
  mongoURL: process.env.MONGO_URL,
  secret: process.env.SECRET_JWT || 'secretKey'
}

export default options
