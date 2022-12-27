const multer = require('multer')
const multerS3 = require('multer-s3-transform')
const sharp = require('sharp')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    shouldTransform: true,
    transforms: [
      {
        id: 'original',
        key: (req, file, cb) => cb(null, new Date().getTime() + '_' + req.file.originalname),
        transform: (req, file, cb) => cb(null, sharp().jpeg())
      },

      {
        id: 'small',
        key: (req, file, cb) => cb(null, new Date().getTime() + '_small_' + req.file.originalname),
        transform: (req, file, cb) => cb(null, sharp().resize(400, 300).jpeg())
      }
    ]
  })
})
module.exports = fileUpload;
