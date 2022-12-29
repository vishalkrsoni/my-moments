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




// const uploadImageToS3 = (req, res) => {
//   console.log('upload')
//   res.send({
//     imageUrl: req.file.location
//   })
// }

// const fetchImagesFromS3 = async (req, res) => {
//   let pictures = await s3.listObjectsV2({
//     bucket: Bucket
//   }).promise()

//   let fileNames = pictures.Contents.map(item => item.key)
//   res.send({
//     fileNames
//   })
// }

// const downloadImageFromS3 = async (req, res) => {
//   const fileName = req.params.fileName
//   let pic = await s3.getObject({
//     bucket: Bucket,
//     key: fileName
//   }).promise()

//   res.send(pic.Body)
// }

// const deleteImageFromS3 = async (req, res) => {
//   const fileName = req.params.fileName
//   let pic = await s3.deleteObject({
//     bucket: Bucket,
//     key: fileName
//   }).promise()

//   res.send({
//     message: 'deleted',
//     pic
//   })
// }

// app.post('/upload', upload.single('file'), uploadImageToS3)
// app.get('/list', upload.single('file'), fetchImagesFromS3)
// app.get('/download/:fileName', upload.single('file'), downloadImageFromS3)
// app.delete('/delete/:fileName', upload.single('file'), deleteImageFromS3)



app.post('/', upload.single('file'), async (req, res) => {
  try {
    let url = await req.file.location
    console.log('upload')
    res.send({
      imageUrl: url
    })
  } catch (err) {
    console.log(err)
    res.send(err)
  }
})

app.get('/list', async (req, res) => {
  let pictures = await s3.listObjectsV2({
    bucket: Bucket
  }).promise()
  let fileNames = pictures.Contents.map(item => item.key)
  res.send({
    fileNames
  })
})


app.get('/:fileName', async (req, res) => {
  const fileName = req.params.fileName
  let pic = await s3.getObject({

    bucket: Bucket,
    key: fileName
  }).promise()

  res.send(pic.Body)
})
app.delete('/:fileName', async (req, res) => {
  const fileName = req.params.fileName
  let pic = await s3.deleteObject({
    bucket: Bucket,
    key: fileName
  }).promise()

  res.send({
    message: 'deleted',
    pic

  })
})


// module.exports = {
//   uploadImageToS3,
//   downloadImageFromS3,
//   deleteImageFromS3,
//   fetchImagesFromS3
// }