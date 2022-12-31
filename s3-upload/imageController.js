

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

// module.exports = {
//   uploadImageToS3,
//   downloadImageFromS3,
//   deleteImageFromS3,
//   fetchImagesFromS3
// }


// app.post('/upload', upload.single('file'), uploadImageToS3)
// app.get('/list', upload.single('file'), fetchImagesFromS3)
// app.get('/download/:fileName', upload.single('file'), downloadImageFromS3)
// app.delete('/delete/:fileName', upload.single('file'), deleteImageFromS3)
