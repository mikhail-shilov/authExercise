import mongoose from 'mongoose'
import config from '../config'

mongoose.connection.on('connected', () => {
  console.log('database is connected')
})

mongoose.connection.on('error', (err) => {
  console.log(`database error: ${err}`)
  process.exit(1)
})

exports.connect = async (mongoURL = config.mongoURL) => {
  mongoose.connect(mongoURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  return mongoose.connection
}
