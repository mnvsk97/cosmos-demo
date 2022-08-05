const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, './.env') })

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoose: {
    uri: process.env.MONGO_DB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  aws: {
    access_key: process.env.AWS_ACCESS_KEY,
    secret_key: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    s3_bucket: process.env.S3_BUCKET,
    preSignedURLExpirySeconds: process.env.S3_PRESIGNED_URL_EXPIRY_SECONDS || 3600
  }
}
