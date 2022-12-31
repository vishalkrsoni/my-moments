const express = require('express')
const dotenv = require('dotenv')
const aws = require('aws-sdk');
const multer = require('multer')
const multerS3 = require('multer-s3')
const sharp = require('sharp')
dotenv.config()

const port = process.env.PORT
const app = express();

// configuring  aws instance
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});


const Bucket = process.env.AWS_BUCKET_NAME
const s3 = new aws.S3()

// configuring for multer 
const upload = multer({
  storage: multerS3({
    bucket: Bucket,
    s3: s3,
    // acl: 'public-read', // access control list
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
    ],
    key: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
    }
  })
})

app.listen(port, () => console.log(`server started at http://localhost:${port}`))

app.post('/', upload.single('file'), async (req, res) => {
  try {
    let url = await req.file.location
    let fileName = await req.file.key
    console.log('upload', fileName)

    res.send({
      imageUrl: url
    })
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})

app.get('/list', async (req, res) => {
  try {
    let pictures = await s3.listObjectsV2({ Bucket }).promise()
    let picsList = pictures.Contents.map(item => item.Key)
    res.send({
      picsList
    })
  } catch (err) {
    res.send(err)
  }
})

app.get('/:fileName', async (req, res) => {
  const fileName = req.params.fileName
  try {
    let pic = await s3.getObject({
      Bucket,
      Key: fileName
    }).promise()
    res.send(pic.Body)
  } catch (err) {
    res.send(err)
  }
})

app.delete('/:fileName', async (req, res) => {
  const fileName = req.params.fileName
  try {
    let pic = await s3.deleteObject({
      Bucket,
      Key: fileName
    }).promise()
    res.send({
      message: 'deleted',
      pic
    })
  } catch (err) {
    res.send(err)
  }
})

